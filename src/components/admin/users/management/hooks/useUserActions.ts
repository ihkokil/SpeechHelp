
import { useCallback, useState } from 'react';
import { User } from '../../types';
import { useUserCrud } from './user-actions/useUserCrud';
import { useSubscriptionActions } from './user-actions/useSubscriptionActions';
import { usePermissionActions } from './user-actions/usePermissionActions';

export const useUserActions = () => {
  // Create internal state for tracking action loading
  const [isActionLoading, setIsActionLoading] = useState(false);
  
  // Create local states for user details and permissions dialogs
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isPermissionsDialogOpen, setIsPermissionsDialogOpen] = useState(false);
  
  // Initialize hooks with necessary parameters
  const { 
    handleDeleteUsers, 
    handleBulkDelete,
    handleBulkActivate,
    handleBulkDeactivate
  } = useUserCrud(setIsActionLoading);
  
  const {
    handleToggleUserStatus,
    handleToggleUserSubscription
  } = useSubscriptionActions(setIsActionLoading);
  
  // View user details
  const handleViewUserDetails = useCallback((user: User) => {
    console.log("useUserActions: View details called for user:", user.id);
    setSelectedUser(user);
    setIsDetailsOpen(true);
  }, []);
  
  // Close user details
  const handleCloseUserDetails = useCallback(() => {
    console.log("useUserActions: Close details called");
    setIsDetailsOpen(false);
    // We set selected user to null with a delay to prevent UI flickering
    setTimeout(() => {
      setSelectedUser(null);
    }, 300);
  }, []);
  
  // Manage user permissions
  const handleManagePermissions = useCallback((user: User) => {
    console.log("useUserActions: Manage permissions called for user:", user.id);
    setSelectedUser(user);
    setIsPermissionsDialogOpen(true);
  }, []);
  
  // Handle permissions updated
  const { handlePermissionsUpdated } = usePermissionActions(setIsPermissionsDialogOpen);
  
  // Return all actions and state
  return {
    // User CRUD operations
    handleDeleteUsers,
    handleBulkDelete,
    handleBulkActivate,
    handleBulkDeactivate,
    
    // User subscription and status operations
    handleToggleUserStatus,
    handleToggleUserSubscription,
    
    // User details operations
    handleViewUserDetails,
    handleCloseUserDetails,
    handleManagePermissions,
    
    // Permission operations
    handlePermissionsUpdated,
    
    // States
    isActionLoading,
    selectedUser,
    isDetailsOpen,
    isPermissionsDialogOpen,
    setIsPermissionsDialogOpen
  };
};
