
import { useCallback } from 'react';
import { User } from '../../../types';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { SubscriptionPlan } from '@/lib/plan_rules';

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

  // Toggle user subscription status with days
  const handleToggleUserSubscription = useCallback(async (
    userId: string, 
    days: number = 30, 
    users: User[],
    setUsers: (users: User[]) => void
  ) => {
    if (!userId) return;
    
    if (setActionLoading) setActionLoading(true);
    
    try {
      console.log(`Toggling user subscription: ${userId} for ${days} days`);
      
      // Get current user
      const user = users.find(u => u.id === userId);
      if (!user) throw new Error('User not found');
      
      // Calculate end date - either extend current or create new
      const currentDate = new Date();
      let endDate = new Date();
      
      if (user.subscription_end_date) {
        endDate = new Date(user.subscription_end_date);
        if (endDate < currentDate) {
          endDate = new Date();
        }
      }
      
      // Add specified days
      endDate.setDate(endDate.getDate() + days);
      
      // Update subscription status in the database
      const { data, error } = await supabase
        .from('profiles')
        .update({ 
          subscription_plan: 'premium', 
          subscription_end_date: endDate.toISOString() 
        })
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
            ? { 
                ...user, 
                subscription_status: 'active',
                subscription_tier: 'premium',
                subscription_end_date: endDate.toISOString() 
              } 
            : user
        )
      );
      
      toast({
        title: 'Subscription Updated',
        description: `User's subscription has been extended by ${days} days.`,
      });
      
      return data;
    } catch (error) {
      console.error('Error updating subscription:', error);
      toast({
        title: 'Error',
        description: 'Failed to update subscription. Please try again.',
        variant: 'destructive',
      });
    } finally {
      if (setActionLoading) setActionLoading(false);
    }
  }, [toast]);

  // Update user subscription with custom plan and end date
  const handleUpdateUserSubscription = useCallback(async (
    userId: string,
    planType: SubscriptionPlan,
    endDate: Date,
    users: User[],
    setUsers: (users: User[]) => void
  ) => {
    if (!userId) return null;
    
    if (setActionLoading) setActionLoading(true);
    
    try {
      console.log(`Updating user subscription: ${userId} to plan ${planType} until ${endDate.toISOString()}`);
      
      // Update subscription status in the database
      const { data, error } = await supabase
        .from('profiles')
        .update({ 
          subscription_plan: planType,
          subscription_tier: planType,
          subscription_end_date: endDate.toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select();
      
      if (error) {
        console.error("Database error:", error);
        throw error;
      }
      
      if (!data || data.length === 0) {
        console.error("No data returned from update");
        throw new Error("Failed to update subscription - no data returned");
      }
      
      // Update local state
      setUsers(
        users.map(user => 
          user.id === userId 
            ? { 
                ...user, 
                subscription_plan: planType,
                subscription_tier: planType,
                subscription_end_date: endDate.toISOString() 
              } 
            : user
        )
      );
      
      return data[0];
    } catch (error) {
      console.error('Error updating subscription:', error);
      throw error; // Let the component handle the error
    } finally {
      if (setActionLoading) setActionLoading(false);
    }
  }, []);

  return {
    handleToggleUserStatus,
    handleToggleUserSubscription,
    handleUpdateUserSubscription
  };
};
