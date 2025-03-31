
import { useCallback } from 'react';
import { User } from '../../../types';
import { useToast } from '@/hooks/use-toast';

export const useSubscriptionActions = (
  setIsActionLoading: (isLoading: boolean) => void
) => {
  const { toast } = useToast();

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
  }, [toast, setIsActionLoading]);

  return {
    handleToggleUserSubscription
  };
};
