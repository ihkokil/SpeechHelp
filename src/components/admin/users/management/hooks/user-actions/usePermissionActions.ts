
import { useCallback } from 'react';
import { User } from '../../../types';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const usePermissionActions = (
  setIsPermissionsDialogOpen?: (isOpen: boolean) => void
) => {
  const { toast } = useToast();

  const handlePermissionsUpdated = useCallback(async (updatedUser: User, users: User[] = [], setUsers: ((users: User[]) => void) | null = null) => {
    try {
      console.log('Updating permissions for user:', updatedUser.id);
      
      // Get the session for the current user to retrieve the access token
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Error getting session:', sessionError);
        throw new Error('Authentication error: ' + (sessionError.message || 'Failed to get session'));
      }
      
      const accessToken = sessionData?.session?.access_token;
      
      if (!accessToken) {
        console.error('No access token available');
        throw new Error('No session found. Please login again.');
      }
      
      // Update user permissions using our edge function
      const { data, error: functionError } = await supabase.functions.invoke('admin-user-operations', {
        body: { 
          action: 'updateUserPermissions',
          userId: updatedUser.id,
          data: {
            is_admin: updatedUser.is_admin,
            admin_role: updatedUser.admin_role,
            permissions: updatedUser.permissions
          }
        },
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      
      if (functionError) {
        console.error('Error invoking admin-user-operations:', functionError);
        throw new Error(functionError.message || 'Failed to update user permissions');
      }
      
      if (!data.success) {
        console.error('Error from function:', data);
        throw new Error(data.error || 'Failed to update user permissions');
      }
      
      console.log('Permissions updated successfully:', data);
      
      // Update the user in the users array if we have the array and update function
      if (setUsers && users.length > 0) {
        setUsers(
          users.map(user => 
            user.id === updatedUser.id ? updatedUser : user
          )
        );
      }
      
      // Show a success toast
      toast({
        title: 'Permissions Updated',
        description: `${updatedUser.email}'s admin permissions have been updated.`,
      });
      
      // Close the dialog
      if (setIsPermissionsDialogOpen) {
        setIsPermissionsDialogOpen(false);
      }
    } catch (error) {
      console.error('Error updating permissions:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update permissions. Please try again.',
        variant: 'destructive',
      });
    }
  }, [toast, setIsPermissionsDialogOpen]);

  return {
    handlePermissionsUpdated
  };
};
