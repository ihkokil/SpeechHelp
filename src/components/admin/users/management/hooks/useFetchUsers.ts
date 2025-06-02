
import { useState, useCallback, useRef } from 'react';
import { User } from '../../types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

export const useFetchUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();
  const { adminUser } = useAdminAuth();

  const fetchUsers = useCallback(async (forceRefresh = false) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Fetching users from Supabase auth with force refresh:', forceRefresh);
      
      // Add cache busting parameter
      const cacheKey = forceRefresh ? `?_t=${Date.now()}` : '';
      
      // Fetch users from auth.users via a Supabase function
      const { data: authUsersData, error: authUsersError } = await supabase.functions.invoke('fetch-users', {
        method: 'GET',
        headers: forceRefresh ? { 'Cache-Control': 'no-cache' } : {}
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
      
      console.log('Raw edge function response:', authUsersData);
      console.log('First user raw data from edge function:', authUsersData?.users?.[0]);
      
      // Map users with their profiles, prioritizing profile data over auth metadata
      const mappedUsers: User[] = authUsersData?.users?.map((authUser: any) => {
        console.log('Processing user:', authUser.id);
        
        // Get the profile data from our enhanced structure
        const profile = authUser.profile || {};
        console.log('Profile data:', profile);
        
        // Prioritize profile data over auth metadata
        const firstName = profile.first_name || authUser.first_name || authUser.raw_user_meta_data?.first_name || '';
        const lastName = profile.last_name || authUser.last_name || authUser.raw_user_meta_data?.last_name || '';
        const phone = profile.phone || authUser.phone || authUser.raw_user_meta_data?.phone || '';
        const countryCode = profile.country_code || authUser.country_code || authUser.raw_user_meta_data?.country_code || 'US';
        
        // Construct full name from profile or auth data
        const fullName = firstName && lastName ? `${firstName} ${lastName}` : 
                         profile.username || 
                         authUser.raw_user_meta_data?.full_name || 
                         authUser.raw_user_meta_data?.name || 
                         authUser.email?.split('@')[0] || 'User';
        
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
            first_name: firstName,
            last_name: lastName,
            name: fullName,
            full_name: fullName,
            email: authUser.email,
            phone: phone,
            country_code: countryCode,
            street_address: authUser.raw_user_meta_data?.street_address || '',
            city: authUser.raw_user_meta_data?.city || '',
            state: authUser.raw_user_meta_data?.state || '',
            zip_code: authUser.raw_user_meta_data?.zip_code || '',
            country: authUser.raw_user_meta_data?.country || '',
          },
          is_active: authUser.is_active !== false,
          is_admin: authUser.is_admin === true,
          admin_role: authUser.admin_role || null,
          permissions: authUser.permissions || [],
          subscription_status: authUser.subscription_status || 'inactive',
          subscription_plan: authUser.subscription_plan || 'free_trial',
          subscription_period: authUser.subscription_period || null,
          subscription_amount: authUser.subscription_amount || null,
          subscription_start_date: authUser.subscription_start_date || null,
          subscription_end_date: authUser.subscription_end_date || null,
          subscription_price_id: authUser.subscription_price_id || null,
          subscription_currency: authUser.subscription_currency || 'usd',
          // Store prioritized profile data as direct fields
          first_name: firstName,
          last_name: lastName,
          phone: phone,
          country_code: countryCode,
          stripe_customer_id: authUser.stripe_customer_id || null,
          stripe_subscription_id: authUser.stripe_subscription_id || null,
        };
        
        console.log('Final mapped user with prioritized profile data:', {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          phone: user.phone,
          country_code: user.country_code
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
      
      console.log('Final mapped users count:', mappedUsers.length);
      console.log('Sample user with updated profile data:', mappedUsers.find(u => u.phone || u.first_name));
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
  }, [adminUser, toast]);

  return {
    users,
    setUsers,
    isLoading,
    fetchUsers,
    error
  };
};
