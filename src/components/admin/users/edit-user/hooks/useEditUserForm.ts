
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { User } from '../../types';
import { supabase } from '@/integrations/supabase/client';
import { formatUserDisplayName } from '../../management/utils/userDisplayUtils';

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

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: initialUser?.user_metadata?.first_name || '',
      lastName: initialUser?.user_metadata?.last_name || '',
      email: initialUser?.email || '',
      phone: initialUser?.user_metadata?.phone || '',
      streetAddress: initialUser?.user_metadata?.street_address || '',
      city: initialUser?.user_metadata?.city || '',
      state: initialUser?.user_metadata?.state || '',
      zipCode: initialUser?.user_metadata?.zip_code || '',
      country: initialUser?.user_metadata?.country || '',
      isActive: initialUser?.is_active !== false,
    },
  });

  const resetForm = () => {
    form.reset();
  };

  const handleSubmit = async (values: FormValues) => {
    console.log("Form submitted with values:", values);
    setIsSubmitting(true);
    
    try {
      console.log('Updating user with values:', values);
      
      if (!initialUser) {
        throw new Error('No user to update');
      }
      
      // Update user profile information with admin_update_user_profile RPC function
      const { data: profileData, error: profileError } = await supabase.rpc('admin_update_user_profile', {
        user_id_param: initialUser.id,
        display_name: `${values.firstName} ${values.lastName}`,
        user_email: values.email,
        phone_number: values.phone || '',
        is_active_status: values.isActive,
        user_metadata: {
          first_name: values.firstName,
          last_name: values.lastName,
          phone: values.phone,
          street_address: values.streetAddress,
          city: values.city,
          state: values.state,
          zip_code: values.zipCode,
          country: values.country
        }
      });
      
      if (profileError) {
        console.error('Error updating user profile:', profileError);
        throw profileError;
      }
      
      console.log('User profile updated successfully:', profileData);
      
      // Update user email if it changed
      if (values.email !== initialUser.email) {
        const { error: emailError } = await supabase.auth.admin.updateUserById(
          initialUser.id,
          { email: values.email }
        );
        
        if (emailError) {
          console.error('Error updating user email:', emailError);
          // Don't throw here as the profile update was successful
          toast({
            title: 'Partial Update',
            description: 'Profile updated but email change failed. User will need to verify new email.',
            variant: 'destructive',
          });
        }
      }
      
      // Construct the updated user object for UI updates
      const updatedMetadata = {
        ...(initialUser.user_metadata || {}),
        first_name: values.firstName,
        last_name: values.lastName,
        full_name: `${values.firstName} ${values.lastName}`,
        phone: values.phone,
        street_address: values.streetAddress,
        city: values.city,
        state: values.state,
        zip_code: values.zipCode,
        country: values.country,
      };
      
      const updatedUser: User = {
        ...initialUser,
        email: values.email,
        is_active: values.isActive,
        updated_at: new Date().toISOString(),
        user_metadata: updatedMetadata
      };
      
      toast({
        title: 'Success',
        description: 'User has been updated successfully.',
      });
      
      // Pass the updated user to the parent component
      onUserUpdated(updatedUser);
      
      // Reset the form
      resetForm();
      
      // Close the dialog after successful submission
      onOpenChange(false);
      
      // Refresh the page after a slight delay to ensure state is properly updated
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Exception updating user:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
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
    } catch (error) {
      console.error('Exception sending password reset:', error);
      toast({
        title: 'Error',
        description: 'Failed to send password reset link. Please try again.',
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
