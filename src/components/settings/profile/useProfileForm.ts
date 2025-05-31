
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/contexts/AuthContext';
import { profileFormSchema, ProfileFormValues } from './types';
import { useProfileFormSubmit } from './hooks/useProfileFormSubmit';
import { useUserProfileData } from './hooks/useUserProfileData';

export const useProfileForm = () => {
  const { refreshUserData } = useAuth();
  const [originalEmail, setOriginalEmail] = useState('');

  // Initialize form with default values
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phone: '',
      countryCode: 'US',
    },
  });

  // Load user data into form
  const { isLoading } = useUserProfileData(
    form, 
    setOriginalEmail
  );

  // Handle form submission
  const { isSubmitting, handleSubmit } = useProfileFormSubmit(refreshUserData);

  return {
    form,
    isLoading,
    isSubmitting,
    originalEmail,
    onSubmit: handleSubmit
  };
};
