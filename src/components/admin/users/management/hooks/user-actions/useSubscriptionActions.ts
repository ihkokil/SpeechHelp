
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

  // Extend user subscription by specified number of days
  const handleToggleUserSubscription = useCallback(async (
    userId: string, 
    days: number = 30, 
    users: User[],
    setUsers: (users: User[]) => void
  ) => {
    if (!userId) return null;
    
    if (setActionLoading) setActionLoading(true);
    
    try {
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
          subscription_plan: SubscriptionPlan.PREMIUM, 
          subscription_tier: SubscriptionPlan.PREMIUM,
          subscription_status: 'active',
          subscription_end_date: endDate.toISOString(),
          updated_at: new Date().toISOString()
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
                subscription_plan: SubscriptionPlan.PREMIUM,
                subscription_tier: SubscriptionPlan.PREMIUM,
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
    if (!userId) return null;
    
    if (setActionLoading) setActionLoading(true);
    
    try {
      console.log('Updating subscription with:', { userId, planType, endDate });
      
      // Validate inputs
      if (!endDate || isNaN(endDate.getTime())) {
        throw new Error('Please select a valid end date');
      }

      // Ensure the end date is in the future (only the date part matters)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (endDate < today) {
        throw new Error('End date must be in the future');
      }
      
      // Format end date to ISO string to avoid timezone issues
      const formattedEndDate = endDate.toISOString();
      
      // Create update payload
      const updatePayload = {
        subscription_plan: planType,
        subscription_tier: planType,
        subscription_status: planType === SubscriptionPlan.FREE_TRIAL ? 'trial' : 'active',
        subscription_end_date: formattedEndDate,
        subscription_start_date: new Date().toISOString(),
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
        console.error('Supabase error:', error);
        throw error;
      }
      
      if (!data || data.length === 0) {
        throw new Error('No data returned after update');
      }
      
      console.log('Update successful, data:', data);
      
      // Update local state
      setUsers(
        users.map(user => 
          user.id === userId 
            ? { 
                ...user, 
                subscription_plan: planType,
                subscription_tier: planType,
                subscription_status: planType === SubscriptionPlan.FREE_TRIAL ? 'trial' : 'active',
                subscription_end_date: formattedEndDate
              } 
            : user
        )
      );
      
      toast({
        title: 'Subscription Updated',
        description: `User's subscription has been updated to ${planType} ending on ${endDate.toLocaleDateString()}.`,
      });
      
      return data[0];
    } catch (error) {
      console.error('Error updating subscription:', error);
      
      let errorMessage = 'Failed to update subscription. Please try again.';
      if (error instanceof Error) {
        errorMessage = error.message;
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

  // Set a specific user to PRO plan for testing purposes
  const setUserToPro = useCallback(async (
    email: string,
    users: User[],
    setUsers: (users: User[]) => void
  ) => {
    if (setActionLoading) setActionLoading(true);
    
    try {
      // Find user by email
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single();
      
      if (userError) {
        throw new Error(`User not found: ${email}`);
      }
      
      const userId = userData.id;
      
      // Set end date to 1 year from now
      const endDate = new Date();
      endDate.setFullYear(endDate.getFullYear() + 1);
      
      // Update subscription in the database
      const { data, error } = await supabase
        .from('profiles')
        .update({
          subscription_plan: SubscriptionPlan.PRO,
          subscription_tier: SubscriptionPlan.PRO,
          subscription_status: 'active',
          subscription_end_date: endDate.toISOString(),
          subscription_start_date: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select();
      
      if (error) {
        throw error;
      }
      
      if (!data || data.length === 0) {
        throw new Error('No data returned after update');
      }
      
      // Create a new array to avoid type recursion issues
      const updatedUsers = users.map(user => 
        user.id === userId 
          ? { 
              ...user, 
              subscription_plan: SubscriptionPlan.PRO,
              subscription_tier: SubscriptionPlan.PRO,
              subscription_status: 'active',
              subscription_end_date: endDate.toISOString()
            } 
          : user
      );
      
      // Update local state with the new array
      setUsers(updatedUsers);
      
      toast({
        title: 'User Set to Pro Plan',
        description: `User ${email} has been upgraded to the PRO plan for one year.`,
      });
      
      return data[0];
    } catch (error) {
      console.error('Error setting user to Pro:', error);
      
      let errorMessage = 'Failed to set user to Pro plan. Please try again.';
      if (error instanceof Error) {
        errorMessage = error.message;
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
    handleUpdateUserSubscription,
    setUserToPro
  };
};
