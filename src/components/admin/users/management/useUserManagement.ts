
import { useCallback, useState, useEffect } from 'react';
import { User } from '../types';
import { useFetchUsers } from './hooks/useFetchUsers';
import { useUserSelection } from './hooks/useUserSelection';
import { useUserSearch } from './hooks/useUserSearch';
import { useUserActions } from './hooks/useUserActions';
import { useUserManagementData } from './hooks/useUserManagementData';
import { useUserManagementUIState } from './hooks/useUserManagementUIState';

export const useUserManagement = () => {
  // Fetch initial user data
  const { 
    users, 
    setUsers, 
    isLoading, 
    fetchUsers, 
    addUser 
  } = useFetchUsers();
  
  // User selection state
  const {
    selectedUsers,
    setSelectedUsers,
    toggleUserSelection,
    toggleAllUsers
  } = useUserSelection();
  
  // Search functionality
  const { 
    searchTerm, 
    setSearchTerm,
    filteredUsers
  } = useUserSearch(users);
  
  // UI state (dialogs, etc.)
  const { 
    isDeleteDialogOpen, 
    setIsDeleteDialogOpen,
    isAddUserDialogOpen,
    setIsAddUserDialogOpen,
    isPermissionsDialogOpen,
    setIsPermissionsDialogOpen,
    isDetailsOpen,
    setIsDetailsOpen,
    isEditUserDialogOpen,
    setIsEditUserDialogOpen,
    isEmailDialogOpen,
    setIsEmailDialogOpen,
    selectedUser,
    setSelectedUser,
    resetUIState
  } = useUserManagementUIState();
  
  // Add subscription dialog state
  const [isSubscriptionDialogOpen, setIsSubscriptionDialogOpen] = useState(false);
  
  // User action handlers
  const { 
    handleDeleteUsers,
    handleDeleteUser,
    handleToggleUserStatus,
    handleViewUserDetails,
    handleCloseUserDetails,
    handleToggleUserSubscription,
    handleManagePermissions,
    handlePermissionsUpdated,
    handleBulkDelete,
    handleBulkActivate,
    handleBulkDeactivate,
    isActionLoading,
    handleManageSubscription,
    handleUpdateUserSubscription
  } = useUserActions();
  
  // Make user data accessible to actions
  const userDataContext = useUserManagementData();
  
  // Set user data context when users change
  useEffect(() => {
    userDataContext.setUsers(users);
  }, [users, userDataContext]);
  
  // Define edit user handler
  const handleEditUser = useCallback((user: User) => {
    setSelectedUser(user);
    setIsEditUserDialogOpen(true);
  }, [setSelectedUser, setIsEditUserDialogOpen]);
  
  // Define email handler (stub for now)
  const handleSendEmail = useCallback((user: User) => {
    setSelectedUser(user);
    setIsEmailDialogOpen(true);
  }, [setSelectedUser, setIsEmailDialogOpen]);
  
  // Cleanup handler to reset state
  const cleanup = useCallback(() => {
    setSelectedUsers([]);
    resetUIState();
  }, [setSelectedUsers, resetUIState]);
  
  return {
    // Data
    users,
    setUsers,
    filteredUsers,
    selectedUser,
    
    // UI state
    isLoading,
    isActionLoading,
    searchTerm,
    setSearchTerm,
    selectedUsers,
    setSelectedUsers,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isAddUserDialogOpen,
    setIsAddUserDialogOpen,
    isDetailsOpen,
    isPermissionsDialogOpen,
    setIsPermissionsDialogOpen,
    isEditUserDialogOpen,
    setIsEditUserDialogOpen,
    isEmailDialogOpen,
    setIsEmailDialogOpen,
    isSubscriptionDialogOpen,
    setIsSubscriptionDialogOpen,
    
    // Actions
    fetchUsers,
    toggleUserSelection,
    toggleAllUsers,
    handleDeleteUsers,
    handleDeleteUser,
    handleToggleUserStatus,
    handleViewUserDetails,
    handleCloseUserDetails,
    handleToggleUserSubscription,
    handleManagePermissions,
    handleManageSubscription,
    handlePermissionsUpdated,
    handleBulkDelete,
    handleBulkActivate,
    handleBulkDeactivate,
    handleEditUser,
    handleSendEmail,
    handleUpdateUserSubscription,
    
    // Utilities
    cleanup,
    addUser
  };
};
