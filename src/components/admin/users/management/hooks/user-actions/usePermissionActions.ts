
import { useCallback } from 'react';
import { User } from '../../../types';
import { useToast } from '@/hooks/use-toast';

export const usePermissionActions = (
  setIsPermissionsDialogOpen: (isOpen: boolean) => void
) => {
  const { toast } = useToast();

  const handlePermissionsUpdated = useCallback((updatedUser: User, users: User[], setUsers: (users: User[]) => void) => {
    console.log('Permissions updated for user:', updatedUser.id);
    
    // Update the user in the users array
    setUsers(
      users.map(user => 
        user.id === updatedUser.id ? updatedUser : user
      )
    );
    
    // Show a success toast
    toast({
      title: 'Permissions Updated',
      description: `${updatedUser.email}'s admin permissions have been updated.`,
    });
    
    // Close the dialog
    setIsPermissionsDialogOpen(false);
  }, [toast, setIsPermissionsDialogOpen]);

  return {
    handlePermissionsUpdated
  };
};
