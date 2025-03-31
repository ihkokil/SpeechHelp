
import { useCallback } from 'react';
import { User } from '../../types';
import { useActionState } from './user-actions/useActionState';
import { useUserCrud } from './user-actions/useUserCrud';
import { useUserDetails } from './user-actions/useUserDetails';
import { useSubscriptionActions } from './user-actions/useSubscriptionActions';
import { usePermissionActions } from './user-actions/usePermissionActions';
import { useState } from 'react';

export const useUserActions = () => {
  // Create a local state to track action loading
  const [isActionLoading, setIsActionLoading] = useState(false);
  
  // Use the actual state setter instead of a dummy function
  const { setActionLoading } = useActionState(setIsActionLoading);
  
  // Initialize hooks with necessary parameters
  const { 
    handleDeleteUsers, 
    handleBulkDelete,
    handleBulkActivate,
    handleBulkDeactivate
  } = useUserCrud(setActionLoading);
  
  const {
    handleToggleUserStatus,
    handleToggleUserSubscription
  } = useSubscriptionActions(setActionLoading);
  
  // Create local states for user details and permissions dialogs
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isPermissionsDialogOpen, setIsPermissionsDialogOpen] = useState(false);
  
  const {
    handleViewUserDetails,
    handleCloseUserDetails,
    handleManagePermissions
  } = useUserDetails(setSelectedUser, setIsDetailsOpen, setIsPermissionsDialogOpen);
  
  const { handlePermissionsUpdated } = usePermissionActions(setIsPermissionsDialogOpen);
  
  // Return all actions and state from sub-hooks
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
