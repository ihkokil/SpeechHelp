
import { useCallback, useState } from 'react';
import { User } from '../../../types';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

export const useDeleteUser = () => {
  const { toast } = useToast();
  const { adminUser } = useAdminAuth();
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteUser = useCallback(async (
    userId: string,
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
    
    setIsDeleting(true);
    
    try {
      console.log('Starting delete user process:', {
        targetUserId: userId,
        adminUserId: adminUser.id,
        adminEmail: adminUser.email
      });
      
      // Call the admin-delete-user function with the correct admin user ID
      const { data, error } = await supabase.functions.invoke('admin-delete-user', {
        body: { 
          userId,
          adminUserId: adminUser.id 
        }
      });
      
      if (error) {
        console.error('Error calling delete function:', error);
        throw error;
      }
      
      if (!data?.success) {
        console.error('Delete function returned error:', data);
        throw new Error(data?.error || 'Failed to delete user');
      }
      
      console.log('User deleted successfully:', data);
      
      toast({
        title: 'User Deleted',
        description: 'The user has been permanently deleted from the system.',
      });
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
      
      return true;
      
    } catch (error: any) {
      console.error('Error deleting user:', error);
      
      let errorMessage = 'Failed to delete user. Please try again.';
      if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: 'Delete Failed',
        description: errorMessage,
        variant: 'destructive',
      });
      
      return false;
    } finally {
      setIsDeleting(false);
    }
  }, [toast, adminUser]);

  return {
    deleteUser,
    isDeleting
  };
};
