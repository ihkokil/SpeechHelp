
import { useCallback, useState } from 'react';
import { User } from '../../types';
import { useBulkActions } from './user-actions/useBulkActions';
import { useIndividualUserActions } from './user-actions/useIndividualUserActions';
import { useUserDetailsActions } from './user-actions/useUserDetailsActions';

export const useUserActions = () => {
  // Create internal state for tracking action loading
  const [isActionLoading, setIsActionLoading] = useState(false);
  
  // Create local states for user details and permissions dialogs
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isPermissionsDialogOpen, setIsPermissionsDialogOpen] = useState(false);
  
  // Initialize hooks with necessary parameters
  const { 
    handleBulkDelete,
    handleBulkActivate,
    handleBulkDeactivate
  } = useBulkActions();
  
  const {
    handleToggleUserStatus,
    handleToggleUserSubscription,
    handleDeleteUser
  } = useIndividualUserActions();
  
  const {
    handleViewUserDetails: baseHandleViewUserDetails,
    handleCloseUserDetails: baseHandleCloseUserDetails,
    handleManagePermissions: baseHandleManagePermissions,
    handlePermissionsUpdated: baseHandlePermissionsUpdated
  } = useUserDetailsActions();
  
  // View user details wrapper
  const handleViewUserDetails = useCallback((user: User) => {
    console.log("useUserActions: View details called for user:", user.id);
    setSelectedUser(user);
    setIsDetailsOpen(true);
  }, []);
  
  // Close user details wrapper
  const handleCloseUserDetails = useCallback(() => {
    console.log("useUserActions: Close details called");
    setIsDetailsOpen(false);
    setTimeout(() => {
      setSelectedUser(null);
    }, 300);
  }, []);
  
  // Manage user permissions wrapper
  const handleManagePermissions = useCallback((user: User) => {
    console.log("useUserActions: Manage permissions called for user:", user.id);
    setSelectedUser(user);
    setIsPermissionsDialogOpen(true);
  }, []);
  
  // Handle deleting users (plural for backward compatibility)
  const handleDeleteUsers = useCallback(async (
    selectedUsers: User[], 
    users: User[], 
    setUsers: (users: User[]) => void
  ) => {
    console.log('Deleting users:', selectedUsers.map(user => user.id));
    // If only one user, use the single user delete method
    if (selectedUsers.length === 1) {
      await handleDeleteUser(selectedUsers[0].id, users, setUsers);
    } else {
      await handleBulkDelete(selectedUsers, users, setUsers);
    }
  }, [handleDeleteUser, handleBulkDelete]);
  
  // Return all actions and state
  return {
    // User CRUD operations
    handleDeleteUsers,
    handleDeleteUser,
    handleBulkDelete,
    handleBulkActivate,
    handleBulkDeactivate,
    
    // User subscription and status operations
    handleToggleUserStatus,
    handleToggleUserSubscription,
    
    // User details operations
    handleViewUserDetails,
    handleCloseUserDetails,
    handleManagePermissions,
    
    // Permission operations
    handlePermissionsUpdated: (updatedUser: User, users: User[], setUsers: (users: User[]) => void) => {
      baseHandlePermissionsUpdated(updatedUser, users, setUsers, setIsPermissionsDialogOpen);
    },
    
    // States
    isActionLoading,
    selectedUser,
    isDetailsOpen,
    isPermissionsDialogOpen,
    setIsPermissionsDialogOpen
  };
};
