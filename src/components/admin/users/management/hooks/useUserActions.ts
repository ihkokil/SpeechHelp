
import { useState, useCallback } from 'react';
import { User } from '../../types';
import { useToast } from '@/hooks/use-toast';

export const useUserActions = () => {
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isPermissionsDialogOpen, setIsPermissionsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleDeleteUsers = useCallback(async (selectedUsers: string[], users: User[], setUsers: (users: User[]) => void) => {
    console.log('Deleting users:', selectedUsers);
    setIsActionLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUsers(users.filter(user => !selectedUsers.includes(user.id)));
      
      toast({
        title: 'Success',
        description: `${selectedUsers.length} users have been deleted.`,
      });

      return true;
    } catch (error) {
      console.error('Error deleting users:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete users.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsActionLoading(false);
      setIsDeleteDialogOpen(false);
    }
  }, [toast]);

  const handleToggleUserStatus = useCallback(async (userId: string, isActive: boolean, users: User[], setUsers: (users: User[]) => void) => {
    console.log('Toggling user status:', userId, isActive);
    setIsActionLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setUsers(
        users.map(user => 
          user.id === userId ? { ...user, is_active: isActive } : user
        )
      );
      
      toast({
        title: 'Success',
        description: `User status updated to ${isActive ? 'active' : 'inactive'}.`,
      });
      return true;
    } catch (error) {
      console.error('Error updating user status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update user status.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsActionLoading(false);
    }
  }, [toast]);

  const handleViewUserDetails = useCallback((user: User) => {
    console.log('UserManagement: Opening details for user:', user.id);
    
    // Set the selected user first
    setSelectedUser(user);
    
    // Then open the drawer
    setIsDetailsOpen(true);
    
    console.log('UserManagement: Details drawer should now be open');
  }, []);

  const handleCloseUserDetails = useCallback(() => {
    console.log('UserManagement: Closing user details drawer');
    
    // Close the drawer first
    setIsDetailsOpen(false);
    
    // Clear the selected user
    setSelectedUser(null);
    
    console.log('UserManagement: Selected user cleared');
  }, []);

  const handleToggleUserSubscription = useCallback(async (userId: string, extensionDays: number = 30, users: User[], setUsers: (users: User[]) => void) => {
    console.log('Extending subscription for user:', userId, 'by', extensionDays, 'days');
    setIsActionLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setUsers(
        users.map(user => {
          if (user.id === userId) {
            const currentEndDate = user.subscription_end_date 
              ? new Date(user.subscription_end_date) 
              : new Date();
            
            currentEndDate.setDate(currentEndDate.getDate() + extensionDays);
            
            return { 
              ...user, 
              subscription_status: 'active',
              subscription_end_date: currentEndDate.toISOString() 
            };
          }
          return user;
        })
      );
      
      toast({
        title: 'Success',
        description: `User subscription extended by ${extensionDays} days.`,
      });
      return true;
    } catch (error) {
      console.error('Error updating subscription:', error);
      toast({
        title: 'Error',
        description: 'Failed to update user subscription.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsActionLoading(false);
    }
  }, [toast]);

  const handleManagePermissions = useCallback((user: User) => {
    console.log('UserManagement: Opening permissions dialog for user:', user.id);
    
    // Set the selected user
    setSelectedUser(user);
    
    // Open the permissions dialog
    setIsPermissionsDialogOpen(true);
    
    console.log('UserManagement: Permissions dialog should now be open');
  }, []);

  const handlePermissionsUpdated = useCallback((updatedUser: User, users: User[], setUsers: (users: User[]) => void) => {
    console.log('Permissions updated for user:', updatedUser.id);
    setUsers(
      users.map(user => 
        user.id === updatedUser.id ? updatedUser : user
      )
    );
    
    toast({
      title: 'Permissions Updated',
      description: `${updatedUser.email}'s admin permissions have been updated.`,
    });
    
    // Close the dialog
    setIsPermissionsDialogOpen(false);
  }, [toast]);

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
    handlePermissionsUpdated
  };
};
