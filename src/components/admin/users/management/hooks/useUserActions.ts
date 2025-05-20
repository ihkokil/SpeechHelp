
import { useCallback, useState } from 'react';
import { User } from '../../types';
import { useBulkActions } from './user-actions/useBulkActions';
import { useIndividualUserActions } from './user-actions/useIndividualUserActions';
import { useSubscriptionActions } from './user-actions/useSubscriptionActions';
import { useToast } from '@/hooks/use-toast';
import { useUserManagementData } from './useUserManagementData';

export const useUserActions = () => {
  const { toast } = useToast();
  // Create internal state for tracking action loading
  const [isActionLoading, setIsActionLoading] = useState(false);
  
  // Get access to users data
  const { users } = useUserManagementData();
  
  // Create local states for user details and permissions dialogs
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isPermissionsDialogOpen, setIsPermissionsDialogOpen] = useState(false);
  const [isSubscriptionDialogOpen, setIsSubscriptionDialogOpen] = useState(false);
  
  // Initialize hooks with necessary parameters
  const { 
    handleBulkDelete,
    handleBulkActivate,
    handleBulkDeactivate
  } = useBulkActions();
  
  const {
    handleToggleUserStatus,
    handleDeleteUser
  } = useIndividualUserActions();
  
  const {
    handleToggleUserSubscription,
    handleUpdateUserSubscription
  } = useSubscriptionActions();
  
  // View user details handler
  const handleViewUserDetails = useCallback((user: User) => {
    setSelectedUser(user);
    setIsDetailsOpen(true);
  }, []);
  
  // Close user details handler
  const handleCloseUserDetails = useCallback(() => {
    setIsDetailsOpen(false);
    setTimeout(() => {
      setSelectedUser(null);
    }, 300);
  }, []);
  
  // Manage user permissions handler
  const handleManagePermissions = useCallback((user: User) => {
    setSelectedUser(user);
    setIsPermissionsDialogOpen(true);
  }, []);
  
  // Manage user subscription handler
  const handleManageSubscription = useCallback((userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setSelectedUser(user);
      setIsSubscriptionDialogOpen(true);
    } else {
      console.error(`User with ID ${userId} not found`);
    }
  }, [users]);
  
  // Handle permissions updated
  const handlePermissionsUpdated = useCallback((updatedUser: User, users: User[] = [], setUsers: ((users: User[]) => void) | null = null) => {
    // Update the user in the users array if setUsers is provided
    if (setUsers && users.length > 0) {
      setUsers(
        users.map(user => 
          user.id === updatedUser.id ? updatedUser : user
        )
      );
    }
    
    // Show a success toast
    toast({
      title: 'Permissions Updated',
      description: `${updatedUser.email}'s admin permissions have been updated.`,
    });
    
    // Close the dialog
    setIsPermissionsDialogOpen(false);
  }, [toast]);
  
  // Handle deleting users (plural for backward compatibility)
  const handleDeleteUsers = useCallback(async (
    selectedUsers: User[], 
    users: User[] = [], 
    setUsers: ((users: User[]) => void) | null = null
  ) => {
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
    handleUpdateUserSubscription,
    handleManageSubscription,
    
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
    setIsPermissionsDialogOpen,
    isSubscriptionDialogOpen,
    setIsSubscriptionDialogOpen
  };
};
