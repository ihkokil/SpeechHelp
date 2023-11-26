
import { useCallback } from 'react';
import { User } from '../../../types';
import { useToast } from '@/hooks/use-toast';

export const useUserCrud = (
  setActionLoading?: (loading: boolean) => void,
  setSelectedUsers?: (users: User[]) => void
) => {
  const { toast } = useToast();

  // Delete multiple users
  const handleDeleteUsers = useCallback(async (
    selectedUsers: User[], 
    users: User[], 
    setUsers: (users: User[]) => void
  ) => {
    if (setActionLoading) setActionLoading(true);
    
    try {
      console.log('Deleting users:', selectedUsers.map(user => user.id));
      
      // Simulate API call - In a real app, this would be an actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Remove deleted users from state
      setUsers(users.filter(user => !selectedUsers.some(selectedUser => selectedUser.id === user.id)));
      
      // Clear selected users
      if (setSelectedUsers) setSelectedUsers([]);
      
      toast({
        title: 'Users Deleted',
        description: `${selectedUsers.length} user(s) have been deleted.`,
      });
      
    } catch (error) {
      console.error('Error deleting users:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete users.',
        variant: 'destructive',
      });
    } finally {
      if (setActionLoading) setActionLoading(false);
    }
  }, [toast, setActionLoading, setSelectedUsers]);

  // Bulk delete multiple users
  const handleBulkDelete = useCallback(async (
    selectedUsers: User[], 
    users: User[], 
    setUsers: (users: User[]) => void
  ) => {
    await handleDeleteUsers(selectedUsers, users, setUsers);
  }, [handleDeleteUsers]);

  // Bulk activate multiple users
  const handleBulkActivate = useCallback(async (
    selectedUsers: User[], 
    users: User[], 
    setUsers: (users: User[]) => void
  ) => {
    if (setActionLoading) setActionLoading(true);
    
    try {
      console.log('Activating users:', selectedUsers.map(user => user.id));
      
      // Simulate API call - In a real app, this would be an actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update user status in state
      setUsers(
        users.map(user => 
          selectedUsers.some(selectedUser => selectedUser.id === user.id)
            ? { ...user, is_active: true }
            : user
        )
      );
      
      toast({
        title: 'Users Activated',
        description: `${selectedUsers.length} user(s) have been activated.`,
      });
      
    } catch (error) {
      console.error('Error activating users:', error);
      toast({
        title: 'Error',
        description: 'Failed to activate users.',
        variant: 'destructive',
      });
    } finally {
      if (setActionLoading) setActionLoading(false);
    }
  }, [toast, setActionLoading]);

  // Bulk deactivate multiple users
  const handleBulkDeactivate = useCallback(async (
    selectedUsers: User[], 
    users: User[], 
    setUsers: (users: User[]) => void
  ) => {
    if (setActionLoading) setActionLoading(true);
    
    try {
      console.log('Deactivating users:', selectedUsers.map(user => user.id));
      
      // Simulate API call - In a real app, this would be an actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update user status in state
      setUsers(
        users.map(user => 
          selectedUsers.some(selectedUser => selectedUser.id === user.id)
            ? { ...user, is_active: false }
            : user
        )
      );
      
      toast({
        title: 'Users Deactivated',
        description: `${selectedUsers.length} user(s) have been deactivated.`,
      });
      
    } catch (error) {
      console.error('Error deactivating users:', error);
      toast({
        title: 'Error',
        description: 'Failed to deactivate users.',
        variant: 'destructive',
      });
    } finally {
      if (setActionLoading) setActionLoading(false);
    }
  }, [toast, setActionLoading]);

  return {
    handleDeleteUsers,
    handleBulkDelete,
    handleBulkActivate,
    handleBulkDeactivate,
  };
};
