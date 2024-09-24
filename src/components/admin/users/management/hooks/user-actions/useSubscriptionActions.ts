
import { useCallback, useState } from 'react';
import { User } from '../../../types';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useSubscriptionActions = () => {
  const { toast } = useToast();
  const [isActionLoading, setIsActionLoading] = useState(false);

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
      
      // Get current user data to preserve metadata
      const { data: userData, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (fetchError) {
        console.error('Error fetching user data:', fetchError);
      }
      
      const currentMetadata = userData?.user_metadata || {};
      const displayName = currentMetadata.name || currentMetadata.full_name || '';
      const phoneNumber = currentMetadata.phone || '';
      
      // Update the user's active status in the database
      const { data, error } = await supabase.rpc('admin_update_user_profile', {
        user_id_param: userId,
        display_name: displayName,  
        user_email: '', // Not changing email
        phone_number: phoneNumber,
        is_active_status: !isActive
      });
      
      if (error) {
        throw error;
      }
      
      console.log('Toggle user status response:', data);
      
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

      // Refresh the page to ensure data consistency
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
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

  // Update user subscription
  const handleUpdateSubscription = useCallback(async (
    userId: string, 
    subscriptionTier: string, 
    subscriptionEndDate: Date,
    users: User[] = [], 
    setUsers: ((users: User[]) => void) | null = null
  ) => {
    if (!userId) return;
    
    setIsActionLoading(true);
    
    try {
      console.log(`Updating subscription for user ${userId}: tier=${subscriptionTier}, end date=${subscriptionEndDate.toISOString()}`);
      
      // Call the RPC function to update subscription details
      const { data, error } = await supabase.rpc('update_user_subscription', {
        user_id: userId,
        plan: subscriptionTier,
        end_date: subscriptionEndDate.toISOString()
      });
      
      if (error) {
        throw error;
      }
      
      console.log('Subscription update response:', data);
      
      // Update local state if setUsers is provided
      if (setUsers && users.length > 0) {
        setUsers(
          users.map(user => 
            user.id === userId 
              ? { 
                  ...user, 
                  subscription_status: 'active',
                  subscription_plan: subscriptionTier,
                  subscription_end_date: subscriptionEndDate.toISOString() 
                } 
              : user
          )
        );
      }
      
      toast({
        title: 'Subscription Updated',
        description: `User's subscription has been updated to ${subscriptionTier} plan.`,
      });
      
      // Refresh the page to ensure data consistency
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
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
    handleToggleUserStatus,
    handleUpdateSubscription
  };
};
