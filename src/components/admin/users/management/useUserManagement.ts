
import { useState, useCallback, useEffect, useRef } from 'react';
import { useFetchUsers } from './hooks/useFetchUsers';
import { useUserSearch } from './hooks/useUserSearch';
import { useUserSelection } from './hooks/useUserSelection';
import { useUserActions } from './hooks/useUserActions';
import { useUserDetails } from './hooks/user-actions/useUserDetails';
import { usePermissionActions } from './hooks/user-actions/usePermissionActions';
import { useUserCrud } from './hooks/user-actions/useUserCrud';
import { useSubscriptionActions } from './hooks/user-actions/useSubscriptionActions';
import { useActionState } from './hooks/user-actions/useActionState';
import { User } from '../types';
import { toast } from '@/components/ui/use-toast';

export const useUserManagement = () => {
  console.log("Initializing useUserManagement");
  const isMounted = useRef(true);
  const isInitialMount = useRef(true);

  // User data state
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  
  // Dialogs and drawer state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isPermissionsDialogOpen, setIsPermissionsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  // Fetch users data
  const { fetchUsers: apiFetchUsers } = useFetchUsers();
  
  // User search
  const { searchTerm, setSearchTerm, filteredUsers } = useUserSearch(users);
  
  // User selection
  const { 
    selectedUsers, 
    setSelectedUsers, 
    toggleUserSelection,
    toggleAllUsers 
  } = useUserSelection();
  
  // Action state
  const { setActionLoading } = useActionState(setIsActionLoading);
  
  // Permission actions
  const { handlePermissionsUpdated: baseHandlePermissionsUpdated } = usePermissionActions(setIsPermissionsDialogOpen);
  
  // User CRUD operations
  const { 
    handleDeleteUsers: baseHandleDeleteUsers,
    handleBulkDelete: baseHandleBulkDelete,
    handleBulkActivate: baseHandleBulkActivate,
    handleBulkDeactivate: baseHandleBulkDeactivate
  } = useUserCrud(setActionLoading);
  
  // Subscription actions
  const {
    handleToggleUserStatus: baseHandleToggleUserStatus,
    handleToggleUserSubscription: baseHandleToggleUserSubscription
  } = useSubscriptionActions(setActionLoading);
  
  // User details
  const {
    handleViewUserDetails: baseHandleViewUserDetails,
    handleCloseUserDetails: baseHandleCloseUserDetails,
    handleManagePermissions: baseHandleManagePermissions
  } = useUserDetails(setSelectedUser, setIsDetailsOpen, setIsPermissionsDialogOpen);
  
  // Fetch users
  const fetchUsers = useCallback(async () => {
    console.log("Fetching users...");
    if (isMounted.current) {
      setIsLoading(true);
      try {
        const fetchedUsers = await apiFetchUsers();
        console.log("Fetched users:", fetchedUsers);
        if (isMounted.current) {
          setUsers(fetchedUsers || []);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        toast({
          title: "Error",
          description: "Failed to fetch users. Please try again.",
          variant: "destructive"
        });
      } finally {
        if (isMounted.current) {
          setIsLoading(false);
        }
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
  }, [baseHandleDeleteUsers, selectedUsers, users, setUsers]);
  
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
  
  // Lifecycle hooks
  useEffect(() => {
    isMounted.current = true;
    
    return () => {
      isMounted.current = false;
    };
  }, []);
  
  // Cleanup function for component unmount
  const cleanup = useCallback(() => {
    setSelectedUsers([]);
    setSearchTerm('');
    setIsDeleteDialogOpen(false);
    setIsAddUserDialogOpen(false);
    setIsDetailsOpen(false);
    setIsPermissionsDialogOpen(false);
    setSelectedUser(null);
  }, [setSelectedUsers, setSearchTerm]);
  
  // Log filtered users for debugging
  useEffect(() => {
    console.log('Filtered users:', filteredUsers);
  }, [filteredUsers]);
  
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
    cleanup
  };
};
