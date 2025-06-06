
import { useCallback, useState } from 'react';
import { User } from '../../../types';
import { useToast } from '@/hooks/use-toast';
import { useIndividualUserActions } from './useIndividualUserActions';

export const useBulkActions = () => {
  const { toast } = useToast();
  const [isActionLoading, setIsActionLoading] = useState(false);
  const { handleDeleteUser } = useIndividualUserActions();

  // Bulk delete multiple users
  const handleBulkDelete = useCallback(async (
    selectedUsers: User[], 
    users: User[], 
    setUsers: (users: User[]) => void
  ) => {
    if (!selectedUsers.length) return;
    
    setIsActionLoading(true);
    
    try {
      console.log('Bulk deleting users:', selectedUsers.map(user => user.id));
      
      let deletedCount = 0;
      const errors = [];
      
      // Delete each user individually using the working individual delete function
      for (const user of selectedUsers) {
        try {
          await handleDeleteUser(user.id, users, setUsers);
          deletedCount++;
        } catch (error) {
          console.error(`Failed to delete user ${user.id}:`, error);
          errors.push(`${user.username || user.id}: ${error.message}`);
        }
      }
      
      if (deletedCount > 0) {
        toast({
          title: 'Users Deleted',
          description: `${deletedCount} user(s) have been deleted successfully.`,
        });
      }
      
      if (errors.length > 0) {
        toast({
          title: 'Partial Success',
          description: `${errors.length} user(s) could not be deleted. Check console for details.`,
          variant: 'destructive',
        });
      }
      
    } catch (error) {
      console.error('Error during bulk deletion:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete users.',
        variant: 'destructive',
      });
      throw error; // Re-throw to allow parent component to handle
    } finally {
      setIsActionLoading(false);
    }
  }, [toast, handleDeleteUser]);

  // Bulk activate multiple users
  const handleBulkActivate = useCallback(async (
    selectedUsers: User[], 
    users: User[], 
    setUsers: (users: User[]) => void
  ) => {
    if (!selectedUsers.length) return;
    
    setIsActionLoading(true);
    
    try {
      console.log('Bulk activating users:', selectedUsers.map(user => user.id));
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update users status in state
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
      setIsActionLoading(false);
    }
  }, [toast]);

  // Bulk deactivate multiple users
  const handleBulkDeactivate = useCallback(async (
    selectedUsers: User[], 
    users: User[], 
    setUsers: (users: User[]) => void
  ) => {
    if (!selectedUsers.length) return;
    
    setIsActionLoading(true);
    
    try {
      console.log('Bulk deactivating users:', selectedUsers.map(user => user.id));
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update users status in state
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
      setIsActionLoading(false);
    }
  }, [toast]);

  return {
    isActionLoading,
    handleBulkDelete,
    handleBulkActivate,
    handleBulkDeactivate
  };
};
