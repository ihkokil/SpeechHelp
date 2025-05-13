
import { useCallback, useState } from 'react';
import { User } from '../../types';
import { useBulkActions } from './user-actions/useBulkActions';
import { useIndividualUserActions } from './user-actions/useIndividualUserActions';
import { useToast } from '@/hooks/use-toast';
import { usePermissionActions } from './user-actions/usePermissionActions';
import { useUserDetails } from './user-actions/useUserDetails';

export const useUserActions = () => {
  const { toast } = useToast();
  // Create internal state for tracking action loading
  const [isActionLoading, setIsActionLoading] = useState(false);
  
  // Initialize hooks with necessary parameters
  const { 
    handleBulkDelete,
    handleBulkActivate,
    handleBulkDeactivate
  } = useBulkActions();
  
  const {
    handleToggleUserStatus,
    handleToggleUserSubscription,
    handleDeleteUser
  } = useIndividualUserActions();
  
  // Import user details and permission actions
  const { 
    handleViewUserDetails,
    handleCloseUserDetails,
    handleManagePermissions
  } = useUserDetails();
  
  const { 
    handlePermissionsUpdated 
  } = usePermissionActions();
  
  // Handle editing user
  const handleEditUser = useCallback((user: User) => {
    console.log('useUserActions: Edit user called for user:', user.id);
  }, []);
  
  // Handle sending email
  const handleSendEmail = useCallback((user: User) => {
    console.log('useUserActions: Send email called for user:', user.id);
    toast({
      title: 'Email Function',
      description: `Email dialog for ${user.email} would open here.`,
    });
  }, [toast]);
  
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
    // Actions
    handleEditUser,
    handleSendEmail,
    handleDeleteUsers,
    handleDeleteUser,
    handleBulkDelete,
    handleBulkActivate,
    handleBulkDeactivate,
    handleToggleUserStatus,
    handleToggleUserSubscription,
    handleViewUserDetails,
    handleCloseUserDetails,
    handleManagePermissions,
    handlePermissionsUpdated,
    
    // States
    isActionLoading
  };
};
