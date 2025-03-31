
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { User } from '../../types';

// Form validation schema
const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' }),
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  role: z.string().default('user'),
  isActive: z.boolean().default(true),
});

export type FormValues = z.infer<typeof formSchema>;

interface UseAddUserFormProps {
  onOpenChange: (open: boolean) => void;
  onUserAdded: (user: User) => void;
  toast: any;
}

export const useAddUserForm = ({ onOpenChange, onUserAdded, toast }: UseAddUserFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      name: '',
      role: 'user',
      isActive: true,
    },
  });

  const resetForm = () => {
    form.reset();
  };

  const handleSubmit = async (values: FormValues) => {
    console.log("Form submitted with values:", values);
    setIsSubmitting(true);
    
    try {
      console.log('Creating new user with values:', values);
      
      // Mock the API call for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a user object to pass back that matches our User type
      const newUser = {
        id: crypto.randomUUID(),
        email: values.email,
        name: values.name,
        status: values.isActive ? 'active' : 'inactive',
        role: values.role,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_sign_in_at: null,
        avatar_url: null,
        subscription: {
          status: 'none',
          end_date: null
        }
      };
      
      toast({
        title: 'Success',
        description: 'User has been created successfully.',
      });
      
      // Pass the new user to the parent component
      onUserAdded(newUser);
      
      // Reset the form
      resetForm();
      
      // Only close the dialog after successful submission
      onOpenChange(false);
    } catch (error) {
      console.error('Exception creating user:', error);
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
