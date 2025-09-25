
import { useCallback, useState } from 'react';
import { User } from '../../types';
import { useBulkActions } from './user-actions/useBulkActions';
import { useIndividualUserActions } from './user-actions/useIndividualUserActions';
import { useToast } from '@/hooks/use-toast';

export const useUserActions = () => {
  const { toast } = useToast();
  // Create internal state for tracking action loading
  const [isActionLoading, setIsActionLoading] = useState(false);
  
  // Create local states for user details and permissions dialogs
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isPermissionsDialogOpen, setIsPermissionsDialogOpen] = useState(false);
  
  // Initialize hooks with necessary parameters
  const { 
    handleBulkDelete,
    handleBulkActivate,
    handleBulkDeactivate
  } = useBulkActions();
  
  const {
    handleDeleteUser
  } = useIndividualUserActions();
  
  // View user details handler
  const handleViewUserDetails = useCallback((user: User) => {
    console.log("useUserActions: View details called for user:", user.id);
    setSelectedUser(user);
    setIsDetailsOpen(true);
  }, []);
  
  // Close user details handler
  const handleCloseUserDetails = useCallback(() => {
    console.log("useUserActions: Close details called");
    setIsDetailsOpen(false);
    setTimeout(() => {
      setSelectedUser(null);
    }, 300);
  }, []);
  
  // Manage user permissions handler
  const handleManagePermissions = useCallback((user: User) => {
    console.log("useUserActions: Manage permissions called for user:", user.id);
    setSelectedUser(user);
    setIsPermissionsDialogOpen(true);
  }, []);
  
  // Handle permissions updated
  const handlePermissionsUpdated = useCallback((updatedUser: User, users: User[] = [], setUsers: ((users: User[]) => void) | null = null) => {
    console.log('Permissions updated for user:', updatedUser.id);
    
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
