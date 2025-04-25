
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

  const fetchUsers = useCallback(async () => {
    const now = Date.now();
    if (now - lastFetchTime < 1000) {
      console.log('Debouncing fetch request');
      return []; // Debounce fetch requests
    }
    
    setLastFetchTime(now);
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Fetching users from Supabase auth');
      
      // Fetch users from auth.users via a Supabase function
      const { data: authUsersData, error: authUsersError } = await supabase.functions.invoke('fetch-users', {
        method: 'GET'
      });
      
      if (authUsersError) {
        console.error('Error fetching auth users:', authUsersError);
        setError(new Error(authUsersError.message || 'Failed to load users'));
        toast({
          title: 'Error',
          description: 'Failed to load users. Please try again.',
          variant: 'destructive',
        });
        setIsLoading(false);
        return [];
      }
      
      console.log('Fetched auth users with profiles:', authUsersData);
      
      // Map users with their profiles, ensuring all subscription fields are properly retrieved
      const mappedUsers: User[] = authUsersData?.users?.map((authUser: any) => {
        // Get the profile data from our enhanced structure
        const profile = authUser.profile || {};
        
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
          // Map all subscription fields properly
          subscription_status: authUser.subscription_status || undefined,
          subscription_plan: authUser.subscription_plan || undefined,
          subscription_period: authUser.subscription_period || undefined,
          subscription_amount: authUser.subscription_amount || undefined,
          subscription_end_date: authUser.subscription_end_date || undefined,
          // Add direct fields from profiles table for easier access
          first_name: authUser.first_name || authUser.raw_user_meta_data?.first_name || '',
          last_name: authUser.last_name || authUser.raw_user_meta_data?.last_name || '',
          phone: authUser.phone || authUser.raw_user_meta_data?.phone || '',
          country_code: authUser.country_code || authUser.raw_user_meta_data?.country_code || 'US',
          // Stripe related fields
          stripe_customer_id: authUser.stripe_customer_id || undefined,
          stripe_subscription_id: authUser.stripe_subscription_id || undefined,
        };
        
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
      
      console.log('Mapped users with complete subscription data:', mappedUsers);
      setUsers(mappedUsers);
      return mappedUsers;
    } catch (err) {
      console.error('Exception fetching users:', err);
      const error = err instanceof Error ? err : new Error('Failed to load users');
      setError(error);
      toast({
        title: 'Error',
        description: 'Failed to load users. Please check console for details.',
        variant: 'destructive',
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [adminUser, toast, lastFetchTime]);

  return {
    users,
    setUsers,
    isLoading,
    fetchUsers,
    error
  };
};
