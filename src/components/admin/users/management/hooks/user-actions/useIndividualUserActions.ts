
import { useCallback, useState } from 'react';
import { User } from '../../../types';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

export const useIndividualUserActions = () => {
  const { toast } = useToast();
  const { adminUser } = useAdminAuth();
  const [isActionLoading, setIsActionLoading] = useState(false);

  // Delete a single user
  const handleDeleteUser = useCallback(async (
    userId: string,
    users: User[] = [],
    setUsers: ((users: User[]) => void) | null = null
  ) => {
    if (!userId || !adminUser) return;
    
    setIsActionLoading(true);
    
    try {
      console.log('Starting user deletion process for user:', userId);
      
      // Call the admin-delete-user function which handles all cleanup
      console.log('Calling admin-delete-user function...');
      const { data, error: deleteError } = await supabase.functions.invoke('admin-delete-user', {
        body: { 
          userId,
          adminUserId: adminUser.id 
        }
      });
      
      if (deleteError) {
        console.error('Error calling admin-delete-user function:', deleteError);
        throw deleteError;
      }
      
      if (!data?.success) {
        console.error('Function returned error:', data);
        throw new Error(data?.error || 'Failed to delete user');
      }
      
      console.log('User deletion successful:', data);
      
      // Update local state to remove the deleted user
      if (setUsers && users.length > 0) {
        console.log('Updating local state to remove user:', userId);
        setUsers(users.filter(user => user.id !== userId));
      }
      
      toast({
        title: 'User Deleted',
        description: 'The user has been permanently deleted from the system.',
      });
      
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete user. Please try again.',
        variant: 'destructive',
      });
      throw error; // Re-throw so parent components can handle it
    } finally {
      setIsActionLoading(false);
    }
  }, [toast, adminUser]);

  // REMOVED: handleToggleUserStatus - replaced with new useToggleUserStatus hook

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
      
    } catch (error: any) {
      console.error('Error updating subscription:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update subscription. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsActionLoading(false);
    }
  }, [toast]);

  return {
    isActionLoading,
    handleDeleteUser,
    handleToggleUserSubscription
  };
};
