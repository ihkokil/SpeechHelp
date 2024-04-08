
import { useCallback } from 'react';
import { User } from '../../../types';

export const useUserDetails = (
  setSelectedUser?: (user: User | null) => void,
  setIsDetailsOpen?: (isOpen: boolean) => void,
  setIsPermissionsDialogOpen?: (isOpen: boolean) => void
) => {
  // View user details
  const handleViewUserDetails = useCallback((user: User) => {
    console.log('Viewing user details:', user.id);
    if (setSelectedUser) setSelectedUser(user);
    if (setIsDetailsOpen) setIsDetailsOpen(true);
  }, [setSelectedUser, setIsDetailsOpen]);

  // Close user details
  const handleCloseUserDetails = useCallback(() => {
    if (setIsDetailsOpen) setIsDetailsOpen(false);
    // We set selected user to null with a delay to prevent UI flickering
    setTimeout(() => {
      if (setSelectedUser) setSelectedUser(null);
    }, 300);
  }, [setSelectedUser, setIsDetailsOpen]);

  // Manage user permissions
  const handleManagePermissions = useCallback((user: User) => {
    console.log('Managing permissions for user:', user.id);
    if (setSelectedUser) setSelectedUser(user);
    if (setIsPermissionsDialogOpen) setIsPermissionsDialogOpen(true);
  }, [setSelectedUser, setIsPermissionsDialogOpen]);

  return {
    handleViewUserDetails,
    handleCloseUserDetails,
    handleManagePermissions,
  };
};
