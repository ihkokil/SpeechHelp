
import { useEffect, useRef, useCallback } from 'react';
import { useFetchUsers } from './hooks/useFetchUsers';
import { useUserSearch } from './hooks/useUserSearch';
import { useUserSelection } from './hooks/useUserSelection';
import { useUserActions } from './hooks/useUserActions';
import { useToast } from '@/hooks/use-toast';

export const useUserManagement = () => {
  const isInitialMount = useRef(true);
  const isMounted = useRef(true);
  const { toast } = useToast();
  
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
    toggleAllUsers: baseToggleAllUsers,
    clearSelection
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
  const toggleAllUsers = useCallback((filteredUsers) => {
    if (isMounted.current) {
      baseToggleAllUsers(filteredUsers);
    }
  }, [baseToggleAllUsers]);
  
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

  // Bulk action handlers
  const handleBulkDelete = useCallback(() => {
    if (selectedUsers.length === 0) {
      toast({
        title: "No users selected",
        description: "Please select at least one user to delete.",
        variant: "destructive",
      });
      return;
    }
    setIsDeleteDialogOpen(true);
  }, [selectedUsers.length, setIsDeleteDialogOpen, toast]);

  const handleBulkActivate = useCallback(async () => {
    if (selectedUsers.length === 0) {
      toast({
        title: "No users selected",
        description: "Please select at least one user to activate.",
        variant: "destructive",
      });
      return;
    }

    const updatedUsers = [...users];
    let successCount = 0;

    for (const userId of selectedUsers) {
      try {
        const success = await baseHandleToggleUserStatus(userId, true, users, (newUsers) => {
          updatedUsers.splice(0, updatedUsers.length, ...newUsers);
        });
        if (success) successCount++;
      } catch (error) {
        console.error(`Error activating user ${userId}:`, error);
      }
    }

    setUsers(updatedUsers);
    
    toast({
      title: `${successCount} users activated`,
      description: `Successfully activated ${successCount} out of ${selectedUsers.length} selected users.`
    });
    
    if (successCount > 0) {
      clearSelection();
    }
  }, [selectedUsers, users, setUsers, baseHandleToggleUserStatus, toast, clearSelection]);

  const handleBulkDeactivate = useCallback(async () => {
    if (selectedUsers.length === 0) {
      toast({
        title: "No users selected",
        description: "Please select at least one user to deactivate.",
        variant: "destructive",
      });
      return;
    }

    const updatedUsers = [...users];
    let successCount = 0;

    for (const userId of selectedUsers) {
      try {
        const success = await baseHandleToggleUserStatus(userId, false, users, (newUsers) => {
          updatedUsers.splice(0, updatedUsers.length, ...newUsers);
        });
        if (success) successCount++;
      } catch (error) {
        console.error(`Error deactivating user ${userId}:`, error);
      }
    }

    setUsers(updatedUsers);
    
    toast({
      title: `${successCount} users deactivated`,
      description: `Successfully deactivated ${successCount} out of ${selectedUsers.length} selected users.`
    });
    
    if (successCount > 0) {
      clearSelection();
    }
  }, [selectedUsers, users, setUsers, baseHandleToggleUserStatus, toast, clearSelection]);

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
    handleBulkDelete,
    handleBulkActivate,
    handleBulkDeactivate,
    cleanup
  };
};
