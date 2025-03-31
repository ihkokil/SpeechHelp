
import { useCallback } from 'react';
import { User } from '../../types';
import { useActionState } from './user-actions/useActionState';
import { useUserCrud } from './user-actions/useUserCrud';
import { useUserDetails } from './user-actions/useUserDetails';
import { useSubscriptionActions } from './user-actions/useSubscriptionActions';
import { usePermissionActions } from './user-actions/usePermissionActions';

export const useUserActions = () => {
  // Get the setActionLoading function without providing setIsActionLoading
  // as we don't need it in this composition hook
  const { setActionLoading } = useActionState();
  
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
  
  const {
    handleViewUserDetails,
    handleCloseUserDetails,
    handleManagePermissions
  } = useUserDetails();
  
  const { handlePermissionsUpdated } = usePermissionActions();
  
  // Return all actions from sub-hooks
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
  };
};
