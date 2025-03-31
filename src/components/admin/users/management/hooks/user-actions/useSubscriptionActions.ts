
import { useCallback } from 'react';
import { User } from '../../../types';
import { useToast } from '@/hooks/use-toast';

export const useSubscriptionActions = (
  setActionLoading?: (loading: boolean) => void
) => {
  const { toast } = useToast();

  // Toggle user active status
  const handleToggleUserStatus = useCallback(async (
    userId: string, 
    isActive: boolean,
    users: User[],
    setUsers: (users: User[]) => void
  ) => {
    if (setActionLoading) setActionLoading(true);
    
    try {
      console.log(`${isActive ? 'Activating' : 'Deactivating'} user:`, userId);
      
      // Simulate API call - In a real app, this would be an actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update user status in state
      setUsers(
        users.map(user => 
          user.id === userId
            ? { ...user, is_active: isActive }
            : user
        )
      );
      
      toast({
        title: isActive ? 'User Activated' : 'User Deactivated',
        description: `User has been ${isActive ? 'activated' : 'deactivated'}.`,
      });
      
      return true;
    } catch (error) {
      console.error(`Error ${isActive ? 'activating' : 'deactivating'} user:`, error);
      toast({
        title: 'Error',
        description: `Failed to ${isActive ? 'activate' : 'deactivate'} user.`,
        variant: 'destructive',
      });
      return false;
    } finally {
      if (setActionLoading) setActionLoading(false);
    }
  }, [toast, setActionLoading]);

  // Toggle user subscription
  const handleToggleUserSubscription = useCallback(async (
    userId: string, 
    days: number = 30,
    users: User[],
    setUsers: (users: User[]) => void
  ) => {
    if (setActionLoading) setActionLoading(true);
    
    try {
      console.log('Toggling subscription for user:', userId, 'for', days, 'days');
      
      // Simulate API call - In a real app, this would be an actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get the current user
      const user = users.find(user => user.id === userId);
      
      // If no subscription or expired, add days from now
      // If active, toggle off
      const now = new Date();
      let newSubscriptionDate = null;
      
      if (user?.subscription_end) {
        const currentEnd = new Date(user.subscription_end);
        // If subscription is active, toggle off
        if (currentEnd > now) {
          newSubscriptionDate = null;
        } else {
          // If expired, add days from now
          newSubscriptionDate = new Date(now);
          newSubscriptionDate.setDate(newSubscriptionDate.getDate() + days);
        }
      } else {
        // No subscription yet, add days from now
        newSubscriptionDate = new Date(now);
        newSubscriptionDate.setDate(newSubscriptionDate.getDate() + days);
      }
      
      // Update user subscription in state
      setUsers(
        users.map(user => 
          user.id === userId
            ? { 
                ...user, 
                subscription_end: newSubscriptionDate ? newSubscriptionDate.toISOString() : null,
                plan: newSubscriptionDate ? 'premium' : 'free'
              }
            : user
        )
      );
      
      toast({
        title: newSubscriptionDate ? 'Subscription Activated' : 'Subscription Deactivated',
        description: newSubscriptionDate 
          ? `User subscription has been activated until ${newSubscriptionDate.toLocaleDateString()}.`
          : 'User subscription has been deactivated.',
      });
      
      return true;
    } catch (error) {
      console.error('Error toggling user subscription:', error);
      toast({
        title: 'Error',
        description: 'Failed to toggle user subscription.',
        variant: 'destructive',
      });
      return false;
    } finally {
      if (setActionLoading) setActionLoading(false);
    }
  }, [toast, setActionLoading]);

  return {
    handleToggleUserStatus,
    handleToggleUserSubscription,
  };
};
