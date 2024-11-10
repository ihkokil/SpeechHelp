
import { useState, useCallback } from 'react';
import { User } from '../../types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Define the exact interface for the user data to match the form schema
interface EditUserFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isActive: boolean;
}

export const useEditUser = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordResetLoading, setIsPasswordResetLoading] = useState(false);

  const updateUser = useCallback(async (
    userId: string,
    userData: EditUserFormData
  ) => {
    setIsLoading(true);
    try {
      console.log('Updating user:', userId, userData);
      
      // Call the admin update user profile function
      const { data, error } = await supabase.rpc('admin_update_user_profile', {
        user_id_param: userId,
        first_name_param: userData.firstName,
        last_name_param: userData.lastName,
        user_email: userData.email,
        phone_number: userData.phone,
        street_address_param: userData.streetAddress,
        city_param: userData.city,
        state_param: userData.state,
        zip_code_param: userData.zipCode,
        country_param: userData.country,
        is_active_status: userData.isActive
      });

      if (error) {
        console.error('Error updating user:', error);
        throw error;
      }

      // Handle the response data properly
      let response;
      if (typeof data === 'object' && data !== null) {
        response = data as any;
      } else {
        throw new Error('Invalid response format');
      }

      if (!response.success) {
        throw new Error(response.error || 'Failed to update user');
      }

      toast({
        title: 'User Updated',
        description: 'User information has been successfully updated.',
      });

      return response;
    } catch (error: any) {
      console.error('Error updating user:', error);
      toast({
        title: 'Update Failed',
        description: error.message || 'Failed to update user information.',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const sendPasswordReset = useCallback(async (email: string) => {
    setIsPasswordResetLoading(true);
    try {
      console.log('Sending password reset for:', email);
      
      // Call the send-password-reset edge function
      const { data, error } = await supabase.functions.invoke('send-password-reset', {
        body: {
          email: email,
          resetUrl: `${window.location.origin}/auth?mode=reset`
        }
      });

      if (error) {
        console.error('Error sending password reset:', error);
        throw error;
      }

      toast({
        title: 'Password Reset Sent',
        description: `A password reset link has been sent to ${email}.`,
      });

      return data;
    } catch (error: any) {
      console.error('Error sending password reset:', error);
      toast({
        title: 'Reset Failed',
        description: error.message || 'Failed to send password reset email.',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsPasswordResetLoading(false);
    }
  }, [toast]);

  return {
    updateUser,
    sendPasswordReset,
    isLoading,
    isPasswordResetLoading
  };
};
