import { useCallback, useState } from 'react';
import { User } from '../../../types';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

export const useToggleUserStatus = () => {
  const { toast } = useToast();
  const { adminUser } = useAdminAuth();
  const [isToggling, setIsToggling] = useState(false);

  const toggleUserStatus = useCallback(async (
    userId: string,
    currentStatus: boolean,
    onSuccess?: () => void
  ) => {
    if (!userId || !adminUser?.id) {
      console.error('Missing required data:', {
        userId: userId || 'MISSING',
        adminUserId: adminUser?.id || 'MISSING',
        adminUser: adminUser
      });
      
      toast({
        title: 'Error',
        description: 'Invalid user ID or admin not authenticated',
        variant: 'destructive',
      });
      return false;
    }
    
    setIsToggling(true);
    const newStatus = !currentStatus;
    
    try {
      console.log('Starting toggle user status process:', {
        targetUserId: userId,
        currentStatus: currentStatus,
        newStatus: newStatus,
        adminUserId: adminUser.id,
        adminEmail: adminUser.email
      });
      
      // Call the admin-toggle-user-status function
      const { data, error } = await supabase.functions.invoke('admin-toggle-user-status', {
        body: { 
          userId,
          newStatus,
          adminUserId: adminUser.id 
        }
      });
      
      if (error) {
        console.error('Error calling toggle status function:', error);
        throw error;
      }
      
      if (!data?.success) {
        console.error('Toggle status function returned error:', data);
        throw new Error(data?.error || 'Failed to toggle user status');
      }
      
      console.log('User status toggled successfully:', data);
      
      toast({
        title: `User ${newStatus ? 'Activated' : 'Deactivated'}`,
        description: `The user has been ${newStatus ? 'activated' : 'deactivated'} successfully.`,
      });
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
      
      return true;
      
    } catch (error: any) {
      console.error('Error toggling user status:', error);
      
      let errorMessage = 'Failed to toggle user status. Please try again.';
      if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: 'Toggle Status Failed',
        description: errorMessage,
        variant: 'destructive',
      });
      
      return false;
    } finally {
      setIsToggling(false);
    }
  }, [toast, adminUser]);

  return {
    toggleUserStatus,
    isToggling
  };
};