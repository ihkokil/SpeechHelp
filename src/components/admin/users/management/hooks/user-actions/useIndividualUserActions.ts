
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User } from '../../../types';
import { useSubscriptionActions } from './useSubscriptionActions';

export const useIndividualUserActions = () => {
  const { toast } = useToast();
  const { handleToggleUserSubscription, handleUpdateUserSubscription } = useSubscriptionActions();
  
  // Toggle user active status
  const handleToggleUserStatus = useCallback(async (
    userId: string, 
    isActive: boolean,
    users: User[], 
    setUsers: (users: User[]) => void
  ) => {
    if (!userId) return;
    
    try {
      console.log(`useIndividualUserActions: Toggling user status: ${userId} to ${!isActive}`);
      
      // Update the user's active status in the database
      const { data, error } = await supabase
        .from('profiles')
        .update({ is_active: !isActive })
        .eq('id', userId)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      // Update local state
      setUsers(
        users.map(user => 
          user.id === userId 
            ? { ...user, is_active: !isActive } 
            : user
        )
      );
      
      toast({
        title: `User ${!isActive ? 'Activated' : 'Deactivated'}`,
        description: `User has been ${!isActive ? 'activated' : 'deactivated'} successfully.`,
      });
      
      return data;
    } catch (error) {
      console.error('Error toggling user status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update user status. Please try again.',
        variant: 'destructive',
      });
      return null;
    }
  }, [toast]);

  // Delete a user
  const handleDeleteUser = useCallback(async (
    userId: string,
    users: User[],
    setUsers: ((users: User[]) => void) | null = null
  ) => {
    if (!userId) return;
    
    try {
      console.log(`useIndividualUserActions: Deleting user: ${userId}`);
      
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);
      
      if (error) {
        throw error;
      }
      
      // Update local state if setUsers is provided
      if (setUsers && users.length > 0) {
        setUsers(users.filter(user => user.id !== userId));
      }
      
      toast({
        title: 'User Deleted',
        description: 'User has been deleted successfully.',
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete user. Please try again.',
        variant: 'destructive',
      });
      return null;
    }
  }, [toast]);
  
  return {
    handleToggleUserStatus,
    handleToggleUserSubscription,
    handleUpdateUserSubscription,
    handleDeleteUser
  };
};
