
import { useState, useCallback } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { User } from '../../types';

// Form validation schema
const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  role: z.string(),
  isActive: z.boolean().default(true),
  id: z.string().uuid().optional(), // Add ID field for form state
});

// Form values type
export type FormValues = z.infer<typeof formSchema>;

interface UseEditUserFormProps {
  onOpenChange: (open: boolean) => void;
  onUserUpdated: (user: User) => void;
  toast: any;
}

export const useEditUserForm = ({ 
  onOpenChange, 
  onUserUpdated, 
  toast 
}: UseEditUserFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize form with validation
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      role: 'user',
      isActive: true,
    },
  });
  
  // Set form values from user object
  const setFormValues = useCallback((user: User) => {
    form.reset({
      id: user.id,
      name: user.user_metadata?.full_name || '',
      email: user.email || '',
      role: user.app_metadata?.role || 'user',
      isActive: user.is_active !== false,
    });
  }, [form]);
  
  // Handle form submission
  const handleSubmit = useCallback(async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      // Get the user ID from the form state
      const userId = values.id;
      
      if (!userId) {
        toast({
          title: 'Error',
          description: 'User ID is missing.',
          variant: 'destructive',
        });
        setIsSubmitting(false);
        return;
      }
      
      // Update user in Supabase
      const { data, error } = await supabase.auth.admin.updateUserById(userId, {
        email: values.email,
        user_metadata: {
          full_name: values.name,
        },
        app_metadata: {
          role: values.role,
        },
      });
      
      if (error) {
        throw error;
      }
      
      // Update user active status in profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          is_active: values.isActive,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);
      
      if (profileError) {
        throw profileError;
      }
      
      // Update local state via callback
      if (data.user) {
        const updatedUser = {
          ...data.user,
          is_active: values.isActive,
        };
        onUserUpdated(updatedUser as User);
      }
      
      // Show success toast
      toast({
        title: 'User Updated',
        description: `${values.email} has been updated successfully.`,
      });
      
      // Close dialog
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error updating user:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update user. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [onOpenChange, onUserUpdated, toast]);
  
  // Handle dialog close
  const handleDialogClose = useCallback((open: boolean) => {
    if (!open) {
      // Only reset the form when closing the dialog
      resetForm();
    }
    onOpenChange(open);
  }, [onOpenChange]);
  
  // Reset form to default values
  const resetForm = useCallback(() => {
    form.reset({
      name: '',
      email: '',
      role: 'user',
      isActive: true,
    });
  }, [form]);
  
  return {
    form,
    isSubmitting,
    handleSubmit,
    handleDialogClose,
    resetForm,
    setFormValues,
  };
};
