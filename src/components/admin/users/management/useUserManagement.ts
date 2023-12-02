
import { useCallback, useEffect, useRef } from 'react';
import { useUserManagementData } from './hooks/useUserManagementData';
import { useUserSearch } from './hooks/useUserSearch';
import { useUserSelection } from './hooks/useUserSelection';
import { useUserActions } from './hooks/useUserActions';
import { useUserManagementUIState } from './hooks/useUserManagementUIState';
import { User } from '../types';

export const useUserManagement = () => {
  console.log("Initializing useUserManagement");
  const isMounted = useRef(true);

  // Get user data operations
  const {
    users,
    setUsers,
    isLoading,
    fetchUsers,
    addUser
  } = useUserManagementData();
  
  // Get UI state management
  const {
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isAddUserDialogOpen,
    setIsAddUserDialogOpen,
    isPermissionsDialogOpen,
    setIsPermissionsDialogOpen,
    isDetailsOpen,
    setIsDetailsOpen,
    selectedUser,
    setSelectedUser,
    resetUIState
  } = useUserManagementUIState();
  
  // User search functionality
  const { searchTerm, setSearchTerm, filteredUsers } = useUserSearch(users);
  
  // User selection functionality
  const { 
    selectedUsers, 
    setSelectedUsers, 
    toggleUserSelection,
    toggleAllUsers,
    clearSelection
  } = useUserSelection();
  
  // Get all user actions and their states from the useUserActions hook
  const {
    // Actions
    handleDeleteUsers: baseHandleDeleteUsers,
    handleBulkDelete: baseHandleBulkDelete,
    handleBulkActivate: baseHandleBulkActivate,
    handleBulkDeactivate: baseHandleBulkDeactivate,
    handleToggleUserStatus: baseHandleToggleUserStatus,
    handleToggleUserSubscription: baseHandleToggleUserSubscription,
    handleViewUserDetails: baseHandleViewUserDetails,
    handleCloseUserDetails: baseHandleCloseUserDetails,
    handleManagePermissions: baseHandleManagePermissions,
    handlePermissionsUpdated: baseHandlePermissionsUpdated,
    
    // States
    isActionLoading
  } = useUserActions();
  
  // Wrapper functions to include users and setUsers
  const handleToggleAllUsers = useCallback((usersToToggle: User[]) => {
    if (isMounted.current) {
      toggleAllUsers(usersToToggle);
    }
  }, [toggleAllUsers]);
  
  const handleToggleUserSelection = useCallback((user: User) => {
    if (isMounted.current) {
      toggleUserSelection(user);
    }
  }, [toggleUserSelection]);
  
  const handleDeleteUsers = useCallback(async () => {
    if (isMounted.current) {
      await baseHandleDeleteUsers(selectedUsers, users, setUsers);
      setIsDeleteDialogOpen(false);
    }
  }, [baseHandleDeleteUsers, selectedUsers, users, setUsers, setIsDeleteDialogOpen]);
  
  const handleToggleUserStatus = useCallback(async (userId: string, isActive: boolean) => {
    if (isMounted.current) {
      return await baseHandleToggleUserStatus(userId, isActive, users, setUsers);
    }
  }, [baseHandleToggleUserStatus, users, setUsers]);
  
  const handleToggleUserSubscription = useCallback(async (userId: string, days = 30) => {
    if (isMounted.current) {
      return await baseHandleToggleUserSubscription(userId, days, users, setUsers);
    }
  }, [baseHandleToggleUserSubscription, users, setUsers]);
  
  const handlePermissionsUpdated = useCallback((updatedUser: User) => {
    if (isMounted.current) {
      baseHandlePermissionsUpdated(updatedUser, users, setUsers);
    }
  }, [baseHandlePermissionsUpdated, users, setUsers]);
  
  const handleViewUserDetails = useCallback((user: User) => {
    if (isMounted.current) {
      console.log("UserManagement: View details called for user:", user.id);
      setSelectedUser(user);
      setIsDetailsOpen(true);
    }
  }, [setSelectedUser, setIsDetailsOpen]);
  
  const handleCloseUserDetails = useCallback(() => {
    if (isMounted.current) {
      setIsDetailsOpen(false);
      setSelectedUser(null);
    }
  }, [setIsDetailsOpen, setSelectedUser]);
  
  const handleManagePermissions = useCallback((user: User) => {
    if (isMounted.current) {
      setSelectedUser(user);
      setIsPermissionsDialogOpen(true);
    }
  }, [setSelectedUser, setIsPermissionsDialogOpen]);
  
  // Bulk actions
  const handleBulkDelete = useCallback(async () => {
    if (isMounted.current) {
      await baseHandleBulkDelete(selectedUsers, users, setUsers);
    }
  }, [baseHandleBulkDelete, selectedUsers, users, setUsers]);
  
  const handleBulkActivate = useCallback(async () => {
    if (isMounted.current) {
      await baseHandleBulkActivate(selectedUsers, users, setUsers);
    }
  }, [baseHandleBulkActivate, selectedUsers, users, setUsers]);
  
  const handleBulkDeactivate = useCallback(async () => {
    if (isMounted.current) {
      await baseHandleBulkDeactivate(selectedUsers, users, setUsers);
    }
  }, [baseHandleBulkDeactivate, selectedUsers, users, setUsers]);
  
  // Cleanup function for component unmount
  const cleanup = useCallback(() => {
    setSelectedUsers([]);
    setSearchTerm('');
    resetUIState();
  }, [setSelectedUsers, setSearchTerm, resetUIState]);
  
  // Lifecycle hooks
  useEffect(() => {
    isMounted.current = true;
    
    // Fetch users on initial mount
    fetchUsers();
    
    return () => {
      isMounted.current = false;
    };
  }, [fetchUsers]);
  
  return {
    // State
    users,
    setUsers,
    searchTerm,
    setSearchTerm,
    selectedUsers,
    setSelectedUsers,
    isLoading,
    isActionLoading,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isAddUserDialogOpen,
    setIsAddUserDialogOpen,
    selectedUser,
    isDetailsOpen,
    isPermissionsDialogOpen,
    setIsPermissionsDialogOpen,
    filteredUsers,
    
    // Functions
    fetchUsers,
    toggleUserSelection: handleToggleUserSelection,
    toggleAllUsers: handleToggleAllUsers,
    handleDeleteUsers,
    handleToggleUserStatus,
    handleViewUserDetails,
    handleCloseUserDetails,
    handleToggleUserSubscription,
    handleManagePermissions,
    handlePermissionsUpdated,
    handleBulkDelete,
    handleBulkActivate,
    handleBulkDeactivate,
    cleanup,
    addUser
  };
};
