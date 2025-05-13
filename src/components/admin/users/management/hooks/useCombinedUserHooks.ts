
import { useCallback, useEffect, useRef } from 'react';
import { User } from '../../types';
import { useUserManagementData } from './useUserManagementData';
import { useUserSearch } from './useUserSearch';
import { useUserSelection } from './useUserSelection';
import { useUserManagementUIState } from './useUserManagementUIState';
import { useUserActions } from './useUserActions';
import { useToast } from '@/hooks/use-toast';

// This hook combines various user management hooks into a single, easy-to-use hook
export const useCombinedUserHooks = () => {
  const isMounted = useRef(true);
  const { toast } = useToast();

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
    resetUIState,
    isEditUserDialogOpen,
    setIsEditUserDialogOpen,
    isEmailDialogOpen,
    setIsEmailDialogOpen
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
  
  // User actions - pass users and setUsers to enable wrapper functions
  const {
    handleEditUser,
    handleSendEmail,
    handleDeleteUsers: baseHandleDeleteUsers,
    handleDeleteUser,
    handleBulkDelete: baseHandleBulkDelete,
    handleBulkActivate: baseHandleBulkActivate,
    handleBulkDeactivate: baseHandleBulkDeactivate,
    handleToggleUserStatus,
    handleToggleUserSubscription,
    handleViewUserDetails: baseHandleViewUserDetails,
    handleCloseUserDetails: baseHandleCloseUserDetails,
    handleManagePermissions: baseHandleManagePermissions,
    handlePermissionsUpdated: baseHandlePermissionsUpdated,
    isActionLoading
  } = useUserActions(users, setUsers);
  
  // Wrap functions to include necessary state and make them parameterless
  const handleViewUserDetails = useCallback((user: User) => {
    console.log("useCombinedUserHooks: View details called for user:", user.id);
    baseHandleViewUserDetails(user);
    setSelectedUser(user);
    setIsDetailsOpen(true);
  }, [baseHandleViewUserDetails, setSelectedUser, setIsDetailsOpen]);
  
  const handleCloseUserDetails = useCallback(() => {
    console.log("useCombinedUserHooks: Close details called");
    baseHandleCloseUserDetails();
    setIsDetailsOpen(false);
    setTimeout(() => {
      setSelectedUser(null);
    }, 300);
  }, [baseHandleCloseUserDetails, setIsDetailsOpen, setSelectedUser]);
  
  const handleManagePermissions = useCallback((user: User) => {
    console.log("useCombinedUserHooks: Manage permissions called for user:", user.id);
    baseHandleManagePermissions(user);
    setSelectedUser(user);
    setIsPermissionsDialogOpen(true);
  }, [baseHandleManagePermissions, setSelectedUser, setIsPermissionsDialogOpen]);
  
  const handlePermissionsUpdated = useCallback((updatedUser: User) => {
    console.log("useCombinedUserHooks: Permissions updated for user:", updatedUser.id);
    baseHandlePermissionsUpdated(updatedUser, users, setUsers);
    setIsPermissionsDialogOpen(false);
  }, [baseHandlePermissionsUpdated, users, setUsers, setIsPermissionsDialogOpen]);

  // Create parameterless versions of bulk action functions
  const handleBulkDelete = useCallback(() => {
    console.log("useCombinedUserHooks: Bulk delete called for users:", selectedUsers);
    return baseHandleBulkDelete(selectedUsers, users, setUsers);
  }, [baseHandleBulkDelete, selectedUsers, users, setUsers]);
  
  const handleBulkActivate = useCallback(() => {
    console.log("useCombinedUserHooks: Bulk activate called for users:", selectedUsers);
    return baseHandleBulkActivate(selectedUsers, users, setUsers);
  }, [baseHandleBulkActivate, selectedUsers, users, setUsers]);
  
  const handleBulkDeactivate = useCallback(() => {
    console.log("useCombinedUserHooks: Bulk deactivate called for users:", selectedUsers);
    return baseHandleBulkDeactivate(selectedUsers, users, setUsers);
  }, [baseHandleBulkDeactivate, selectedUsers, users, setUsers]);
  
  // Create a parameterless version of the delete users function
  const handleDeleteUsers = useCallback(() => {
    console.log("useCombinedUserHooks: Delete users called for users:", selectedUsers);
    if (selectedUsers.length === 1) {
      return handleDeleteUser(selectedUsers[0].id, users, setUsers);
    } else {
      return baseHandleDeleteUsers(selectedUsers, users, setUsers);
    }
  }, [baseHandleDeleteUsers, handleDeleteUser, selectedUsers, users, setUsers]);
  
  // Cleanup function
  const cleanup = useCallback(() => {
    setSelectedUsers([]);
    setSearchTerm('');
    resetUIState();
  }, [setSelectedUsers, setSearchTerm, resetUIState]);
  
  // Lifecycle management
  useEffect(() => {
    isMounted.current = true;
    
    // Fetch users on initial mount
    fetchUsers();
    
    return () => {
      isMounted.current = false;
    };
  }, [fetchUsers]);
  
  return {
    // Data state
    users,
    setUsers,
    isLoading,
    addUser,
    
    // UI state
    searchTerm,
    setSearchTerm,
    selectedUsers,
    setSelectedUsers,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isAddUserDialogOpen,
    setIsAddUserDialogOpen,
    selectedUser,
    isDetailsOpen,
    isPermissionsDialogOpen,
    setIsPermissionsDialogOpen,
    isEditUserDialogOpen,
    setIsEditUserDialogOpen,
    isEmailDialogOpen,
    setIsEmailDialogOpen,
    filteredUsers,
    isActionLoading,
    
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
    handlePermissionsUpdated,
    handleBulkDelete,
    handleBulkActivate,
    handleBulkDeactivate,
    handleEditUser,
    handleSendEmail,
    cleanup
  };
};
