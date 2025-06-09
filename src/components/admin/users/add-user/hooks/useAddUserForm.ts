
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { User } from '../../types';
import { supabase } from '@/integrations/supabase/client';

// Form validation schema
const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' }),
  firstName: z.string().min(2, { message: 'First name must be at least 2 characters' }),
  lastName: z.string().min(2, { message: 'Last name must be at least 2 characters' }),
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
      firstName: '',
      lastName: '',
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
      console.log('Creating new user via edge function:', values);
      
      // Call the admin-create-user edge function
      const { data: functionData, error: functionError } = await supabase.functions.invoke('admin-create-user', {
        body: {
          email: values.email,
          password: values.password,
          firstName: values.firstName,
          lastName: values.lastName,
          role: values.role,
          isActive: values.isActive
        }
      });
      
      if (functionError) {
        console.error('Error calling admin-create-user function:', functionError);
        throw new Error(functionError.message || 'Failed to create user');
      }
      
      if (!functionData?.success) {
        console.error('Function returned error:', functionData);
        throw new Error(functionData?.error || 'Failed to create user');
      }
      
      console.log('User created successfully:', functionData.user);
      
      // Create a user object to pass back that matches our User type
      const newUser: User = {
        id: functionData.user.id,
        email: functionData.user.email || values.email,
        is_active: values.isActive,
        is_admin: values.role !== 'user',
        admin_role: values.role !== 'user' ? values.role : undefined,
        created_at: functionData.user.created_at,
        updated_at: functionData.user.updated_at || functionData.user.created_at,
        last_sign_in_at: null,
        app_metadata: {
          provider: 'email',
          providers: ['email']
        },
        user_metadata: {
          first_name: values.firstName,
          last_name: values.lastName,
          full_name: `${values.firstName} ${values.lastName}`,
          name: `${values.firstName} ${values.lastName}`,
          email: values.email
        },
        subscription_status: 'none',
        subscription_end_date: null,
        subscription_plan: null
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
    } catch (error: any) {
      console.error('Exception creating user:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create user. Please try again.',
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
