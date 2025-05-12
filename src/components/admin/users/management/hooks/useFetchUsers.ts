
import { useState, useCallback, useRef } from 'react';
import { User } from '../../types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

export const useFetchUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastFetchTime, setLastFetchTime] = useState(0);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();
  const { adminUser } = useAdminAuth();
  const isFetchingRef = useRef(false);

  const fetchUsers = useCallback(async (forceRefresh = false) => {
    const now = Date.now();
    
    // Prevent concurrent fetches and implement smarter debouncing
    if (isFetchingRef.current) {
      console.log('useFetchUsers: Fetch already in progress, skipping');
      return users;
    }
    
    // Only debounce if not a forced refresh and recent fetch occurred
    if (!forceRefresh && now - lastFetchTime < 1000) {
      console.log('useFetchUsers: Debouncing fetch request');
      return users;
    }
    
    isFetchingRef.current = true;
    setLastFetchTime(now);
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('useFetchUsers: Fetching users from Supabase auth', forceRefresh ? '(forced refresh)' : '');
      
      // Fetch users from auth.users via a Supabase function
      const { data: authUsersData, error: authUsersError } = await supabase.functions.invoke('fetch-users', {
        method: 'GET'
      });
      
      if (authUsersError) {
        console.error('useFetchUsers: Error fetching auth users:', authUsersError);
        const errorObj = new Error(authUsersError.message || 'Failed to load users');
        setError(errorObj);
        toast({
          title: 'Error',
          description: 'Failed to load users. Please try again.',
          variant: 'destructive',
        });
        return users;
      }
      
      console.log('useFetchUsers: Raw edge function response:', authUsersData);
      console.log('useFetchUsers: First user raw data from edge function:', authUsersData?.users?.[0]);
      
      // Map users with their profiles, ensuring all subscription fields are properly retrieved
      const mappedUsers: User[] = authUsersData?.users?.map((authUser: any) => {
        console.log('useFetchUsers: Processing user:', authUser.id);
        console.log('useFetchUsers: User subscription fields from edge function:', {
          subscription_plan: authUser.subscription_plan,
          subscription_period: authUser.subscription_period,
          subscription_amount: authUser.subscription_amount,
          subscription_status: authUser.subscription_status,
          subscription_start_date: authUser.subscription_start_date,
          subscription_end_date: authUser.subscription_end_date,
          stripe_customer_id: authUser.stripe_customer_id,
          stripe_subscription_id: authUser.stripe_subscription_id
        });
        
        // Get the profile data from our enhanced structure
        const profile = authUser.profile || {};
        console.log('useFetchUsers: Profile data:', profile);
        
        const user: User = {
          id: authUser.id,
          email: authUser.email || 'No email',
          last_sign_in_at: authUser.last_sign_in_at,
          created_at: authUser.created_at,
          updated_at: authUser.updated_at || null,
          app_metadata: {
            provider: authUser.app_metadata?.provider || 'email',
            providers: authUser.app_metadata?.providers || ['email'],
          },
          user_metadata: {
            first_name: authUser.raw_user_meta_data?.first_name || profile.first_name || authUser.first_name || '',
            last_name: authUser.raw_user_meta_data?.last_name || profile.last_name || authUser.last_name || '',
            name: authUser.raw_user_meta_data?.full_name || authUser.raw_user_meta_data?.name || profile.username || authUser.email?.split('@')[0] || 'User',
            full_name: authUser.raw_user_meta_data?.full_name || authUser.raw_user_meta_data?.name || profile.username || '',
            email: authUser.email,
            phone: authUser.raw_user_meta_data?.phone || profile.phone || authUser.phone || '',
            country_code: authUser.raw_user_meta_data?.country_code || profile.country_code || '',
            street_address: authUser.raw_user_meta_data?.street_address || '',
            city: authUser.raw_user_meta_data?.city || '',
            state: authUser.raw_user_meta_data?.state || '',
            zip_code: authUser.raw_user_meta_data?.zip_code || '',
            country: authUser.raw_user_meta_data?.country || '',
          },
          is_active: authUser.is_active !== false,
          // Ensure admin status comes from the profile
          is_admin: authUser.is_admin === true,
          admin_role: authUser.admin_role || null,
          permissions: authUser.permissions || [],
          // Map all subscription fields with extensive debugging
          subscription_status: authUser.subscription_status || 'inactive',
          subscription_plan: authUser.subscription_plan || 'free_trial',
          subscription_period: authUser.subscription_period || null,
          subscription_amount: authUser.subscription_amount || null,
          subscription_start_date: authUser.subscription_start_date || null,
          subscription_end_date: authUser.subscription_end_date || null,
          subscription_price_id: authUser.subscription_price_id || null,
          subscription_currency: authUser.subscription_currency || 'usd',
          // Add direct fields from profiles table for easier access
          first_name: authUser.first_name || authUser.raw_user_meta_data?.first_name || '',
          last_name: authUser.last_name || authUser.raw_user_meta_data?.last_name || '',
          phone: authUser.phone || authUser.raw_user_meta_data?.phone || '',
          country_code: authUser.country_code || authUser.raw_user_meta_data?.country_code || 'US',
          // Stripe related fields
          stripe_customer_id: authUser.stripe_customer_id || null,
          stripe_subscription_id: authUser.stripe_subscription_id || null,
        };
        
        console.log('useFetchUsers: Final mapped user subscription fields:', {
          id: user.id,
          subscription_plan: user.subscription_plan,
          subscription_period: user.subscription_period,
          subscription_amount: user.subscription_amount,
          subscription_status: user.subscription_status,
          stripe_customer_id: user.stripe_customer_id
        });
        
        return user;
      }) || [];
      
      // Add admin user if it doesn't exist and current user is admin
      const adminExists = mappedUsers.some(user => user.is_admin);
      if (!adminExists && adminUser) {
        mappedUsers.push({
          id: 'admin-id',
          email: adminUser.email || 'admin@speechhelp.ai',
          last_sign_in_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          app_metadata: {
            provider: 'email',
          },
          user_metadata: {
            name: adminUser.username,
            full_name: 'Admin User',
          },
          is_active: true,
          is_admin: true,
          admin_role: 'Super Admin',
          permissions: ['view_users', 'manage_users', 'view_speeches', 'manage_speeches', 'system_settings'],
        });
      }
      
      console.log('useFetchUsers: Final mapped users count:', mappedUsers.length);
      console.log('useFetchUsers: Sample user with subscription data:', mappedUsers.find(u => u.stripe_customer_id));
      
      // Ensure we set the users state before clearing loading
      setUsers(mappedUsers);
      
      if (forceRefresh) {
        toast({
          title: 'Data Refreshed',
          description: 'User data has been updated successfully.',
        });
      }
      
      return mappedUsers;
    } catch (err) {
      console.error('useFetchUsers: Exception fetching users:', err);
      const error = err instanceof Error ? err : new Error('Failed to load users');
      setError(error);
      toast({
        title: 'Error',
        description: 'Failed to load users. Please check console for details.',
        variant: 'destructive',
      });
      return users;
    } finally {
      console.log('useFetchUsers: Clearing loading state');
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }, [adminUser, toast, lastFetchTime, users]);

  // Force refresh function for immediate updates
  const forceRefresh = useCallback(() => {
    return fetchUsers(true);
  }, [fetchUsers]);

  return {
    users,
    setUsers,
    isLoading,
    fetchUsers,
    forceRefresh,
    error,
    lastFetchTime
  };
};
