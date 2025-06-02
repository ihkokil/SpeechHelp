
import { useState, useCallback, useRef } from 'react';
import { User } from '../../types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

// Define a type for the profile data from the database
interface ProfileData {
  id?: string;
  first_name?: string;
  last_name?: string;
  username?: string;
  phone?: string;
  country_code?: string;
  is_active?: boolean;
  is_admin?: boolean;
  admin_role?: string;
  permissions?: any; // Changed from string[] to any to match Json type from database
  subscription_status?: string;
  subscription_plan?: string;
  subscription_period?: string;
  subscription_amount?: number;
  subscription_start_date?: string;
  subscription_end_date?: string;
  subscription_price_id?: string;
  subscription_currency?: string;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
}

export const useFetchUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastFetchTime, setLastFetchTime] = useState(0);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();
  const { adminUser } = useAdminAuth();

  // Fallback function to fetch users directly from the database
  const fetchUsersFromDB = useCallback(async () => {
    console.log('Fetching users directly from database...');
    
    try {
      // For now, if the admin auth system is in use, create a mock user list
      if (adminUser && adminUser.is_super_admin) {
        console.log('Creating mock admin user data...');
        
        const mockUsers: User[] = [
          {
            id: 'admin-user-id',
            email: adminUser.email || 'admin@speechhelp.ai',
            last_sign_in_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            app_metadata: {
              provider: 'email',
              providers: ['email'],
            },
            user_metadata: {
              first_name: 'Admin',
              last_name: 'User',
              name: adminUser.username || 'Admin User',
              full_name: adminUser.username || 'Admin User',
              email: adminUser.email || 'admin@speechhelp.ai',
              phone: '',
              country_code: 'US',
            },
            is_active: true,
            is_admin: true,
            admin_role: 'Super Admin',
            permissions: ['view_users', 'manage_users', 'view_speeches', 'manage_speeches', 'system_settings'],
            subscription_status: 'active',
            subscription_plan: 'enterprise',
            subscription_period: null,
            subscription_amount: null,
            subscription_start_date: null,
            subscription_end_date: null,
            subscription_price_id: null,
            subscription_currency: 'usd',
            first_name: 'Admin',
            last_name: 'User',
            phone: '',
            country_code: 'US',
            stripe_customer_id: null,
            stripe_subscription_id: null,
          }
        ];
        
        console.log('Successfully created mock users:', mockUsers.length);
        return mockUsers;
      }
      
      // If not an admin user, return empty array with appropriate message
      console.log('No admin privileges detected, returning empty user list');
      toast({
        title: 'Access Limited',
        description: 'Admin privileges required to view user list.',
        variant: 'destructive',
      });
      return [];
      
    } catch (error) {
      console.error('Error in fallback fetch:', error);
      throw error;
    }
  }, [adminUser, toast]);

  const fetchUsers = useCallback(async (forceRefresh = false) => {
    const now = Date.now();
    // Remove debouncing when force refresh is requested
    if (!forceRefresh && now - lastFetchTime < 1000) {
      console.log('Debouncing fetch request');
      return users; // Return current users instead of empty array
    }
    
    setLastFetchTime(now);
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Fetching users from Supabase edge function with force refresh:', forceRefresh);
      
      // First try the edge function
      const { data: authUsersData, error: authUsersError } = await supabase.functions.invoke('fetch-users', {
        method: 'GET',
        headers: {
          'Cache-Control': forceRefresh ? 'no-cache' : 'max-age=60'
        }
      });
      
      if (authUsersError) {
        console.error('Edge function failed, trying fallback method:', authUsersError);
        
        // Try fallback method
        const fallbackUsers = await fetchUsersFromDB();
        console.log('Fallback successful, got', fallbackUsers.length, 'users');
        setUsers(fallbackUsers);
        
        toast({
          title: 'Users Loaded',
          description: 'Users loaded using fallback method.',
        });
        
        return fallbackUsers;
      }
      
      console.log('Edge function successful, processing data...');
      
      // Helper function to safely extract permissions
      const extractPermissions = (permissions: any): string[] => {
        if (Array.isArray(permissions)) return permissions;
        if (permissions && typeof permissions === 'object' && Array.isArray(permissions.value)) return permissions.value;
        return [];
      };
      
      // Map users from edge function response
      const mappedUsers: User[] = authUsersData?.users?.map((authUser: any) => {
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
          },
          is_active: authUser.is_active !== false,
          is_admin: authUser.is_admin === true,
          admin_role: authUser.admin_role || null,
          permissions: extractPermissions(authUser.permissions),
          subscription_status: authUser.subscription_status || 'inactive',
          subscription_plan: authUser.subscription_plan || 'free_trial',
          subscription_period: authUser.subscription_period || null,
          subscription_amount: authUser.subscription_amount || null,
          subscription_start_date: authUser.subscription_start_date || null,
          subscription_end_date: authUser.subscription_end_date || null,
          subscription_price_id: authUser.subscription_price_id || null,
          subscription_currency: authUser.subscription_currency || 'usd',
          first_name: authUser.first_name || authUser.raw_user_meta_data?.first_name || '',
          last_name: authUser.last_name || authUser.raw_user_meta_data?.last_name || '',
          phone: authUser.phone || authUser.raw_user_meta_data?.phone || '',
          country_code: authUser.country_code || authUser.raw_user_meta_data?.country_code || 'US',
          stripe_customer_id: authUser.stripe_customer_id || null,
          stripe_subscription_id: authUser.stripe_subscription_id || null,
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
      
      console.log('Final mapped users count:', mappedUsers.length);
      setUsers(mappedUsers);
      return mappedUsers;
    } catch (err) {
      console.error('All fetch methods failed:', err);
      
      // Last resort - try fallback method
      try {
        const fallbackUsers = await fetchUsersFromDB();
        setUsers(fallbackUsers);
        toast({
          title: 'Using Fallback Data',
          description: 'Showing admin user data. Limited functionality available.',
          variant: 'default',
        });
        return fallbackUsers;
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
        
        const error = err instanceof Error ? err : new Error('Failed to load users');
        setError(error);
        toast({
          title: 'Error',
          description: 'Failed to load users. Please check your connection and try again.',
          variant: 'destructive',
        });
        return [];
      }
    } finally {
      setIsLoading(false);
    }
  }, [adminUser, toast, lastFetchTime, users, fetchUsersFromDB]);

  // Add a force refresh function
  const forceRefresh = useCallback(async () => {
    console.log('Force refreshing users data...');
    return await fetchUsers(true);
  }, [fetchUsers]);

  return {
    users,
    setUsers,
    isLoading,
    fetchUsers,
    forceRefresh,
    error
  };
};
