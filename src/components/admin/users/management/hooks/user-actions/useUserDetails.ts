
import { useCallback } from 'react';
import { User } from '../../../types';

export const useUserDetails = (
  setSelectedUser: (user: User | null) => void,
  setIsDetailsOpen: (isOpen: boolean) => void,
  setIsPermissionsDialogOpen: (isOpen: boolean) => void
) => {
  const handleViewUserDetails = useCallback((user: User) => {
    console.log('UserManagement: Opening details for user:', user.id);
    
    // Set the selected user first
    setSelectedUser(user);
    
    // Then open the drawer
    setIsDetailsOpen(true);
  }, [setSelectedUser, setIsDetailsOpen]);

  const handleCloseUserDetails = useCallback(() => {
    console.log('UserManagement: Closing user details drawer');
    
    // Close the drawer first
    setIsDetailsOpen(false);
    
    // Clear the selected user after a short delay to avoid state conflicts
    setTimeout(() => {
      setSelectedUser(null);
    }, 300);
  }, [setSelectedUser, setIsDetailsOpen]);

  const handleManagePermissions = useCallback((user: User) => {
    console.log('UserManagement: Opening permissions dialog for user:', user.id);
    
    // Set the selected user
    setSelectedUser(user);
    
    // Open the permissions dialog
    setIsPermissionsDialogOpen(true);
  }, [setSelectedUser, setIsPermissionsDialogOpen]);

  return {
    handleViewUserDetails,
    handleCloseUserDetails,
    handleManagePermissions
  };
};
