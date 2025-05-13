
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { User } from '../../types';

// Form validation schema
const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  role: z.string().default('user'),
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
      email: initialUser?.email || '',
      name: initialUser?.user_metadata?.name || '',
      role: initialUser?.is_admin ? (initialUser.admin_role || 'admin') : 'user',
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
      
      // Mock the API call for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (!initialUser) {
        throw new Error('No user to update');
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
    resetForm
  };
};
