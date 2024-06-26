
import { useRef } from 'react';
import { useUserManagementData } from './hooks/useUserManagementData';
import { useUserSearch } from './hooks/useUserSearch';
import { useUserSelection } from './hooks/useUserSelection';
import { useUserActions } from './hooks/useUserActions';
import { useUserManagementUIState } from './hooks/useUserManagementUIState';
import { usePermissionsHandlers } from './hooks/usePermissionsHandlers';
import { useUserDetailsHandlers } from './hooks/useUserDetailsHandlers';
import { useStatusHandlers } from './hooks/useStatusHandlers';
import { useDeleteHandlers } from './hooks/useDeleteHandlers';
import { useBulkActionHandlers } from './hooks/useBulkActionHandlers';
import { useLifecycle } from './hooks/useLifecycle';
import { useToast } from '@/hooks/use-toast';

export const useUserManagement = () => {
  console.log("Initializing useUserManagement");
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
  
  // Get all user actions and their states from the useUserActions hook
  const {
    // Actions
    handleDeleteUsers: baseHandleDeleteUsers,
    handleBulkDelete: baseHandleBulkDelete,
    handleBulkActivate: baseHandleBulkActivate,
    handleBulkDeactivate: baseHandleBulkDeactivate,
    handleToggleUserStatus: baseHandleToggleUserStatus,
    handleToggleUserSubscription: baseHandleToggleUserSubscription,
    
    // States
    isActionLoading
  } = useUserActions();
  
  // Permission handlers
  const {
    handleManagePermissions,
    handlePermissionsUpdated
  } = usePermissionsHandlers(
    setSelectedUser,
    setIsPermissionsDialogOpen,
    setUsers
  );
  
  // User details handlers
  const {
    handleViewUserDetails,
    handleCloseUserDetails,
    handleEditUser,
    handleUserUpdated,
    handleSendEmail
  } = useUserDetailsHandlers(
    setSelectedUser,
    setIsDetailsOpen,
    setIsEditUserDialogOpen,
    setIsEmailDialogOpen,
    setUsers
  );
  
  // Status handlers
  const {
    handleToggleUserStatus,
    handleToggleUserSubscription
  } = useStatusHandlers(
    baseHandleToggleUserStatus,
    baseHandleToggleUserSubscription,
    users,
    setUsers
  );
  
  // Delete handlers
  const {
    handleDeleteUsers,
    handleDeleteUser
  } = useDeleteHandlers(
    baseHandleDeleteUsers,
    users,
    setUsers,
    setIsDeleteDialogOpen,
    setSelectedUsers,
    selectedUsers  // Add selectedUsers parameter here
  );
  
  // Bulk action handlers
  const {
    handleBulkDelete,
    handleBulkActivate,
    handleBulkDeactivate
  } = useBulkActionHandlers(
    baseHandleBulkDelete,
    baseHandleBulkActivate,
    baseHandleBulkDeactivate,
    selectedUsers,
    users,
    setUsers
  );
  
  // Lifecycle hooks
  const { cleanup } = useLifecycle(fetchUsers, setSelectedUsers, setSearchTerm, resetUIState);
  
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
    isEditUserDialogOpen,
    setIsEditUserDialogOpen,
    isEmailDialogOpen,
    setIsEmailDialogOpen,
    filteredUsers,
    
    // Functions
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
    handleUserUpdated,
    handleSendEmail,
    cleanup,
    addUser
  };
};
