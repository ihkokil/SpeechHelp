
import { useCallback } from 'react';
import { useFetchUsers } from './hooks/useFetchUsers';
import { useUserSelection } from './hooks/useUserSelection';
import { useUserActions } from './hooks/useUserActions';
import { useUserManagementUIState } from './hooks/useUserManagementUIState';
import { useUserManagementData } from './hooks/useUserManagementData';
import { User } from '../types';

export const useUserManagement = () => {
  // Core data management - now includes search functionality
  const { 
    users, 
    setUsers, 
    isLoading, 
    fetchUsers, 
    addUser, 
    searchTerm, 
    setSearchTerm, 
    filteredUsers 
  } = useUserManagementData();
  
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
    handleDeleteUsers: baseHandleDeleteUsers,
    handleDeleteUser,
    handleBulkDelete: baseHandleBulkDelete,
    handleBulkActivate: baseHandleBulkActivate,
    handleBulkDeactivate: baseHandleBulkDeactivate,
    handleToggleUserStatus,
    handleViewUserDetails,
    handleCloseUserDetails,
    handleManagePermissions,
    handlePermissionsUpdated,
    isActionLoading,
    selectedUser,
    setSelectedUser,
    isDetailsOpen,
    isPermissionsDialogOpen,
    setIsPermissionsDialogOpen
  } = useUserActions();
  
  // Create wrapper functions that provide the required parameters
  const handleDeleteUsers = useCallback(async () => {
    if (selectedUsers.length === 0) return;
    
    console.log('Deleting users:', selectedUsers.map(user => user.id));
    
    try {
      // Simulate deletion
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Remove deleted users from state
      setUsers(users.filter(user => !selectedUsers.some(selectedUser => selectedUser.id === user.id)));
      
      // Clear selected users
      setSelectedUsers([]);
    } catch (error) {
      console.error('Error deleting users:', error);
    }
  }, [selectedUsers, users, setUsers, setSelectedUsers]);

  const handleBulkDelete = useCallback(async () => {
    await handleDeleteUsers();
  }, [handleDeleteUsers]);

  const handleBulkActivate = useCallback(async () => {
    if (selectedUsers.length === 0) return;
    
    console.log('Activating users:', selectedUsers.map(user => user.id));
    
    try {
      // Simulate activation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update users status in state
      setUsers(
        users.map(user => 
          selectedUsers.some(selectedUser => selectedUser.id === user.id)
            ? { ...user, is_active: true }
            : user
        )
      );
    } catch (error) {
      console.error('Error activating users:', error);
    }
  }, [selectedUsers, users, setUsers]);

  const handleBulkDeactivate = useCallback(async () => {
    if (selectedUsers.length === 0) return;
    
    console.log('Deactivating users:', selectedUsers.map(user => user.id));
    
    try {
      // Simulate deactivation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update users status in state
      setUsers(
        users.map(user => 
          selectedUsers.some(selectedUser => selectedUser.id === user.id)
            ? { ...user, is_active: false }
            : user
        )
      );
    } catch (error) {
      console.error('Error deactivating users:', error);
    }
  }, [selectedUsers, users, setUsers]);
  
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
    setSelectedUser,
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
