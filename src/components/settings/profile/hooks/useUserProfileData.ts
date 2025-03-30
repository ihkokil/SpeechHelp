
import { useState, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useAuth } from '@/contexts/AuthContext';
import { getCountryCodeFromPhoneNumber } from '../utils/phoneUtils';
import { getStatesForCountry } from '../utils/locationUtils';
import { ProfileFormValues } from '../types';

/**
 * Hook to load user profile data into the form
 */
export const useUserProfileData = (
  form: UseFormReturn<ProfileFormValues>,
  setFormattedPhone: (value: string) => void,
  setSelectedDialCode: (value: string) => void,
  setAvailableStates: (states: any[]) => void,
  setOriginalEmail: (email: string) => void
) => {
  const { user, isLoading } = useAuth();
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      if (!user || dataLoaded) return;

      const metadata = user.user_metadata || {};
      
      if (user.email) {
        setOriginalEmail(user.email);
      }
      
      // This will trigger the first form reset with user data
      form.reset({
        firstName: metadata.first_name || '',
        lastName: metadata.last_name || '',
        email: user.email || '',
        password: '',
        phone: metadata.phone || '',
        countryCode: metadata.country_code || 'US',
        streetAddress: metadata.street_address || '',
        city: metadata.city || '',
        state: metadata.state || '',
        zipCode: metadata.zip_code || '',
        country: metadata.country || 'United States',
      });
      
      console.log('Form reset with values:', {
        firstName: metadata.first_name || '',
        lastName: metadata.last_name || '',
        email: user.email || '',
        phone: metadata.phone || '',
        countryCode: metadata.country_code || 'US',
        streetAddress: metadata.street_address || '',
        city: metadata.city || '',
        state: metadata.state || '',
        zipCode: metadata.zip_code || '',
        country: metadata.country || 'United States',
      });
      
      // Handle phone number formatting
      if (metadata.phone) {
        setFormattedPhone(metadata.phone);
        const countryCode = getCountryCodeFromPhoneNumber(metadata.phone) || '1';
        setSelectedDialCode(countryCode);
      }
      
      // Load available states for the user's country
      if (metadata.country) {
        const countryCode = metadata.country_code || 'US';
        const states = getStatesForCountry(countryCode);
        setAvailableStates(states);
        console.log('Setting initial states for country:', countryCode, states);
        
        // Important: Ensure state value is properly set after states are loaded
        if (metadata.state) {
          console.log('Setting state value from metadata:', metadata.state);
          // Use a slightly longer timeout to ensure the states are loaded first
          setTimeout(() => {
            form.setValue('state', metadata.state, { shouldValidate: true });
          }, 150);
        }
      }
      
      setDataLoaded(true);
    };

    if (user && !isLoading) {
      loadUserData();
    }
  }, [user, isLoading, form, setFormattedPhone, setSelectedDialCode, setAvailableStates, setOriginalEmail, dataLoaded]);

  return { isLoading: isLoading || !dataLoaded };
};
