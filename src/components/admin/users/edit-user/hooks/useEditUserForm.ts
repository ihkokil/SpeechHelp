import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { User } from '../../types';
import { supabase } from '@/integrations/supabase/client';

// Form validation schema
const formSchema = z.object({
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

export type FormValues = z.infer<typeof formSchema>;

interface UseEditUserFormProps {
  onOpenChange: (open: boolean) => void;
  onUserUpdated: (user: User) => void;
  toast: any;
  initialUser: User | null;
}

export const useEditUserForm = ({ onOpenChange, onUserUpdated, toast, initialUser }: UseEditUserFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper function to safely extract string values
  const extractStringValue = (value: any): string => {
    if (typeof value === 'string') return value;
    if (value && typeof value === 'object' && value.value) return String(value.value);
    return '';
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // Safely extract values from both direct fields and user_metadata
      firstName: extractStringValue(initialUser?.first_name) || extractStringValue(initialUser?.user_metadata?.first_name) || '',
      lastName: extractStringValue(initialUser?.last_name) || extractStringValue(initialUser?.user_metadata?.last_name) || '',
      email: initialUser?.email || '',
      phone: extractStringValue(initialUser?.user_metadata?.phone) || '',
      streetAddress: extractStringValue(initialUser?.user_metadata?.street_address) || '',
      city: extractStringValue(initialUser?.user_metadata?.city) || '',
      state: extractStringValue(initialUser?.user_metadata?.state) || '',
      zipCode: extractStringValue(initialUser?.user_metadata?.zip_code) || '',
      country: extractStringValue(initialUser?.user_metadata?.country) || '',
      isActive: initialUser?.is_active !== false,
    },
  });

  // Log user data for debugging
  console.log('useEditUserForm - Initial user data:', {
    id: initialUser?.id,
    email: initialUser?.email,
    first_name: initialUser?.first_name,
    last_name: initialUser?.last_name,
    user_metadata: initialUser?.user_metadata
  });

  const resetForm = () => {
    form.reset();
  };

  const handleSubmit = async (values: FormValues) => {
    console.log("Form submitted with values:", values);
    setIsSubmitting(true);
    
    try {
      if (!initialUser) {
        throw new Error('No user to update');
      }
      
      console.log('Updating user profile for user ID:', initialUser.id);
      
      // Update user profile information using admin_update_user_profile RPC function
      const { data: profileData, error: profileError } = await supabase.rpc('admin_update_user_profile', {
        user_id_param: initialUser.id,
        first_name_param: values.firstName,
        last_name_param: values.lastName,
        user_email: values.email,
        phone_number: values.phone || '',
        is_active_status: values.isActive,
        user_metadata: {
          first_name: values.firstName,
          last_name: values.lastName,
          phone: values.phone || '',
          street_address: values.streetAddress || '',
          city: values.city || '',
          state: values.state || '',
          zip_code: values.zipCode || '',
          country: values.country || ''
        }
      });
      
      if (profileError) {
        console.error('Error updating user profile:', profileError);
        throw new Error(profileError.message || 'Failed to update user profile');
      }
      
      console.log('User profile updated successfully:', profileData);
      
      // Update user metadata in auth system
      const { error: metadataError } = await supabase.auth.admin.updateUserById(
        initialUser.id,
        { 
          email: values.email,
          user_metadata: {
            ...initialUser.user_metadata,
            first_name: values.firstName,
            last_name: values.lastName,
            full_name: `${values.firstName} ${values.lastName}`,
            name: `${values.firstName} ${values.lastName}`,
            phone: values.phone || '',
            street_address: values.streetAddress || '',
            city: values.city || '',
            state: values.state || '',
            zip_code: values.zipCode || '',
            country: values.country || ''
          }
        }
      );
      
      if (metadataError) {
        console.error('Error updating user metadata:', metadataError);
      }
      
      // Construct the updated user object for UI updates
      const updatedUser: User = {
        ...initialUser,
        email: values.email,
        is_active: values.isActive,
        updated_at: new Date().toISOString(),
        // Update both the direct fields and user_metadata for compatibility
        first_name: values.firstName,
        last_name: values.lastName,
        user_metadata: {
          ...(initialUser.user_metadata || {}),
          first_name: values.firstName,
          last_name: values.lastName,
          full_name: `${values.firstName} ${values.lastName}`,
          name: `${values.firstName} ${values.lastName}`,
          phone: values.phone || '',
          street_address: values.streetAddress || '',
          city: values.city || '',
          state: values.state || '',
          zip_code: values.zipCode || '',
          country: values.country || '',
        }
      };
      
      console.log('Constructed updated user object:', updatedUser);
      
      // Pass the updated user to the parent component
      onUserUpdated(updatedUser);
      
      toast({
        title: 'Success',
        description: 'User has been updated successfully.',
      });
      
      // Reset the form
      resetForm();
      
      // Close the dialog after successful submission
      onOpenChange(false);
      
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

  // Handle sending password reset
  const handleSendPasswordReset = async (email: string) => {
    setIsSubmitting(true);
    
    try {
      console.log('Sending password reset to:', email);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?type=recovery`,
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: 'Password Reset Sent',
        description: `A password reset link has been sent to ${email}.`,
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

  // Handle dialog close
  const handleDialogClose = (open: boolean) => {
    console.log("Dialog open state changing to:", open);
    // Only allow closing if we're not in the middle of submitting
    if (!isSubmitting) {
      // If the dialog is closing, reset the form
      if (!open) {
        resetForm();
      }
      onOpenChange(open);
    }
  };

  return {
    form,
    isSubmitting,
    handleSubmit,
    handleDialogClose,
    resetForm,
    handleSendPasswordReset
  };
};
