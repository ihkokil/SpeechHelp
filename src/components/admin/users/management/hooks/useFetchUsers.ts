
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
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchUsers = useCallback(async (forceRefresh = false) => {
    // Cancel any ongoing fetch
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Create new abort controller
    abortControllerRef.current = new AbortController();
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Fetching users with force refresh:', forceRefresh);
      
      // Call the edge function with cache busting headers
      const { data: response, error: fetchError } = await supabase.functions.invoke('fetch-users', {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
          ...(forceRefresh ? { 'X-Force-Refresh': 'true' } : {})
        }
      });
      
      if (fetchError) {
        console.error('Edge function error:', fetchError);
        throw new Error(fetchError.message || 'Failed to fetch users from server');
      }
      
      if (!response) {
        throw new Error('No response received from server');
      }
      
      if (response.error) {
        console.error('Server error:', response.error);
        throw new Error(response.error);
      }
      
      if (!response.users || !Array.isArray(response.users)) {
        console.error('Invalid response format:', response);
        throw new Error('Invalid response format from server');
      }
      
      console.log(`Successfully fetched ${response.users.length} users`);
      
      // Map users to ensure proper structure
      const mappedUsers: User[] = response.users.map((authUser: any) => {
        // Extract prioritized profile data
        const firstName = authUser.first_name || '';
        const lastName = authUser.last_name || '';
        const phone = authUser.phone || '';
        const countryCode = authUser.country_code || 'US';
        
        // Construct full name from profile data
        const fullName = firstName && lastName ? `${firstName} ${lastName}` : 
                         authUser.profile?.username || 
                         authUser.user_metadata?.full_name || 
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
      
      console.log(`Final processed users count: ${mappedUsers.length}`);
      setUsers(mappedUsers);
      return mappedUsers;
      
    } catch (err) {
      // Check if the error is due to abort
      if (err instanceof Error && err.name === 'AbortError') {
        console.log('Fetch aborted');
        return [];
      }
      
      console.error('Exception fetching users:', err);
      const error = err instanceof Error ? err : new Error('Failed to load users');
      setError(error);
      
      toast({
        title: 'Error',
        description: error.message || 'Failed to load users. Please try again.',
        variant: 'destructive',
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [adminUser, toast]);

  // Cleanup function to abort ongoing requests
  const cleanup = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  return {
    users,
    setUsers,
    isLoading,
    fetchUsers,
    error,
    cleanup
  };
};
