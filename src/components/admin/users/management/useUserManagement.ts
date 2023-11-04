
import { useEffect, useRef, useCallback } from 'react';
import { useFetchUsers } from './hooks/useFetchUsers';
import { useUserSearch } from './hooks/useUserSearch';
import { useUserSelection } from './hooks/useUserSelection';
import { useUserActions } from './hooks/useUserActions';

export const useUserManagement = () => {
  const isInitialMount = useRef(true);
  const isMounted = useRef(true);
  
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
  const toggleAllUsers = useCallback(() => {
    if (isMounted.current) {
      baseToggleAllUsers(users, searchTerm);
    }
  }, [baseToggleAllUsers, users, searchTerm]);
  
  const handleDeleteUsers = useCallback(() => {
    if (isMounted.current) {
      baseHandleDeleteUsers(selectedUsers, users, setUsers);
    }
  }, [baseHandleDeleteUsers, selectedUsers, users, setUsers]);
  
  const handleToggleUserStatus = useCallback((userId: string, isActive: boolean) => {
    if (isMounted.current) {
      baseHandleToggleUserStatus(userId, isActive, users, setUsers);
    }
  }, [baseHandleToggleUserStatus, users, setUsers]);
    
  const handleToggleUserSubscription = useCallback((userId: string, days: number = 30) => {
    if (isMounted.current) {
      baseHandleToggleUserSubscription(userId, days, users, setUsers);
    }
  }, [baseHandleToggleUserSubscription, users, setUsers]);
    
  const handlePermissionsUpdated = useCallback((updatedUser: any) => {
    if (isMounted.current) {
      baseHandlePermissionsUpdated(updatedUser, users, setUsers);
    }
  }, [baseHandlePermissionsUpdated, users, setUsers]);

  // Global cleanup function
  const cleanup = useCallback(() => {
    console.log('UserManagement: Running cleanup');
    if (isMounted.current) {
      setSelectedUsers([]);
      resetUserActions();
    }
  }, [setSelectedUsers, resetUserActions]);

  // Cleanup effect on unmount
  useEffect(() => {
    return () => {
      console.log('UserManagement: Component unmounting');
      isMounted.current = false;
      cleanup();
    };
  }, [cleanup]);

  // Initial fetch effect
  useEffect(() => {
    if (isInitialMount.current && isMounted.current) {
      console.log('UserManagement: Initial fetch');
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
