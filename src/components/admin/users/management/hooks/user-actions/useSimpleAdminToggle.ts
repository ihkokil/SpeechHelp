
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '../../../types';
import { useToast } from '@/hooks/use-toast';

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
      // Update the user's admin status in the profiles table
      const { error } = await supabase
        .from('profiles')
        .update({ 
          is_admin: newAdminStatus,
          admin_role: newAdminStatus ? 'admin' : null,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating admin status:', error);
        toast({
          title: 'Error',
          description: 'Failed to update admin status. Please try again.',
          variant: 'destructive',
        });
        return;
      }

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
