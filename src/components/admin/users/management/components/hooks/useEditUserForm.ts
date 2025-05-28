
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { User } from '../../../types';
import { EditUserFormData, editUserSchema } from '../types';

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

  // Update form when user changes
  useEffect(() => {
    if (user) {
      console.log('Setting form values for user:', user);
      
      const formData: EditUserFormData = {
        firstName: String(user.first_name || user.user_metadata?.first_name || ''),
        lastName: String(user.last_name || user.user_metadata?.last_name || ''),
        email: String(user.email || ''),
        phone: String(user.phone || user.user_metadata?.phone || ''),
        streetAddress: String(user.user_metadata?.street_address || ''),
        city: String(user.user_metadata?.city || ''),
        state: String(user.user_metadata?.state || ''),
        zipCode: String(user.user_metadata?.zip_code || ''),
        country: String(user.user_metadata?.country || ''),
        isActive: user.is_active !== false,
      };

      console.log('Form data being set:', formData);
      form.reset(formData);
    }
  }, [user, form]);

  return form;
};
