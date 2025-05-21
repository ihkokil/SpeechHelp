
import { useCallback, useState } from 'react';
import { User } from '../../../types';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useIndividualUserActions = () => {
  const { toast } = useToast();
  const [isActionLoading, setIsActionLoading] = useState(false);

  // Delete a single user
  const handleDeleteUser = useCallback(async (
    userId: string,
    users: User[] = [],
    setUsers: ((users: User[]) => void) | null = null
  ) => {
    if (!userId) return;
    
    setIsActionLoading(true);
    
    try {
      console.log('Deleting user:', userId);
      
      // Simulate API call - In a real app, this would be an actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Remove deleted user from state if setUsers is provided
      if (setUsers && users.length > 0) {
        setUsers(users.filter(user => user.id !== userId));
      }
      
      toast({
        title: 'User Deleted',
        description: 'The user has been deleted successfully.',
      });
      
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete user. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsActionLoading(false);
    }
  }, [toast]);

  // Toggle user active status
  const handleToggleUserStatus = useCallback(async (
    userId: string, 
    isActive: boolean,
    users: User[] = [], 
    setUsers: ((users: User[]) => void) | null = null
  ) => {
    if (!userId) return;
    
    setIsActionLoading(true);
    
    try {
      console.log(`Toggling user status: ${userId} to ${!isActive}`);
      
      // Update the user's active status in the database
      const { error } = await supabase
        .from('profiles')
        .update({ is_active: !isActive })
        .eq('id', userId);
      
      if (error) {
        throw error;
      }
      
      // Update local state if setUsers is provided
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
        title: `User ${!isActive ? 'Activated' : 'Deactivated'}`,
        description: `User has been ${!isActive ? 'activated' : 'deactivated'} successfully.`,
      });
      
    } catch (error) {
      console.error('Error toggling user status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update user status. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsActionLoading(false);
    }
  }, [toast]);

  // Toggle user subscription
  const handleToggleUserSubscription = useCallback(async (
    userId: string, 
    days: number = 30, 
    users: User[] = [],
    setUsers: ((users: User[]) => void) | null = null
  ) => {
    if (!userId) return;
    
    setIsActionLoading(true);
    
    try {
      console.log(`Extending user subscription: ${userId} for ${days} days`);
      
      // Get current user if users is provided
      let user = null;
      if (users.length > 0) {
        user = users.find(u => u.id === userId);
        if (!user) throw new Error('User not found');
      }
      
      // Calculate end date - either extend current or create new
      const currentDate = new Date();
      let endDate = new Date();
      
      if (user && user.subscription_end_date) {
        endDate = new Date(user.subscription_end_date);
        if (endDate < currentDate) {
          endDate = new Date();
        }
      }
      
      // Add specified days
      endDate.setDate(endDate.getDate() + days);
      
      // Update subscription status in the database
      const { error } = await supabase
        .from('profiles')
        .update({ 
          subscription_plan: 'premium', 
          subscription_end_date: endDate.toISOString() 
        })
        .eq('id', userId);
      
      if (error) {
        throw error;
      }
      
      // Update local state if setUsers is provided
      if (setUsers && users.length > 0) {
        setUsers(
          users.map(user => 
            user.id === userId 
              ? { 
                  ...user, 
                  subscription_status: 'active',
                  subscription_plan: 'premium',
                  subscription_end_date: endDate.toISOString() 
                } 
              : user
          )
        );
      }
      
      toast({
        title: 'Subscription Updated',
        description: `User's subscription has been extended by ${days} days.`,
      });
      
    } catch (error) {
      console.error('Error updating subscription:', error);
      toast({
        title: 'Error',
        description: 'Failed to update subscription. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsActionLoading(false);
    }
  }, [toast]);

  return {
    isActionLoading,
    handleDeleteUser,
    handleToggleUserStatus,
    handleToggleUserSubscription
  };
};
