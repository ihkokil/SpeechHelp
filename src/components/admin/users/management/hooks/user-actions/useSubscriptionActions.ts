
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

  // Update user subscription
  const handleUpdateSubscription = useCallback(async (
    userId: string,
    subscriptionPlan: string,
    subscriptionEndDate: Date,
    users: User[],
    setUsers: (users: User[]) => void
  ) => {
    if (!userId) return;
    
    if (setActionLoading) setActionLoading(true);
    
    try {
      console.log(`Updating user subscription: ${userId} to ${subscriptionPlan} until ${subscriptionEndDate}`);
      
      // First check if the profile exists
      const { data: profileData, error: profileCheckError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId);
      
      if (profileCheckError) {
        throw profileCheckError;
      }
      
      // If profile doesn't exist, create it first
      if (!profileData || profileData.length === 0) {
        // Create profile
        const { error: createError } = await supabase
          .from('profiles')
          .insert({ 
            id: userId,
            subscription_plan: subscriptionPlan,
            subscription_end_date: subscriptionEndDate.toISOString()
          });
          
        if (createError) {
          throw createError;
        }
      } else {
        // Update existing profile
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ 
            subscription_plan: subscriptionPlan,
            subscription_end_date: subscriptionEndDate.toISOString()
          })
          .eq('id', userId);
        
        if (updateError) {
          throw updateError;
        }
      }
      
      // Fetch the updated profile to return
      const { data: updatedProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (fetchError) {
        throw fetchError;
      }
      
      // Update local state
      setUsers(
        users.map(user => 
          user.id === userId 
            ? { 
                ...user, 
                subscription_plan: subscriptionPlan,
                subscription_end_date: subscriptionEndDate.toISOString()
              } 
            : user
        )
      );
      
      toast({
        title: 'Subscription Updated',
        description: `User's subscription has been updated to ${subscriptionPlan}.`,
      });
      
      return updatedProfile;
    } catch (error) {
      console.error('Error updating user subscription:', error);
      toast({
        title: 'Error',
        description: 'Failed to update user subscription. Please try again.',
        variant: 'destructive',
      });
    } finally {
      if (setActionLoading) setActionLoading(false);
    }
  }, [toast]);

  return {
    handleToggleUserStatus,
    handleUpdateSubscription
  };
};
