
import { useState, useCallback } from 'react';
import { User } from '../../types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useFetchUsers = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Fetching users via admin-user-operations function...');
      
      // Get the session for the current user to retrieve the access token
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Error getting session:', sessionError);
        throw new Error('Authentication error: ' + (sessionError.message || 'Failed to get session'));
      }
      
      const accessToken = sessionData?.session?.access_token;
      
      if (!accessToken) {
        console.error('No access token available');
        throw new Error('No session found. Please login again.');
      }
      
      console.log('Got access token, invoking admin-user-operations function...');
      
      // Call our edge function to fetch users with admin privileges
      const { data, error: functionError } = await supabase.functions.invoke('admin-user-operations', {
        body: { action: 'fetchUsers' },
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      
      if (functionError) {
        console.error('Error invoking admin-user-operations:', functionError);
        throw new Error(functionError.message || 'Failed to fetch users');
      }
      
      if (!data) {
        console.error('No data returned from function');
        throw new Error('No data returned from function');
      }
      
      console.log('Received response from admin-user-operations:', data);
      
      const { authUsers, profiles } = data;
      
      if (!authUsers || !authUsers.users || !Array.isArray(authUsers.users)) {
        console.error('Invalid response format for authUsers:', authUsers);
        throw new Error('Invalid response format from server');
      }
      
      // Combine auth users with their profiles
      const combinedUsers = authUsers.users.map(authUser => {
        // Find the profile for this user, or use an empty object if not found
        const profile = profiles?.find(p => p.id === authUser.id) || {};
        
        return {
          id: authUser.id,
          email: authUser.email || '',
          last_sign_in_at: authUser.last_sign_in_at,
          created_at: authUser.created_at,
          updated_at: authUser.updated_at,
          app_metadata: authUser.app_metadata,
          user_metadata: authUser.user_metadata,
          is_active: profile.is_active ?? true,
          is_admin: profile.is_admin || false,
          admin_role: profile.admin_role || null,
          permissions: profile.permissions || [],
          subscription_status: profile.subscription_end_date && new Date(profile.subscription_end_date) > new Date() ? 'active' : 'inactive',
          subscription_end_date: profile.subscription_end_date,
          subscription_tier: profile.subscription_plan || 'free',
        } as User;
      });
      
      setUsers(combinedUsers);
      console.log('Successfully fetched and processed users:', combinedUsers.length);
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError(err instanceof Error ? err : new Error(err.toString()));
      
      toast({
        title: 'Error',
        description: err.message || 'Failed to fetch users. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  return { users, isLoading, error, fetchUsers };
};
