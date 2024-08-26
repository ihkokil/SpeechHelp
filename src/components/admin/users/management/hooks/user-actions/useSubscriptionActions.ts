
import { useCallback } from 'react';
import { User } from '../../../types';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useSubscriptionActions = (
  setActionLoading?: (isLoading: boolean) => void
) => {
  const { toast } = useToast();

  // Toggle user active status
  const handleToggleUserStatus = useCallback(async (
    userId: string, 
    isActive: boolean,
    users: User[], 
    setUsers: (users: User[]) => void
  ) => {
    if (!userId) return;
    
    if (setActionLoading) setActionLoading(true);
    
    try {
      console.log(`Toggling user status: ${userId} to ${!isActive}`);
      
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
    } finally {
      if (setActionLoading) setActionLoading(false);
    }
  }, [toast]);

  return {
    handleToggleUserStatus
  };
};
