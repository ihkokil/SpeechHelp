
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
      return users; // Return current users instead of empty array
    }
    
    console.log('Starting to fetch users...');
    setLastFetchTime(now);
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Calling fetch-users function');
      
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
      
      console.log('Received auth users response:', authUsersData);
      
      if (!authUsersData || !authUsersData.users) {
        console.error('Invalid response structure from fetch-users');
        setError(new Error('Invalid response from server'));
        setIsLoading(false);
        return [];
      }
      
      // Map users with their profiles
      const mappedUsers: User[] = authUsersData.users.map((authUser: any) => {
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
            first_name: authUser.raw_user_meta_data?.first_name || profile.first_name || '',
            last_name: authUser.raw_user_meta_data?.last_name || profile.last_name || '',
            name: authUser.raw_user_meta_data?.full_name || authUser.raw_user_meta_data?.name || profile.username || authUser.email?.split('@')[0] || 'User',
            full_name: authUser.raw_user_meta_data?.full_name || authUser.raw_user_meta_data?.name || profile.username || '',
            email: authUser.email,
            phone: authUser.raw_user_meta_data?.phone || profile.phone || '',
            street_address: authUser.raw_user_meta_data?.street_address || '',
            city: authUser.raw_user_meta_data?.city || '',
            state: authUser.raw_user_meta_data?.state || '',
            zip_code: authUser.raw_user_meta_data?.zip_code || '',
            country: authUser.raw_user_meta_data?.country || '',
            country_code: authUser.raw_user_meta_data?.country_code || '',
          },
          is_active: profile.is_active !== false, // Default to true if not specified
          is_admin: profile.is_admin || false,
          admin_role: profile.admin_role || undefined,
          permissions: profile.permissions || [],
          subscription_status: profile.subscription_plan ? 'active' : undefined,
          subscription_end_date: profile.subscription_end_date || undefined,
          subscription_plan: profile.subscription_plan || undefined,
        };
        
        return user;
      });
      
      console.log('Successfully mapped users:', mappedUsers.length, 'users');
      setUsers(mappedUsers);
      setIsLoading(false);
      return mappedUsers;
    } catch (err) {
      console.error('Exception fetching users:', err);
      const error = err instanceof Error ? err : new Error('Failed to load users');
      setError(error);
      setIsLoading(false);
      toast({
        title: 'Error',
        description: 'Failed to load users. Please check console for details.',
        variant: 'destructive',
      });
      return [];
    }
  }, [adminUser, toast, lastFetchTime, users]);

  return {
    users,
    setUsers,
    isLoading,
    fetchUsers,
    error
  };
};
