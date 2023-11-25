
import { useActionState } from './user-actions/useActionState';
import { useUserCrud } from './user-actions/useUserCrud';
import { useSubscriptionActions } from './user-actions/useSubscriptionActions';
import { useUserDetails } from './user-actions/useUserDetails';
import { usePermissionActions } from './user-actions/usePermissionActions';

export const useUserActions = () => {
  const {
    isActionLoading,
    setIsActionLoading,
    selectedUser,
    setSelectedUser,
    isDetailsOpen,
    setIsDetailsOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isAddUserDialogOpen,
    setIsAddUserDialogOpen,
    isPermissionsDialogOpen,
    setIsPermissionsDialogOpen,
    reset
  } = useActionState();

  const {
    handleDeleteUsers,
    handleToggleUserStatus
  } = useUserCrud(setIsActionLoading, setIsDeleteDialogOpen);

  const {
    handleToggleUserSubscription
  } = useSubscriptionActions(setIsActionLoading);

  const {
    handleViewUserDetails,
    handleCloseUserDetails,
    handleManagePermissions
  } = useUserDetails(setSelectedUser, setIsDetailsOpen, setIsPermissionsDialogOpen);

  const {
    handlePermissionsUpdated
  } = usePermissionActions(setIsPermissionsDialogOpen);

  return {
    isActionLoading,
    selectedUser,
    isDetailsOpen,
    isDeleteDialogOpen,
    isAddUserDialogOpen,
    isPermissionsDialogOpen,
    setIsDeleteDialogOpen,
    setIsAddUserDialogOpen,
    setIsPermissionsDialogOpen,
    handleDeleteUsers,
    handleToggleUserStatus,
    handleViewUserDetails,
    handleCloseUserDetails,
    handleToggleUserSubscription,
    handleManagePermissions,
    handlePermissionsUpdated,
    reset
  };
};
