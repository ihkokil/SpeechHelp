
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
    error 
  } = useFetchUsers();
  
  // Add user function for adding new users
  const addUser = useCallback((newUser: User) => {
    setUsers(prevUsers => [...prevUsers, newUser]);
  }, [setUsers]);
  
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
  
  // Wrapper functions to match expected signatures in UserManagement.tsx
  const handleToggleUserStatusWrapper = useCallback((userId: string, isActive: boolean) => {
    handleToggleUserStatus(userId, isActive, users, setUsers);
  }, [handleToggleUserStatus, users, setUsers]);
  
  const handleBulkDeleteWrapper = useCallback(() => {
    if (selectedUsers.length > 0) {
      handleBulkDelete(selectedUsers, users, setUsers);
    }
  }, [selectedUsers, handleBulkDelete, users, setUsers]);
  
  const handleBulkActivateWrapper = useCallback(() => {
    if (selectedUsers.length > 0) {
      handleBulkActivate(selectedUsers, users, setUsers);
    }
  }, [selectedUsers, handleBulkActivate, users, setUsers]);
  
  const handleBulkDeactivateWrapper = useCallback(() => {
    if (selectedUsers.length > 0) {
      handleBulkDeactivate(selectedUsers, users, setUsers);
    }
  }, [selectedUsers, handleBulkDeactivate, users, setUsers]);
  
  const handleDeleteUserWrapper = useCallback((userId: string) => {
    handleDeleteUser(userId, users, setUsers);
  }, [handleDeleteUser, users, setUsers]);
  
  const handleDeleteUsersWrapper = useCallback(() => {
    if (selectedUsers.length > 0) {
      handleDeleteUsers(selectedUsers, users, setUsers);
    }
  }, [selectedUsers, handleDeleteUsers, users, setUsers]);
  
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
    
    // Actions with proper signatures
    fetchUsers,
    toggleUserSelection,
    toggleAllUsers,
    handleDeleteUsers: handleDeleteUsersWrapper,
    handleDeleteUser: handleDeleteUserWrapper,
    handleToggleUserStatus: handleToggleUserStatusWrapper,
    handleViewUserDetails,
    handleCloseUserDetails,
    handleToggleUserSubscription,
    handleManagePermissions,
    handleManageSubscription,
    handlePermissionsUpdated,
    handleBulkDelete: handleBulkDeleteWrapper,
    handleBulkActivate: handleBulkActivateWrapper,
    handleBulkDeactivate: handleBulkDeactivateWrapper,
    handleEditUser,
    handleSendEmail,
    handleUpdateUserSubscription,
    
    // Utilities
    cleanup,
    addUser
  };
};
