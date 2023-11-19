
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
  const toggleAllUsers = useCallback((filteredUsers = []) => {
    if (isMounted.current) {
      const currentFilteredUsers = filterUsers(users, searchTerm);
      baseToggleAllUsers(currentFilteredUsers);
    }
  }, [baseToggleAllUsers, users, searchTerm, filterUsers]);
  
  const handleDeleteUsers = useCallback(async () => {
    if (isMounted.current) {
      const success = await baseHandleDeleteUsers(selectedUsers, users, setUsers);
      if (success) {
        setSelectedUsers([]);
      }
    }
  }, [baseHandleDeleteUsers, selectedUsers, users, setUsers, setSelectedUsers]);
  
  const handleToggleUserStatus = useCallback(async (userId, isActive) => {
    if (isMounted.current) {
      return await baseHandleToggleUserStatus(userId, isActive, users, setUsers);
    }
  }, [baseHandleToggleUserStatus, users, setUsers]);
    
  const handleToggleUserSubscription = useCallback(async (userId, days = 30) => {
    if (isMounted.current) {
      return await baseHandleToggleUserSubscription(userId, days, users, setUsers);
    }
  }, [baseHandleToggleUserSubscription, users, setUsers]);
    
  const handlePermissionsUpdated = useCallback((updatedUser) => {
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
