
import { useCallback } from 'react';
import { User } from '../../types';
import { useActionState } from './user-actions/useActionState';
import { useUserCrud } from './user-actions/useUserCrud';
import { useUserDetails } from './user-actions/useUserDetails';
import { useSubscriptionActions } from './user-actions/useSubscriptionActions';
import { usePermissionActions } from './user-actions/usePermissionActions';

export const useUserActions = () => {
  // Create a dummy setState function to pass to useActionState
  const dummySetState = () => {};
  
  // Get the setActionLoading function by providing the dummy setState function
  const { setActionLoading } = useActionState(dummySetState);
  
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
  } = useUserDetails(dummySetState, dummySetState, dummySetState);
  
  const { handlePermissionsUpdated } = usePermissionActions(dummySetState);
  
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
