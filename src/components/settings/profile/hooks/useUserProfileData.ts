
import { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useAuth } from '@/contexts/AuthContext';
import { formatPhoneNumber } from '../utils/phoneUtils';
import { getCountryByCode, getStatesForCountry } from '../utils/locationUtils';
import { ProfileFormValues } from '../types';

export const useUserProfileData = (
  form: UseFormReturn<ProfileFormValues>,
  setFormattedPhone: (value: string) => void,
  setSelectedDialCode: (value: string) => void,
  setAvailableStates: (value: any[]) => void,
  setOriginalEmail: (value: string) => void
) => {
  const { user, isLoading } = useAuth();
  
  // Update form with user data when user is loaded
  useEffect(() => {
    if (user) {
      const metadata = user.user_metadata || {};
      console.log('Loading user data into form:', metadata);
      
      // Store original email
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
      
      // Initialize formatted phone based on loaded data
      if (metadata.phone) {
        try {
          const countryCode = metadata.country_code || 'US';
          setFormattedPhone(formatPhoneNumber(metadata.phone, countryCode));
        } catch (error) {
          console.error('Error formatting loaded phone number:', error);
          setFormattedPhone(metadata.phone);
        }
      }
      
      // Update selected dial code based on the loaded country code
      const countryEntry = getCountryByCode(metadata.country_code || 'US');
      if (countryEntry) {
        setSelectedDialCode(countryEntry.dialCode);
      }
      
      // Set available states based on the loaded country
      if (metadata.country) {
        const countryCode = metadata.country_code || 'US';
        const states = getStatesForCountry(countryCode);
        setAvailableStates(states);
        console.log('Setting initial states for country:', countryCode, states);
        
        // Important: Ensure state value is properly set after states are loaded
        if (metadata.state) {
          console.log('Setting state value from metadata:', metadata.state);
          setTimeout(() => {
            form.setValue('state', metadata.state, { shouldValidate: true });
          }, 100);
        }
      }
    }
  }, [user, form, setFormattedPhone, setSelectedDialCode, setAvailableStates, setOriginalEmail]);
  
  return { isLoading };
};
