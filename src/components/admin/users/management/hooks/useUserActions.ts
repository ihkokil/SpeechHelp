
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
    handleBulkDelete: baseBulkDelete,
    handleBulkActivate: baseBulkActivate,
    handleBulkDeactivate: baseBulkDeactivate
  } = useBulkActions();
  
  const {
    handleToggleUserStatus: baseToggleUserStatus,
    handleDeleteUser: baseDeleteUser
  } = useIndividualUserActions();
  
  // Wrapper functions that match expected signatures
  const handleBulkDelete = useCallback(async () => {
    // This will be called from UserManagement with proper parameters
  }, []);

  const handleBulkActivate = useCallback(async () => {
    // This will be called from UserManagement with proper parameters
  }, []);

  const handleBulkDeactivate = useCallback(async () => {
    // This will be called from UserManagement with proper parameters
  }, []);

  const handleDeleteUser = useCallback(async (userId: string) => {
    setIsActionLoading(true);
    try {
      await baseDeleteUser(userId, [], null);
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete user. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsActionLoading(false);
    }
  }, [baseDeleteUser, toast]);

  const handleToggleUserStatus = useCallback(async (userId: string, isActive: boolean) => {
    setIsActionLoading(true);
    try {
      await baseToggleUserStatus(userId, isActive, [], null);
    } catch (error) {
      console.error('Error toggling user status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update user status. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsActionLoading(false);
    }
  }, [baseToggleUserStatus, toast]);
  
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
  const handleDeleteUsers = useCallback(async () => {
    // This will be called from UserManagement with proper parameters
  }, []);
  
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
    
    // User details operations
    handleViewUserDetails,
    handleCloseUserDetails,
    handleManagePermissions,
    
    // Permission operations
    handlePermissionsUpdated,
    
    // States
    isActionLoading,
    selectedUser,
    setSelectedUser,
    isDetailsOpen,
    isPermissionsDialogOpen,
    setIsPermissionsDialogOpen
  };
};
