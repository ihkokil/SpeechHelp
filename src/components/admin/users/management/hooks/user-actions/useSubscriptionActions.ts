
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
      
      // Since we can't directly access user_metadata from profiles table,
      // we'll use any name data from our users array if available
      let displayName = '';
      let phoneNumber = '';
      
      // Check if we have this user in our local state
      const currentUser = users.find(user => user.id === userId);
      if (currentUser) {
        // Get display name and phone from the user object
        displayName = currentUser.user_metadata?.name || 
                      currentUser.user_metadata?.full_name || 
                      currentUser.email.split('@')[0] || '';
        phoneNumber = currentUser.user_metadata?.phone || '';
      } else {
        // If user not in local state, get profile data from auth users via function
        try {
          const { data: userData, error: funcError } = await supabase.functions.invoke('fetch-users', {
            method: 'GET'
          });
          
          if (!funcError && userData?.users) {
            const authUser = userData.users.find((u: any) => u.id === userId);
            if (authUser) {
              displayName = authUser.profile?.username || 
                           authUser.user_metadata?.name || 
                           authUser.user_metadata?.full_name || 
                           authUser.email?.split('@')[0] || '';
              phoneNumber = authUser.profile?.phone || authUser.user_metadata?.phone || '';
            }
          }
        } catch (funcError) {
          console.error('Error fetching user data from function:', funcError);
        }
      }
      
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

      // REMOVED: No more page refresh - using AJAX updates only
      
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
      
      // REMOVED: No more page refresh - using AJAX updates only
      
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
