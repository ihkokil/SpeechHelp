
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '../../../types';
import { useToast } from '@/hooks/use-toast';

export const useSimpleAdminToggle = () => {
  const { toast } = useToast();

  const handleToggleAdmin = useCallback(async (
    user: User, 
    users: User[], 
    setUsers: (users: User[]) => void
  ) => {
    console.log('Toggling admin status for user:', user.id, 'Current admin status:', user.is_admin);
    
    // Check if user is protected admin
    const isProtectedAdmin = user.email === 'speechhelpmaster@example.com' || user.username === 'speechhelpmaster';
    
    if (isProtectedAdmin && user.is_admin) {
      toast({
        title: 'Action Not Allowed',
        description: 'Cannot remove admin privileges from the original admin user for security reasons.',
        variant: 'destructive',
      });
      return;
    }

    const newAdminStatus = !user.is_admin;
    
    try {
      console.log('Updating admin status in database for user:', user.id, 'New status:', newAdminStatus);
      
      // First, ensure the profile exists
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error checking existing profile:', fetchError);
        toast({
          title: 'Error',
          description: 'Failed to check user profile. Please try again.',
          variant: 'destructive',
        });
        return;
      }

      // If profile doesn't exist, create it first
      if (!existingProfile) {
        console.log('Creating profile for user:', user.id);
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            is_admin: newAdminStatus,
            admin_role: newAdminStatus ? 'admin' : null,
            updated_at: new Date().toISOString()
          });

        if (insertError) {
          console.error('Error creating profile:', insertError);
          toast({
            title: 'Error',
            description: 'Failed to create user profile. Please try again.',
            variant: 'destructive',
          });
          return;
        }
      } else {
        // Update existing profile
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ 
            is_admin: newAdminStatus,
            admin_role: newAdminStatus ? 'admin' : null,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);

        if (updateError) {
          console.error('Error updating admin status:', updateError);
          toast({
            title: 'Error',
            description: 'Failed to update admin status. Please try again.',
            variant: 'destructive',
          });
          return;
        }
      }

      console.log('Successfully updated admin status in database');

      // Update the user in the local state
      const updatedUser = {
        ...user,
        is_admin: newAdminStatus,
        admin_role: newAdminStatus ? 'admin' : null
      };

      setUsers(users.map(u => u.id === user.id ? updatedUser : u));

      toast({
        title: 'Success',
        description: `${user.email} has been ${newAdminStatus ? 'granted' : 'removed from'} admin privileges.`,
      });

    } catch (error) {
      console.error('Exception updating admin status:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    }
  }, [toast]);

  return {
    handleToggleAdmin
  };
};
