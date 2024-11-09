
import { useCallback } from 'react';
import { useFetchUsers } from './hooks/useFetchUsers';
import { useUserSelection } from './hooks/useUserSelection';
import { useUserActions } from './hooks/useUserActions';
import { useUserManagementUIState } from './hooks/useUserManagementUIState';
import { useUserManagementData } from './hooks/useUserManagementData';
import { User } from '../types';

export const useUserManagement = () => {
  // Core data management
  const { users, setUsers, isLoading, fetchUsers } = useFetchUsers();
  const { searchTerm, setSearchTerm, filteredUsers } = useUserManagementData(users);
  
  // User selection management
  const { selectedUsers, setSelectedUsers, toggleUserSelection, toggleAllUsers } = useUserSelection();
  
  // UI state management
  const {
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isAddUserDialogOpen,
    setIsAddUserDialogOpen
  } = useUserManagementUIState();
  
  // User actions
  const {
    handleDeleteUsers,
    handleDeleteUser,
    handleBulkDelete,
    handleBulkActivate,
    handleBulkDeactivate,
    handleToggleUserStatus,
    handleViewUserDetails,
    handleCloseUserDetails,
    handleManagePermissions,
    handlePermissionsUpdated,
    isActionLoading,
    selectedUser,
    isDetailsOpen,
    isPermissionsDialogOpen,
    setIsPermissionsDialogOpen
  } = useUserActions();
  
  // Email functionality
  const handleSendEmail = useCallback((user: User) => {
    console.log("Sending email to:", user.email);
    // Email functionality would be implemented here
  }, []);
  
  // Subscription management
  const handleUpdateSubscription = useCallback((userId: string, tier: string, endDate: Date, users: User[], setUsers: (users: User[]) => void) => {
    console.log("Updating subscription for user:", userId, "to tier:", tier, "ending:", endDate);
    // Update subscription logic would be implemented here
  }, []);
  
  // User addition functionality
  const addUser = useCallback((newUser: User) => {
    setUsers(prevUsers => [...prevUsers, newUser]);
  }, [setUsers]);
  
  // Cleanup function for component unmount
  const cleanup = useCallback(() => {
    setSelectedUsers([]);
    setSearchTerm('');
  }, [setSelectedUsers, setSearchTerm]);
  
  return {
    // Data
    users,
    setUsers,
    isLoading,
    filteredUsers,
    
    // Search
    searchTerm,
    setSearchTerm,
    
    // Selection
    selectedUsers,
    setSelectedUsers,
    toggleUserSelection,
    toggleAllUsers,
    
    // UI state
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isAddUserDialogOpen,
    setIsAddUserDialogOpen,
    selectedUser,
    isDetailsOpen,
    isPermissionsDialogOpen,
    setIsPermissionsDialogOpen,
    
    // Actions
    isActionLoading,
    fetchUsers,
    handleDeleteUsers,
    handleDeleteUser,
    handleBulkDelete,
    handleBulkActivate,
    handleBulkDeactivate,
    handleToggleUserStatus,
    handleViewUserDetails,
    handleCloseUserDetails,
    handleManagePermissions,
    handlePermissionsUpdated,
    handleSendEmail,
    handleUpdateSubscription,
    
    // Utilities
    addUser,
    cleanup
  };
};
