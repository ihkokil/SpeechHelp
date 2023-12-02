
import { useCallback, useState } from 'react';
import { User } from '../../../types';
import { useToast } from '@/hooks/use-toast';

export const useUserDetailsActions = () => {
  const { toast } = useToast();
  const [isActionLoading, setIsActionLoading] = useState(false);

  // View user details
  const handleViewUserDetails = useCallback((
    user: User,
    setSelectedUser: (user: User | null) => void,
    setIsDetailsOpen: (isOpen: boolean) => void
  ) => {
    console.log("useUserDetailsActions: View details called for user:", user.id);
    setSelectedUser(user);
    setIsDetailsOpen(true);
  }, []);
  
  // Close user details
  const handleCloseUserDetails = useCallback((
    setIsDetailsOpen: (isOpen: boolean) => void,
    setSelectedUser: (user: User | null) => void
  ) => {
    console.log("useUserDetailsActions: Close details called");
    setIsDetailsOpen(false);
    // We set selected user to null with a delay to prevent UI flickering
    setTimeout(() => {
      setSelectedUser(null);
    }, 300);
  }, []);
  
  // Manage user permissions
  const handleManagePermissions = useCallback((
    user: User,
    setSelectedUser: (user: User | null) => void,
    setIsPermissionsDialogOpen: (isOpen: boolean) => void
  ) => {
    console.log("useUserDetailsActions: Manage permissions called for user:", user.id);
    setSelectedUser(user);
    setIsPermissionsDialogOpen(true);
  }, []);
  
  // Handle permissions updated
  const handlePermissionsUpdated = useCallback((
    updatedUser: User,
    users: User[],
    setUsers: (users: User[]) => void,
    setIsPermissionsDialogOpen: (isOpen: boolean) => void
  ) => {
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
  }, [toast]);

  return {
    isActionLoading,
    handleViewUserDetails,
    handleCloseUserDetails,
    handleManagePermissions,
    handlePermissionsUpdated
  };
};
