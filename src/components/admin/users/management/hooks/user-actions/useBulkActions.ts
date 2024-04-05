
import { useCallback, useState } from 'react';
import { User } from '../../../types';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useBulkActions = () => {
  const { toast } = useToast();
  const [isActionLoading, setIsActionLoading] = useState(false);

  // Bulk delete multiple users
  const handleBulkDelete = useCallback(async (
    selectedUsers: User[], 
    users: User[] = [], 
    setUsers: ((users: User[]) => void) | null = null
  ) => {
    if (!selectedUsers.length) return;
    
    setIsActionLoading(true);
    
    try {
      const userIds = selectedUsers.map(user => user.id);
      console.log('Bulk deleting users:', userIds);
      
      // Actual API call to Supabase to delete users
      const { error } = await supabase
        .from('profiles')
        .delete()
        .in('id', userIds);
      
      if (error) throw error;
      
      // Remove deleted users from state
      if (setUsers && users.length > 0) {
        setUsers(users.filter(user => !selectedUsers.some(selectedUser => selectedUser.id === user.id)));
      }
      
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
      setIsActionLoading(false);
    }
  }, [toast]);

  // Bulk activate multiple users
  const handleBulkActivate = useCallback(async (
    selectedUsers: User[], 
    users: User[] = [], 
    setUsers: ((users: User[]) => void) | null = null
  ) => {
    if (!selectedUsers.length) return;
    
    setIsActionLoading(true);
    
    try {
      const userIds = selectedUsers.map(user => user.id);
      console.log('Bulk activating users:', userIds);
      
      // Actual API call to Supabase
      const { error } = await supabase
        .from('profiles')
        .update({ is_active: true })
        .in('id', userIds);
      
      if (error) throw error;
      
      // Update users status in state
      if (setUsers && users.length > 0) {
        setUsers(
          users.map(user => 
            selectedUsers.some(selectedUser => selectedUser.id === user.id)
              ? { ...user, is_active: true }
              : user
          )
        );
      }
      
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
    users: User[] = [], 
    setUsers: ((users: User[]) => void) | null = null
  ) => {
    if (!selectedUsers.length) return;
    
    setIsActionLoading(true);
    
    try {
      const userIds = selectedUsers.map(user => user.id);
      console.log('Bulk deactivating users:', userIds);
      
      // Actual API call to Supabase
      const { error } = await supabase
        .from('profiles')
        .update({ is_active: false })
        .in('id', userIds);
      
      if (error) throw error;
      
      // Update users status in state
      if (setUsers && users.length > 0) {
        setUsers(
          users.map(user => 
            selectedUsers.some(selectedUser => selectedUser.id === user.id)
              ? { ...user, is_active: false }
              : user
          )
        );
      }
      
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
