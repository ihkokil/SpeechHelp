
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileFormSchema, ProfileFormValues } from './types';
import { useUserProfileData } from './hooks/useUserProfileData';
import { useProfileFormSubmit } from './hooks/useProfileFormSubmit';

export const useProfileForm = () => {
  const { profile, isLoading, originalEmail, addressData } = useUserProfileData();
  const { onSubmit } = useProfileFormSubmit();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      countryCode: 'US',
      streetAddress: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'US',
      currentPassword: '',
    },
    mode: 'onChange', // This helps with real-time validation
  });

  // Update form when profile data is loaded, but don't override user changes
  React.useEffect(() => {
    if (profile && originalEmail && !form.formState.isDirty) {
      console.log('Initializing form with profile data:', profile);
      console.log('Original email:', originalEmail);
      console.log('Address data:', addressData);
      
      const formData = {
        firstName: profile.first_name || '',
        lastName: profile.last_name || '',
        email: originalEmail || '', // Make sure email is always set
        phone: profile.phone || '',
        countryCode: profile.country_code || 'US',
        // Address fields from user metadata
        streetAddress: addressData.streetAddress || '',
        city: addressData.city || '',
        state: addressData.state || '',
        zipCode: addressData.zipCode || '',
        country: addressData.country || 'US',
        currentPassword: '',
      };
      
      console.log('Setting form data:', formData);
      form.reset(formData);
    }
  }, [profile, originalEmail, addressData, form]);

  // Force email field update if it's empty but we have originalEmail
  React.useEffect(() => {
    const currentEmail = form.getValues('email');
    if (originalEmail && !currentEmail) {
      console.log('Setting email field to originalEmail:', originalEmail);
      form.setValue('email', originalEmail);
    }
  }, [originalEmail, form]);

  return {
    form,
    isLoading,
    originalEmail,
    onSubmit: form.handleSubmit(onSubmit)
  };
};
