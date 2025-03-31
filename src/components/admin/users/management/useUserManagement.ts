
import { useEffect, useRef, useCallback } from 'react';
import { useFetchUsers } from './hooks/useFetchUsers';
import { useUserSearch } from './hooks/useUserSearch';
import { useUserSelection } from './hooks/useUserSelection';
import { useUserActions } from './hooks/useUserActions';

export const useUserManagement = () => {
  const isInitialMount = useRef(true);
  
  const {
    users,
    setUsers,
    isLoading,
    fetchUsers
  } = useFetchUsers();
  
  const {
    searchTerm,
    setSearchTerm,
    filterUsers
  } = useUserSearch();
  
  const {
    selectedUsers,
    setSelectedUsers,
    toggleUserSelection,
    toggleAllUsers: baseToggleAllUsers
  } = useUserSelection();
  
  const {
    isActionLoading,
    selectedUser,
    isDetailsOpen,
    isDeleteDialogOpen,
    isAddUserDialogOpen,
    isPermissionsDialogOpen,
    setIsDeleteDialogOpen,
    setIsAddUserDialogOpen,
    setIsPermissionsDialogOpen,
    handleDeleteUsers: baseHandleDeleteUsers,
    handleToggleUserStatus: baseHandleToggleUserStatus,
    handleViewUserDetails,
    handleCloseUserDetails,
    handleToggleUserSubscription: baseHandleToggleUserSubscription,
    handleManagePermissions,
    handlePermissionsUpdated: baseHandlePermissionsUpdated,
    reset: resetUserActions
  } = useUserActions();
  
  // Wrapper functions to include users and setUsers
  const toggleAllUsers = () => baseToggleAllUsers(users, searchTerm);
  
  const handleDeleteUsers = () => baseHandleDeleteUsers(selectedUsers, users, setUsers);
  
  const handleToggleUserStatus = (userId: string, isActive: boolean) => 
    baseHandleToggleUserStatus(userId, isActive, users, setUsers);
    
  const handleToggleUserSubscription = (userId: string, days: number = 30) => 
    baseHandleToggleUserSubscription(userId, days, users, setUsers);
    
  const handlePermissionsUpdated = (updatedUser: any) => 
    baseHandlePermissionsUpdated(updatedUser, users, setUsers);

  // Global cleanup function
  const cleanup = useCallback(() => {
    setSelectedUsers([]);
    resetUserActions();
  }, [setSelectedUsers, resetUserActions]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  // Initial fetch effect
  useEffect(() => {
    if (isInitialMount.current) {
      fetchUsers();
      isInitialMount.current = false;
    }
  }, [fetchUsers]);

  return {
    searchTerm,
    setSearchTerm,
    selectedUsers,
    setSelectedUsers,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isAddUserDialogOpen,
    setIsAddUserDialogOpen,
    users,
    setUsers,
    isLoading,
    isActionLoading,
    selectedUser,
    isDetailsOpen,
    isPermissionsDialogOpen,
    setIsPermissionsDialogOpen,
    fetchUsers,
    toggleUserSelection,
    toggleAllUsers,
    handleDeleteUsers,
    handleToggleUserStatus,
    handleViewUserDetails,
    handleCloseUserDetails,
    handleToggleUserSubscription,
    handleManagePermissions,
    handlePermissionsUpdated,
    cleanup
  };
};
