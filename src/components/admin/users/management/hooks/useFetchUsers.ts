
import { useState, useCallback, useRef } from 'react';
import { User } from '../../types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

export const useFetchUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastFetchTime, setLastFetchTime] = useState(0);
  const { toast } = useToast();
  const { adminUser } = useAdminAuth();

  const fetchUsers = useCallback(async () => {
    const now = Date.now();
    if (now - lastFetchTime < 1000) {
      console.log('Debouncing fetch request');
      return; // Debounce fetch requests
    }
    
    setLastFetchTime(now);
    setIsLoading(true);
    try {
      console.log('Fetching users from Supabase auth');
      
      // Fetch users from auth.users via a Supabase function
      const { data: authUsersData, error: authUsersError } = await supabase.functions.invoke('fetch-users', {
        method: 'GET'
      });
      
      if (authUsersError) {
        console.error('Error fetching auth users:', authUsersError);
        toast({
          title: 'Error',
          description: 'Failed to load users. Please try again.',
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }
      
      console.log('Fetched auth users with profiles:', authUsersData);
      
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
            name: profile.username || authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'User',
            full_name: authUser.user_metadata?.full_name || profile.username || '',
            first_name: authUser.user_metadata?.first_name || '',
            last_name: authUser.user_metadata?.last_name || '',
            email: authUser.email,
            phone: profile.phone || authUser.user_metadata?.phone || '',
            street_address: authUser.user_metadata?.street_address || '',
            city: authUser.user_metadata?.city || '',
            state: authUser.user_metadata?.state || '',
            zip_code: authUser.user_metadata?.zip_code || '',
            country: authUser.user_metadata?.country || '',
            country_code: authUser.user_metadata?.country_code || '',
          },
          is_active: profile.is_active !== false, // Default to true if not specified
          subscription_status: profile.subscription_plan ? 'active' : undefined,
          subscription_end_date: profile.subscription_end_date || undefined,
          subscription_tier: profile.subscription_plan || undefined,
        };
        
        return user;
      });
      
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
      
      console.log('Mapped users with profiles:', mappedUsers);
      setUsers(mappedUsers);
    } catch (error) {
      console.error('Exception fetching users:', error);
      toast({
        title: 'Error',
        description: 'Failed to load users. Please check console for details.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [adminUser, toast, lastFetchTime]);

  return {
    users,
    setUsers,
    isLoading,
    fetchUsers
  };
};
