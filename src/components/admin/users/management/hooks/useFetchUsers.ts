
import { useState, useCallback } from 'react';
import { User } from '../../types';
import { supabase } from '@/integrations/supabase/client';

export const useFetchUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch users from Auth and their profile data
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) throw new Error(authError.message);
      
      if (!authUsers) {
        setUsers([]);
        return;
      }
      
      // Fetch profiles data for each user
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');
      
      if (profilesError) throw new Error(profilesError.message);
      
      // Combine auth users with their profiles
      const combinedUsers = authUsers.users.map(authUser => {
        // Find the profile for this user, or use an empty object if not found
        const userProfile = profiles?.find(profile => profile.id === authUser.id) || {};
        
        // Type assertion to handle missing properties without TypeScript errors
        const typedProfile = userProfile as any;
        
        return {
          id: authUser.id,
          email: authUser.email || '',
          last_sign_in_at: authUser.last_sign_in_at,
          created_at: authUser.created_at,
          updated_at: authUser.updated_at,
          app_metadata: authUser.app_metadata,
          user_metadata: authUser.user_metadata,
          is_active: typedProfile.is_active ?? true,
          is_admin: typedProfile.is_admin || false,
          admin_role: typedProfile.admin_role,
          permissions: typedProfile.permissions || [],
          subscription_status: typedProfile.subscription_status || (typedProfile.subscription_end_date && new Date(typedProfile.subscription_end_date) > new Date() ? 'active' : 'inactive'),
          subscription_end_date: typedProfile.subscription_end_date,
          subscription_tier: typedProfile.subscription_plan || 'free',
        } as User;
      });
      
      setUsers(combinedUsers);
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError(err instanceof Error ? err : new Error(err.toString()));
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { users, isLoading, error, fetchUsers };
};
