
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/contexts/AuthContext';
import { profileFormSchema, ProfileFormValues } from './types';
import { usePhoneInput } from './hooks/usePhoneInput';
import { useLocationFields } from './hooks/useLocationFields';
import { useProfileFormSubmit } from './hooks/useProfileFormSubmit';
import { useUserProfileData } from './hooks/useUserProfileData';

export const useProfileForm = () => {
  const { refreshUserData } = useAuth();
  const [formattedPhone, setFormattedPhone] = useState('');
  const [selectedDialCode, setSelectedDialCode] = useState('1');
  const [availableStates, setAvailableStates] = useState<any[]>([]);

  // Initialize form with default values
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
      country: 'United States',
    },
  });

  // Load user data into form
  const { isLoading } = useUserProfileData(
    form, 
    setFormattedPhone, 
    setSelectedDialCode, 
    setAvailableStates
  );

  // Handle phone input
  const {
    formattedPhone: phoneDisplay,
    selectedDialCode: dialCode,
    handlePhoneChange,
    handleCountryCodeChange
  } = usePhoneInput(form);

  // Handle location fields
  const {
    availableStates: states,
    handleCountryChange
  } = useLocationFields(form);

  // Handle form submission
  const { isSubmitting, handleSubmit } = useProfileFormSubmit(refreshUserData);

  return {
    form,
    isLoading,
    isSubmitting,
    formattedPhone: phoneDisplay || formattedPhone,
    selectedDialCode: dialCode || selectedDialCode,
    availableStates: states.length ? states : availableStates,
    handlePhoneChange,
    handleCountryCodeChange,
    handleCountryChange,
    onSubmit: handleSubmit
  };
};
