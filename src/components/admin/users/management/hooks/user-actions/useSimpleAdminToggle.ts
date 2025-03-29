
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '../../../types';
import { useToast } from '@/hooks/use-toast';

// Define the expected response type from the toggle_user_admin_status function
interface ToggleAdminStatusResponse {
  success: boolean;
  error?: string;
  id?: string;
  is_admin?: boolean;
  admin_role?: string | null;
  updated_at?: string;
}

export const useSimpleAdminToggle = () => {
  const { toast } = useToast();

  const handleToggleAdmin = useCallback(async (
    user: User, 
    users: User[], 
    setUsers: (users: User[]) => void
  ) => {
    console.log('Toggling admin status for user:', user.id, 'Current admin status:', user.is_admin);
    
    // Check if user is protected admin
    const isProtectedAdmin = user.email === 'speechhelpmaster@example.com' || user.username === 'speechhelpmaster';
    
    if (isProtectedAdmin && user.is_admin) {
      toast({
        title: 'Action Not Allowed',
        description: 'Cannot remove admin privileges from the original admin user for security reasons.',
        variant: 'destructive',
      });
      return;
    }

    const newAdminStatus = !user.is_admin;
    
    try {
      console.log('Calling database function to toggle admin status for user:', user.id, 'New status:', newAdminStatus);
      
      // Use the new database function to safely toggle admin status
      const { data, error } = await supabase.rpc('toggle_user_admin_status', {
        user_id_param: user.id,
        new_admin_status: newAdminStatus,
        new_admin_role: newAdminStatus ? 'admin' : null
      });

      if (error) {
        console.error('Error calling toggle_user_admin_status function:', error);
        toast({
          title: 'Error',
          description: 'Failed to update admin status. Please try again.',
          variant: 'destructive',
        });
        return;
      }

      // Cast the data to our expected type
      const response = data as ToggleAdminStatusResponse;

      if (!response?.success) {
        console.error('Function returned error:', response?.error);
        toast({
          title: 'Error',
          description: response?.error || 'Failed to update admin status. Please try again.',
          variant: 'destructive',
        });
        return;
      }

      console.log('Successfully updated admin status via database function:', response);

      // Update the user in the local state
      const updatedUser = {
        ...user,
        is_admin: newAdminStatus,
        admin_role: newAdminStatus ? 'admin' : null
      };

      setUsers(users.map(u => u.id === user.id ? updatedUser : u));

      toast({
        title: 'Success',
        description: `${user.email} has been ${newAdminStatus ? 'granted' : 'removed from'} admin privileges.`,
      });

    } catch (error) {
      console.error('Exception updating admin status:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    }
  }, [toast]);

  return {
    handleToggleAdmin
  };
};
