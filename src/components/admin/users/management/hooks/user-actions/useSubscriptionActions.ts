
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
          subscription_tier: 'premium',
          subscription_status: 'active',
          subscription_end_date: endDate.toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating subscription:', error);
        throw error;
      }
      
      // Update local state
      setUsers(
        users.map(user => 
          user.id === userId 
            ? { 
                ...user, 
                subscription_status: 'active',
                subscription_plan: 'premium',
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
      return null;
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
    if (!userId) {
      console.error('No userId provided to handleUpdateUserSubscription');
      return null;
    }
    
    if (setActionLoading) setActionLoading(true);
    
    try {
      // Validate inputs to avoid errors
      if (!Object.values(SubscriptionPlan).includes(planType)) {
        console.error(`Invalid plan type: ${planType}`);
        throw new Error(`Invalid plan type: ${planType}`);
      }

      if (!endDate || isNaN(endDate.getTime())) {
        console.error('Invalid end date provided:', endDate);
        throw new Error('Please select a valid end date');
      }

      // Make sure the date is in the future
      const now = new Date();
      if (endDate <= now) {
        console.error('End date must be in the future:', endDate);
        throw new Error('End date must be in the future');
      }
      
      console.log(`Updating user subscription: ${userId} to plan ${planType} until ${endDate.toISOString()}`);
      
      // Format the end date correctly to avoid timezone issues
      const formattedEndDate = endDate.toISOString();
      console.log(`Formatted end date: ${formattedEndDate}`);
      
      // Create update payload with all required fields
      const updatePayload = {
        subscription_plan: planType,
        subscription_tier: planType,
        subscription_status: 'active',
        subscription_end_date: formattedEndDate,
        updated_at: new Date().toISOString()
      };
      
      console.log('Update payload:', updatePayload);
      
      // Update subscription in the database
      const { data, error } = await supabase
        .from('profiles')
        .update(updatePayload)
        .eq('id', userId)
        .select();
      
      if (error) {
        console.error('Database error updating subscription:', error);
        throw error;
      }
      
      if (!data || data.length === 0) {
        console.error('No data returned after update');
        throw new Error('No data returned after update');
      }
      
      console.log('Update successful, returned data:', data);
      
      // Update local state with all updated fields
      setUsers(
        users.map(user => 
          user.id === userId 
            ? { 
                ...user, 
                subscription_plan: planType,
                subscription_tier: planType,
                subscription_status: 'active',
                subscription_end_date: formattedEndDate
              } 
            : user
        )
      );
      
      toast({
        title: 'Subscription Updated',
        description: `User's subscription has been updated to ${planType} ending on ${endDate.toLocaleDateString()}.`,
        // Fix: Remove 'success' variant as it's not supported
        // variant: 'success', 
      });
      
      return data[0];
    } catch (error) {
      console.error('Error updating subscription:', error);
      
      // More specific error message based on the error
      let errorMessage = 'Failed to update subscription. Please try again.';
      if (error instanceof Error) {
        errorMessage = `Error: ${error.message}`;
      }
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      return null;
    } finally {
      if (setActionLoading) setActionLoading(false);
    }
  }, [toast]);

  return {
    handleToggleUserStatus,
    handleToggleUserSubscription,
    handleUpdateUserSubscription
  };
};
