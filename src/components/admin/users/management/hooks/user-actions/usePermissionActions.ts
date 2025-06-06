
import { useCallback } from 'react';
import { User } from '../../../types';
import { useToast } from '@/hooks/use-toast';

export const usePermissionActions = (
  setIsPermissionsDialogOpen?: (isOpen: boolean) => void
) => {
  const { toast } = useToast();

  const handlePermissionsUpdated = useCallback((updatedUser: User) => {
    console.log('Permissions updated for user:', updatedUser.id);
    
    // Show a success toast
    toast({
      title: 'Permissions Updated',
      description: `${updatedUser.email}'s admin permissions have been updated.`,
    });
    
    // Close the dialog
    if (setIsPermissionsDialogOpen) {
      setIsPermissionsDialogOpen(false);
    }
  }, [toast, setIsPermissionsDialogOpen]);

  return {
    handlePermissionsUpdated
  };
};
