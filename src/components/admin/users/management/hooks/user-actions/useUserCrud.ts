
import { useCallback } from 'react';
import { User } from '../../../types';
import { useToast } from '@/hooks/use-toast';

export const useUserCrud = (
  setIsActionLoading: (isLoading: boolean) => void,
  setIsDeleteDialogOpen: (isOpen: boolean) => void
) => {
  const { toast } = useToast();

  const handleDeleteUsers = useCallback(async (selectedUsers: string[], users: User[], setUsers: (users: User[]) => void) => {
    console.log('Deleting users:', selectedUsers);
    if (selectedUsers.length === 0) {
      toast({
        title: 'No users selected',
        description: 'Please select at least one user to delete.',
        variant: 'destructive',
      });
      return false;
    }

    setIsActionLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUsers(users.filter(user => !selectedUsers.includes(user.id)));
      
      toast({
        title: 'Success',
        description: `${selectedUsers.length} users have been deleted.`,
      });

      setIsDeleteDialogOpen(false);
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
    }
  }, [toast, setIsActionLoading, setIsDeleteDialogOpen]);

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
  }, [toast, setIsActionLoading]);

  return {
    handleDeleteUsers,
    handleToggleUserStatus
  };
};
