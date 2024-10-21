
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { User } from '../../types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Form validation schema
const editUserSchema = z.object({
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  phone: z.string().optional(),
  streetAddress: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().optional(),
  isActive: z.boolean().default(true),
});

export type EditUserFormData = z.infer<typeof editUserSchema>;

interface UseEditUserProps {
  user: User | null;
  onSuccess: (updatedUser: User) => void;
  onClose: () => void;
}

// Type for the RPC response
interface AdminUpdateUserProfileResponse {
  success?: boolean;
  error?: string;
  id?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  is_active?: boolean;
  is_admin?: boolean;
  admin_role?: string;
  updated_at?: string;
  username?: string;
  phone?: string;
  subscription_plan?: string;
}

export const useEditUser = ({ user, onSuccess, onClose }: UseEditUserProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Helper function to safely extract string values
  const safeString = (value: any): string => {
    if (typeof value === 'string') return value.trim();
    if (value === null || value === undefined) return '';
    return String(value).trim();
  };

  const form = useForm<EditUserFormData>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      firstName: safeString(user?.first_name) || safeString(user?.user_metadata?.first_name),
      lastName: safeString(user?.last_name) || safeString(user?.user_metadata?.last_name),
      email: safeString(user?.email),
      phone: safeString(user?.user_metadata?.phone),
      streetAddress: safeString(user?.user_metadata?.street_address),
      city: safeString(user?.user_metadata?.city),
      state: safeString(user?.user_metadata?.state),
      zipCode: safeString(user?.user_metadata?.zip_code),
      country: safeString(user?.user_metadata?.country),
      isActive: user?.is_active !== false,
    },
  });

  const handleSubmit = async (values: EditUserFormData) => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'No user selected for editing',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      console.log('Updating user profile:', user.id, values);
      
      // Call the updated admin_update_user_profile function
      const { data: profileData, error: profileError } = await supabase.rpc('admin_update_user_profile', {
        user_id_param: user.id,
        first_name_param: values.firstName.trim(),
        last_name_param: values.lastName.trim(),
        user_email: values.email.trim(),
        phone_number: values.phone?.trim() || null,
        street_address_param: values.streetAddress?.trim() || null,
        city_param: values.city?.trim() || null,
        state_param: values.state?.trim() || null,
        zip_code_param: values.zipCode?.trim() || null,
        country_param: values.country?.trim() || null,
        is_active_status: values.isActive,
      });
      
      if (profileError) {
        console.error('Error updating user profile:', profileError);
        throw new Error(profileError.message || 'Failed to update user profile');
      }

      // Type cast the response to our expected interface
      const response = profileData as AdminUpdateUserProfileResponse;

      if (!response?.success) {
        throw new Error(response?.error || 'Failed to update user profile');
      }
      
      console.log('User profile updated successfully:', response);
      
      // Construct the updated user object
      const fullName = `${values.firstName.trim()} ${values.lastName.trim()}`.trim();
      const updatedUser: User = {
        ...user,
        email: values.email.trim(),
        first_name: values.firstName.trim(),
        last_name: values.lastName.trim(),
        is_active: values.isActive,
        updated_at: new Date().toISOString(),
        user_metadata: {
          ...(user.user_metadata || {}),
          first_name: values.firstName.trim(),
          last_name: values.lastName.trim(),
          full_name: fullName,
          name: fullName,
          email: values.email.trim(),
          phone: values.phone?.trim() || '',
          street_address: values.streetAddress?.trim() || '',
          city: values.city?.trim() || '',
          state: values.state?.trim() || '',
          zip_code: values.zipCode?.trim() || '',
          country: values.country?.trim() || '',
        }
      };
      
      console.log('Constructed updated user object:', updatedUser);
      
      onSuccess(updatedUser);
      
      toast({
        title: 'Success',
        description: 'User has been updated successfully.',
      });
      
      onClose();
      
    } catch (error: any) {
      console.error('Exception updating user:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update user. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendPasswordReset = async () => {
    if (!user?.email) {
      toast({
        title: 'Error',
        description: 'No email address found for this user',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      console.log('Sending password reset to:', user.email);
      
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/auth?type=recovery`,
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: 'Password Reset Sent',
        description: `A password reset link has been sent to ${user.email}.`,
      });
    } catch (error: any) {
      console.error('Exception sending password reset:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to send password reset link. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    handleSubmit,
    handleSendPasswordReset,
  };
};
