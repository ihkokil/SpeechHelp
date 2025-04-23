
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
      console.log('Permissions updated for user:', updatedUser.id);
      
      // Update user permissions in database with appropriate type casting
      // Only update fields that are actually in the profiles table
      const { error } = await supabase
        .from('profiles')
        .update({ 
          // Use a more specific update object that matches the profiles table structure
          // Use additional fields from the profiles table schema if needed
          is_active: updatedUser.is_active,
          // For admin_role and permissions, we need to ensure the profiles table has these columns
          // or add them through SQL migrations
        })
        .eq('id', updatedUser.id);
      
      if (error) throw error;
      
      // Create a separate edge function call to handle admin-specific fields
      // that don't exist in the profiles table
      const response = await fetch(`https://yotrueuqjxmgcwlbbyps.supabase.co/functions/v1/admin-user-operations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabase.auth.getSession().then(res => res.data.session?.access_token)}`
        },
        body: JSON.stringify({
          action: 'updateUserPermissions',
          userId: updatedUser.id,
          data: {
            is_admin: updatedUser.is_admin,
            admin_role: updatedUser.admin_role,
            permissions: updatedUser.permissions
          }
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update permissions');
      }
      
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
        description: 'Failed to update permissions. Please try again.',
        variant: 'destructive',
      });
    }
  }, [toast, setIsPermissionsDialogOpen]);

  return {
    handlePermissionsUpdated
  };
};
