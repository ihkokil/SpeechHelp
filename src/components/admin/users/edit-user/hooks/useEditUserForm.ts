
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { User } from '../../types';
import { supabase } from '@/integrations/supabase/client';
import { formatUserDisplayName } from '../../management/utils/userDisplayUtils';

// Form validation schema
const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  role: z.string().default('user'),
  isActive: z.boolean().default(true),
  phone: z.string().optional(),
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
      email: initialUser?.email || '',
      name: initialUser ? formatUserDisplayName(initialUser) : '',
      role: initialUser?.is_admin ? (initialUser.admin_role || 'admin') : 'user',
      isActive: initialUser?.is_active !== false,
      phone: initialUser?.user_metadata?.phone || '',
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
      
      // Update user in Supabase
      const { error: updateError } = await supabase.auth.admin.updateUserById(
        initialUser.id,
        { 
          email: values.email,
          user_metadata: {
            ...initialUser.user_metadata,
            name: values.name,
            full_name: values.name, // Also update full_name for consistency
            phone: values.phone,
          }
        }
      );
      
      if (updateError) {
        throw updateError;
      }
      
      // Update profile table for admin role, active status, and display name
      const { error: profileError } = await supabase.rpc('update_user_admin_status', {
        user_id: initialUser.id,
        is_admin_status: values.role !== 'user',
        admin_role_value: values.role !== 'user' ? values.role : null,
        permissions_value: initialUser.permissions || []
      });
      
      if (profileError) {
        throw profileError;
      }
      
      // Also update is_active status in profiles table 
      const { error: activeStatusError } = await supabase
        .from('profiles')
        .update({ is_active: values.isActive })
        .eq('id', initialUser.id);
      
      if (activeStatusError) {
        console.error('Error updating active status:', activeStatusError);
      }
      
      // Create an updated user object
      const updatedUser: User = {
        ...initialUser,
        email: values.email,
        is_active: values.isActive,
        is_admin: values.role !== 'user',
        admin_role: values.role !== 'user' ? values.role : undefined,
        updated_at: new Date().toISOString(),
        user_metadata: {
          ...initialUser.user_metadata,
          name: values.name,
          full_name: values.name,
          phone: values.phone,
        }
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
