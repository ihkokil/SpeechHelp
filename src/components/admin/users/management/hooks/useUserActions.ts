
import { useCallback, useState } from 'react';
import { User } from '../../types';
import { useBulkActions } from './user-actions/useBulkActions';
import { useIndividualUserActions } from './user-actions/useIndividualUserActions';
import { useUserDetails } from './user-actions/useUserDetails'; 
import { usePermissionActions } from './user-actions/usePermissionActions';
import { useSubscriptionActions } from './user-actions/useSubscriptionActions';
import { useToast } from '@/hooks/use-toast';

export const useUserActions = () => {
  const { toast } = useToast();
  // Create internal state for tracking action loading
  const [isActionLoading, setIsActionLoading] = useState(false);
  
  // Create local states for user details and permissions dialogs
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isPermissionsDialogOpen, setIsPermissionsDialogOpen] = useState(false);
  
  // Initialize user details hook
  const {
    handleViewUserDetails,
    handleCloseUserDetails,
    handleManagePermissions,
  } = useUserDetails({
    setSelectedUser,
    setIsDetailsOpen,
    setIsPermissionsDialogOpen
  });
  
  // Initialize hooks with necessary parameters
  const { 
    handleBulkDelete,
    handleBulkActivate,
    handleBulkDeactivate
  } = useBulkActions();
  
  const {
    handleToggleUserStatus,
    handleToggleUserSubscription
  } = useSubscriptionActions({
    setIsActionLoading
  });
  
  const {
    handlePermissionsUpdated
  } = usePermissionActions(setIsPermissionsDialogOpen);
  
  const {
    handleDeleteUser
  } = useIndividualUserActions();
  
  // Handle deleting users (plural for backward compatibility)
  const handleDeleteUsers = useCallback(async (
    selectedUsers: User[], 
    users: User[] = [], 
    setUsers: ((users: User[]) => void) | null = null
  ) => {
    console.log('Deleting users:', selectedUsers.map(user => user.id));
    setIsActionLoading(true);
    try {
      // If only one user, use the single user delete method
      if (selectedUsers.length === 1) {
        if (setUsers && users.length > 0) {
          await handleDeleteUser(selectedUsers[0].id, users, setUsers);
        } else {
          await handleDeleteUser(selectedUsers[0].id, [], null);
        }
      } else {
        if (setUsers && users.length > 0) {
          await handleBulkDelete(selectedUsers, users, setUsers);
        } else {
          await handleBulkDelete(selectedUsers, [], null);
        }
      }
    } catch (error) {
      console.error('Error deleting users:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete users. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsActionLoading(false);
    }
  }, [handleDeleteUser, handleBulkDelete, toast]);
  
  // Return all actions and state
  return {
    // User CRUD operations
    handleDeleteUsers,
    handleDeleteUser,
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
