
import { useCallback } from 'react';
import { User } from '../../../types';
import { useToast } from '@/hooks/use-toast';

interface UseSubscriptionActionsParams {
  setIsActionLoading: (isLoading: boolean) => void;
}

export const useSubscriptionActions = ({
  setIsActionLoading
}: UseSubscriptionActionsParams) => {
  const { toast } = useToast();

  const handleToggleUserStatus = useCallback(async (
    userId: string,
    isActive: boolean,
    users: User[] = [],
    setUsers: ((users: User[]) => void) | null = null
  ) => {
    console.log(`Toggling user ${userId} status to: ${!isActive}`);
    setIsActionLoading(true);
    try {
      // Simulate API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state if provided
      if (setUsers && users.length > 0) {
        setUsers(
          users.map(user => 
            user.id === userId 
              ? { ...user, is_active: !isActive } 
              : user
          )
        );
      }
      
      toast({
        title: 'Success',
        description: `User ${isActive ? 'deactivated' : 'activated'} successfully`,
      });
    } catch (error) {
      console.error('Error toggling user status:', error);
      toast({
        title: 'Error',
        description: `Failed to ${isActive ? 'deactivate' : 'activate'} user`,
        variant: 'destructive',
      });
    } finally {
      setIsActionLoading(false);
    }
  }, [setIsActionLoading, toast]);

  const handleToggleUserSubscription = useCallback(async (
    userId: string, 
    extendDays = 30,
    users: User[] = [],
    setUsers: ((users: User[]) => void) | null = null
  ) => {
    console.log(`Extending user ${userId} subscription by ${extendDays} days`);
    setIsActionLoading(true);
    try {
      // Simulate API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state if provided
      if (setUsers && users.length > 0) {
        setUsers(
          users.map(user => 
            user.id === userId 
              ? { 
                  ...user, 
                  subscription_status: 'active',
                  subscription_end_date: new Date(
                    Date.now() + extendDays * 24 * 60 * 60 * 1000
                  ).toISOString()
                } 
              : user
          )
        );
      }
      
      toast({
        title: 'Success',
        description: `User subscription extended by ${extendDays} days`,
      });
    } catch (error) {
      console.error('Error extending user subscription:', error);
      toast({
        title: 'Error',
        description: 'Failed to extend user subscription',
        variant: 'destructive',
      });
    } finally {
      setIsActionLoading(false);
    }
  }, [setIsActionLoading, toast]);

  return {
    handleToggleUserStatus,
    handleToggleUserSubscription
  };
};
