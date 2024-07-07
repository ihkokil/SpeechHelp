
import { useCallback, useState } from 'react';
import { User } from '../../types';
import { useBulkActions } from './user-actions/useBulkActions';
import { useIndividualUserActions } from './user-actions/useIndividualUserActions';
import { useToast } from '@/hooks/use-toast';
import { usePermissionActions } from './user-actions/usePermissionActions';
import { useUserDetails } from './user-actions/useUserDetails';

export const useUserActions = (users = [], setUsers = null) => {
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
  
  // Handle bulk actions with closure to avoid argument issues
  const handleBulkDeleteWrapper = useCallback(() => {
    if (!users || !setUsers) {
      console.error('useUserActions: Missing users or setUsers for bulk delete');
      return;
    }
    return async (selectedUsers: User[]) => {
      setIsActionLoading(true);
      try {
        await handleBulkDelete(selectedUsers, users, setUsers);
      } catch (error) {
        console.error('Error in bulk delete:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete users. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsActionLoading(false);
      }
    };
  }, [handleBulkDelete, users, setUsers, toast]);
  
  const handleBulkActivateWrapper = useCallback(() => {
    if (!users || !setUsers) {
      console.error('useUserActions: Missing users or setUsers for bulk activate');
      return;
    }
    return async (selectedUsers: User[]) => {
      setIsActionLoading(true);
      try {
        await handleBulkActivate(selectedUsers, users, setUsers);
      } catch (error) {
        console.error('Error in bulk activate:', error);
        toast({
          title: 'Error',
          description: 'Failed to activate users. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsActionLoading(false);
      }
    };
  }, [handleBulkActivate, users, setUsers, toast]);
  
  const handleBulkDeactivateWrapper = useCallback(() => {
    if (!users || !setUsers) {
      console.error('useUserActions: Missing users or setUsers for bulk deactivate');
      return;
    }
    return async (selectedUsers: User[]) => {
      setIsActionLoading(true);
      try {
        await handleBulkDeactivate(selectedUsers, users, setUsers);
      } catch (error) {
        console.error('Error in bulk deactivate:', error);
        toast({
          title: 'Error',
          description: 'Failed to deactivate users. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsActionLoading(false);
      }
    };
  }, [handleBulkDeactivate, users, setUsers, toast]);
  
  // Handle deleting users with closure to avoid argument issues
  const handleDeleteUsersWrapper = useCallback(() => {
    if (!users || !setUsers) {
      console.error('useUserActions: Missing users or setUsers for delete users');
      return;
    }
    return async (selectedUsers: User[]) => {
      console.log('Deleting users:', selectedUsers.map(user => user.id));
      setIsActionLoading(true);
      try {
        // If only one user, use the single user delete method
        if (selectedUsers.length === 1) {
          await handleDeleteUser(selectedUsers[0].id, users, setUsers);
        } else {
          await handleBulkDelete(selectedUsers, users, setUsers);
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
    };
  }, [handleDeleteUser, handleBulkDelete, users, setUsers, toast]);
  
  // Return all actions and state
  return {
    // Actions
    handleEditUser,
    handleSendEmail,
    handleDeleteUsers: handleDeleteUsersWrapper(),
    handleDeleteUser,
    handleBulkDelete: handleBulkDeleteWrapper(),
    handleBulkActivate: handleBulkActivateWrapper(),
    handleBulkDeactivate: handleBulkDeactivateWrapper(),
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
