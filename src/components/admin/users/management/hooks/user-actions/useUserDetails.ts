
import { useCallback } from 'react';
import { User } from '../../../types';

interface UseUserDetailsParams {
  setSelectedUser: (user: User | null) => void;
  setIsDetailsOpen: (isOpen: boolean) => void;
  setIsPermissionsDialogOpen: (isOpen: boolean) => void;
}

export const useUserDetails = ({
  setSelectedUser,
  setIsDetailsOpen,
  setIsPermissionsDialogOpen
}: UseUserDetailsParams) => {
  const handleViewUserDetails = useCallback((user: User) => {
    console.log('View user details:', user.id);
    setSelectedUser(user);
    setIsDetailsOpen(true);
  }, [setSelectedUser, setIsDetailsOpen]);

  const handleCloseUserDetails = useCallback(() => {
    console.log('Close user details');
    setIsDetailsOpen(false);
    setTimeout(() => {
      setSelectedUser(null);
    }, 300);  // Slight delay to allow animations to complete
  }, [setSelectedUser, setIsDetailsOpen]);

  const handleManagePermissions = useCallback((user: User) => {
    console.log('Manage permissions for user:', user.id);
    setSelectedUser(user);
    setIsPermissionsDialogOpen(true);
  }, [setSelectedUser, setIsPermissionsDialogOpen]);

  return {
    handleViewUserDetails,
    handleCloseUserDetails,
    handleManagePermissions
  };
};
