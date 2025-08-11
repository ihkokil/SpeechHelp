
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
  });

  // Update form when profile data is loaded
  React.useEffect(() => {
    if (profile) {
      form.reset({
        firstName: profile.first_name || '',
        lastName: profile.last_name || '',
        email: originalEmail || '',
        phone: profile.phone || '',
        countryCode: profile.country_code || 'US',
        // Address fields from user metadata
        streetAddress: addressData.streetAddress || '',
        city: addressData.city || '',
        state: addressData.state || '',
        zipCode: addressData.zipCode || '',
        country: addressData.country || 'US',
        currentPassword: '',
      });
    }
  }, [profile, originalEmail, addressData, form]);

  return {
    form,
    isLoading,
    originalEmail,
    onSubmit: form.handleSubmit(onSubmit)
  };
};
