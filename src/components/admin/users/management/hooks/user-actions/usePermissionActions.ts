
import { useCallback } from 'react';
import { User } from '../../../types';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const usePermissionActions = (
  setIsPermissionsDialogOpen?: (isOpen: boolean) => void
) => {
  const { toast } = useToast();

  const handlePermissionsUpdated = useCallback(async (updatedUser: User, users: User[] = [], setUsers: ((users: User[]) => void) | null = null) => {
    try {
      console.log('Permissions updated for user:', updatedUser.id);
      
      // Update user permissions in database
      const { error } = await supabase
        .from('profiles')
        .update({ 
          is_admin: updatedUser.is_admin,
          admin_role: updatedUser.admin_role,
          permissions: updatedUser.permissions
        })
        .eq('id', updatedUser.id);
      
      if (error) throw error;
      
      // Update the user in the users array if we have the array and update function
      if (setUsers && users.length > 0) {
        setUsers(
          users.map(user => 
            user.id === updatedUser.id ? updatedUser : user
          )
        );
      }
      
      // Show a success toast
      toast({
        title: 'Permissions Updated',
        description: `${updatedUser.email}'s admin permissions have been updated.`,
      });
      
      // Close the dialog
      if (setIsPermissionsDialogOpen) {
        setIsPermissionsDialogOpen(false);
      }
    } catch (error) {
      console.error('Error updating permissions:', error);
      toast({
        title: 'Error',
        description: 'Failed to update permissions. Please try again.',
        variant: 'destructive',
      });
    }
  }, [toast, setIsPermissionsDialogOpen]);

  return {
    handlePermissionsUpdated
  };
};
