
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileFormSchema, ProfileFormValues } from './types';
import { useUserProfileData } from './hooks/useUserProfileData';
import { useProfileFormSubmit } from './hooks/useProfileFormSubmit';

export const useProfileForm = () => {
  const { profile, isLoading, originalEmail, addressData } = useUserProfileData();
  const { onSubmit } = useProfileFormSubmit();
  const [isInitialized, setIsInitialized] = React.useState(false);

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
    mode: 'onChange',
  });

  // Initialize form data only once when profile is loaded and not already initialized
  React.useEffect(() => {
    if (profile && originalEmail && !isInitialized && !isLoading) {
      console.log('Initializing form with profile data (one time):', profile);
      
      const formData = {
        firstName: profile.first_name || '',
        lastName: profile.last_name || '',
        email: originalEmail || '',
        phone: profile.phone || '',
        countryCode: profile.country_code || 'US',
        streetAddress: addressData.streetAddress || '',
        city: addressData.city || '',
        state: addressData.state || '',
        zipCode: addressData.zipCode || '',
        country: addressData.country || 'US',
        currentPassword: '',
      };
      
      form.reset(formData);
      setIsInitialized(true);
    }
  }, [profile, originalEmail, addressData, isInitialized, isLoading, form]);

  // Only set email if it's empty and we have originalEmail (backup safety check)
  React.useEffect(() => {
    if (isInitialized && originalEmail && !form.getValues('email')) {
      console.log('Setting email field as backup:', originalEmail);
      form.setValue('email', originalEmail, { shouldDirty: false });
    }
  }, [originalEmail, form, isInitialized]);

  return {
    form,
    isLoading: isLoading || !isInitialized,
    originalEmail,
    onSubmit: form.handleSubmit(onSubmit)
  };
};
