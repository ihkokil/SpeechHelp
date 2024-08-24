import { useCallback, useEffect, useRef } from 'react';
import { useUserManagementData } from './hooks/useUserManagementData';
import { useUserSearch } from './hooks/useUserSearch';
import { useUserSelection } from './hooks/useUserSelection';
import { useUserActions } from './hooks/useUserActions';
import { useUserManagementUIState } from './hooks/useUserManagementUIState';
import { User } from '../types';
import { useToast } from '@/hooks/use-toast';
import { usePermissionActions } from './hooks/user-actions/usePermissionActions';

export const useUserManagement = () => {
  const isMounted = useRef(true);
  const { toast } = useToast();

  const {
    users,
    setUsers,
    isLoading,
    fetchUsers,
    addUser
  } = useUserManagementData();

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

  const { searchTerm, setSearchTerm, filteredUsers } = useUserSearch(users);

  const {
    selectedUsers,
    setSelectedUsers,
    toggleUserSelection,
    toggleAllUsers,
    clearSelection
  } = useUserSelection();

  const { handlePermissionsUpdated: baseHandlePermissionsUpdated } = usePermissionActions();

  const {
    handleDeleteUsers: baseHandleDeleteUsers,
    handleBulkDelete: baseHandleBulkDelete,
    handleBulkActivate: baseHandleBulkActivate,
    handleBulkDeactivate: baseHandleBulkDeactivate,
    handleToggleUserStatus: baseHandleToggleUserStatus,
    handleToggleUserSubscription: baseHandleToggleUserSubscription,
    isActionLoading
  } = useUserActions();

  const handleViewUserDetails = useCallback((user: User) => {
    setSelectedUser(user);
    setIsDetailsOpen(true);
  }, [setSelectedUser, setIsDetailsOpen]);

  const handleCloseUserDetails = useCallback(() => {
    setIsDetailsOpen(false);
    setTimeout(() => setSelectedUser(null), 300);
  }, [setIsDetailsOpen, setSelectedUser]);

  const handleManagePermissions = useCallback((user: User) => {
    setSelectedUser(user);
    setIsPermissionsDialogOpen(true);
  }, [setSelectedUser, setIsPermissionsDialogOpen]);

  // ✅ FIXED: Only pass updatedUser if that's all the handler expects
  const handlePermissionsUpdated = useCallback((updatedUser: User) => {
    baseHandlePermissionsUpdated(updatedUser);
    setIsPermissionsDialogOpen(false);
  }, [baseHandlePermissionsUpdated, setIsPermissionsDialogOpen]);

  const handleEditUser = useCallback((user: User) => {
    setSelectedUser(user);
    setIsEditUserDialogOpen(true);
  }, [setSelectedUser, setIsEditUserDialogOpen]);

  const handleSendEmail = useCallback((user: User) => {
    setSelectedUser(user);
    setIsEmailDialogOpen(true);

    toast({
      title: 'Email Function',
      description: `Email dialog for ${user.email} would open here.`,
    });
  }, [setSelectedUser, setIsEmailDialogOpen, toast]);

  const handleToggleUserStatus = useCallback((userId: string, isActive: boolean) => {
    return baseHandleToggleUserStatus(userId, isActive, users, setUsers);
  }, [baseHandleToggleUserStatus, users, setUsers]);

  const handleToggleUserSubscription = useCallback((userId: string) => {
    return baseHandleToggleUserSubscription(userId, 30, users, setUsers);
  }, [baseHandleToggleUserSubscription, users, setUsers]);

  const handleDeleteUsers = useCallback(() => {
    baseHandleDeleteUsers(selectedUsers, users, setUsers);
    setIsDeleteDialogOpen(false);
  }, [baseHandleDeleteUsers, selectedUsers, users, setUsers, setIsDeleteDialogOpen]);

  const handleDeleteUser = useCallback((userId: string) => {
    const userToDelete = users.find(user => user.id === userId);
    if (userToDelete) {
      setSelectedUsers([userToDelete]);
      setIsDeleteDialogOpen(true);
    }
  }, [users, setSelectedUsers, setIsDeleteDialogOpen]);

  const handleBulkDelete = useCallback(() => {
    baseHandleBulkDelete(selectedUsers, users, setUsers);
  }, [baseHandleBulkDelete, selectedUsers, users, setUsers]);

  const handleBulkActivate = useCallback(() => {
    baseHandleBulkActivate(selectedUsers, users, setUsers);
  }, [baseHandleBulkActivate, selectedUsers, users, setUsers]);

  const handleBulkDeactivate = useCallback(() => {
    baseHandleBulkDeactivate(selectedUsers, users, setUsers);
  }, [baseHandleBulkDeactivate, selectedUsers, users, setUsers]);

  const cleanup = useCallback(() => {
    setSelectedUsers([]);
    setSearchTerm('');
    resetUIState();
  }, [setSelectedUsers, setSearchTerm, resetUIState]);

  useEffect(() => {
    isMounted.current = true;
    fetchUsers();
    return () => { isMounted.current = false; };
  }, [fetchUsers]);

  return {
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
    isEditUserDialogOpen,
    setIsEditUserDialogOpen,
    isEmailDialogOpen,
    setIsEmailDialogOpen,
    filteredUsers,

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
    cleanup,
    addUser
  };
};
