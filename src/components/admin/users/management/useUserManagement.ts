
import { useState, useCallback, useEffect, useRef } from 'react';
import { useFetchUsers } from './hooks/useFetchUsers';
import { useUserSearch } from './hooks/useUserSearch';
import { useUserSelection } from './hooks/useUserSelection';
import { useUserActions } from './hooks/useUserActions';
import { User } from '../types';
import { useToast } from '@/hooks/use-toast';

export const useUserManagement = () => {
  console.log("Initializing useUserManagement");
  const isMounted = useRef(true);
  const isInitialMount = useRef(true);

  // User data state
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Dialogs and drawer state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  
  // Fetch users data
  const { users: fetchedUsers, isLoading: isFetchLoading, fetchUsers: apiFetchUsers } = useFetchUsers();
  
  // User search
  const { searchTerm, setSearchTerm, filteredUsers } = useUserSearch(users);
  
  // User selection
  const { 
    selectedUsers, 
    setSelectedUsers, 
    toggleUserSelection,
    toggleAllUsers 
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
    isActionLoading,
    selectedUser,
    isDetailsOpen,
    isPermissionsDialogOpen,
    setIsPermissionsDialogOpen
  } = useUserActions();
  
  // Update users when fetchedUsers changes
  useEffect(() => {
    if (fetchedUsers && fetchedUsers.length > 0) {
      setUsers(fetchedUsers);
      setIsLoading(false);
    }
  }, [fetchedUsers]);
  
  // Fetch users
  const fetchUsers = useCallback(async () => {
    console.log("Fetching users...");
    if (isMounted.current) {
      setIsLoading(true);
      try {
        await apiFetchUsers();
      } catch (error) {
        console.error("Error fetching users:", error);
        useToast().toast({
          title: "Error",
          description: "Failed to fetch users. Please try again.",
          variant: "destructive"
        });
      }
    }
  }, [apiFetchUsers]);
  
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
  }, [baseHandleDeleteUsers, selectedUsers, users]);
  
  const handleToggleUserStatus = useCallback(async (userId: string, isActive: boolean) => {
    if (isMounted.current) {
      return await baseHandleToggleUserStatus(userId, isActive, users, setUsers);
    }
  }, [baseHandleToggleUserStatus, users]);
  
  const handleToggleUserSubscription = useCallback(async (userId: string, days = 30) => {
    if (isMounted.current) {
      return await baseHandleToggleUserSubscription(userId, days, users, setUsers);
    }
  }, [baseHandleToggleUserSubscription, users]);
  
  const handlePermissionsUpdated = useCallback((updatedUser: User) => {
    if (isMounted.current) {
      baseHandlePermissionsUpdated(updatedUser, users, setUsers);
    }
  }, [baseHandlePermissionsUpdated, users]);
  
  const handleViewUserDetails = useCallback((user: User) => {
    if (isMounted.current) {
      console.log("UserManagement: View details called for user:", user.id);
      baseHandleViewUserDetails(user);
    }
  }, [baseHandleViewUserDetails]);
  
  const handleCloseUserDetails = useCallback(() => {
    if (isMounted.current) {
      baseHandleCloseUserDetails();
    }
  }, [baseHandleCloseUserDetails]);
  
  const handleManagePermissions = useCallback((user: User) => {
    if (isMounted.current) {
      baseHandleManagePermissions(user);
    }
  }, [baseHandleManagePermissions]);
  
  // Bulk actions
  const handleBulkDelete = useCallback(async () => {
    if (isMounted.current) {
      await baseHandleBulkDelete(selectedUsers, users, setUsers);
    }
  }, [baseHandleBulkDelete, selectedUsers, users]);
  
  const handleBulkActivate = useCallback(async () => {
    if (isMounted.current) {
      await baseHandleBulkActivate(selectedUsers, users, setUsers);
    }
  }, [baseHandleBulkActivate, selectedUsers, users]);
  
  const handleBulkDeactivate = useCallback(async () => {
    if (isMounted.current) {
      await baseHandleBulkDeactivate(selectedUsers, users, setUsers);
    }
  }, [baseHandleBulkDeactivate, selectedUsers, users]);
  
  // Lifecycle hooks
  useEffect(() => {
    isMounted.current = true;
    
    // Fetch users on initial mount
    fetchUsers();
    
    return () => {
      isMounted.current = false;
    };
  }, [fetchUsers]);
  
  // Cleanup function for component unmount
  const cleanup = useCallback(() => {
    setSelectedUsers([]);
    setSearchTerm('');
    setIsDeleteDialogOpen(false);
    setIsAddUserDialogOpen(false);
  }, [setSelectedUsers, setSearchTerm]);
  
  return {
    // State
    users,
    setUsers,
    searchTerm,
    setSearchTerm,
    selectedUsers,
    setSelectedUsers,
    isLoading: isLoading || isFetchLoading,
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
    cleanup
  };
};
