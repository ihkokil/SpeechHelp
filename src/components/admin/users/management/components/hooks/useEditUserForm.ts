
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { User } from '../../../types';
import { editUserSchema, EditUserFormData } from '../types';

export const useEditUserForm = (user: User | null) => {
  const form = useForm<EditUserFormData>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      streetAddress: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      isActive: true,
    },
  });

  useEffect(() => {
    if (user) {
      // Provide default values for required fields to ensure they're never undefined
      const formData: EditUserFormData = {
        firstName: user.first_name || user.user_metadata?.first_name || '',
        lastName: user.last_name || user.user_metadata?.last_name || '',
        email: user.email || '',
        phone: user.phone || user.user_metadata?.phone || '',
        streetAddress: user.user_metadata?.street_address || '',
        city: user.user_metadata?.city || '',
        state: user.user_metadata?.state || '',
        zipCode: user.user_metadata?.zip_code || '',
        country: user.user_metadata?.country || '',
        isActive: user.is_active !== false,
      };
      
      form.reset(formData);
    }
  }, [user, form]);

  return form;
};
