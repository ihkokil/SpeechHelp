
import { useState, useEffect, useCallback } from 'react';
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
  setAvailableStates?: (states: any[]) => void,
  setOriginalEmail?: (email: string) => void
) => {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load user data into form
  const loadUserData = useCallback(async () => {
    if (!user || dataLoaded) return;

    try {
      console.log('Loading user data for:', user.id);
      const metadata = user.user_metadata || {};
      
      if (user.email && setOriginalEmail) {
        setOriginalEmail(user.email);
      }
      
      // Get state value before form reset
      const stateValue = metadata.state || '';
      console.log('State value from metadata:', stateValue);
      
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
        state: stateValue,
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
        state: stateValue,
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
      if (metadata.country && setAvailableStates) {
        const countryCode = metadata.country_code || 'US';
        const states = getStatesForCountry(countryCode);
        setAvailableStates(states);
        console.log('Setting initial states for country:', countryCode, states);
        
        // Make sure the state is still set correctly after states are loaded
        if (stateValue) {
          console.log('Explicitly setting state value again:', stateValue);
          // Use a timeout to ensure the states are loaded first
          setTimeout(() => {
            form.setValue('state', stateValue, { 
              shouldValidate: true,
              shouldDirty: false,
              shouldTouch: false 
            });
          }, 200);
        }
      }
      
      setDataLoaded(true);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading user data:', error);
      setIsLoading(false);
    }
  }, [user, dataLoaded, form, setFormattedPhone, setSelectedDialCode, setAvailableStates, setOriginalEmail]);

  // Load user data when component mounts or user changes
  useEffect(() => {
    if (!isAuthLoading && user) {
      loadUserData();
    } else if (!isAuthLoading) {
      setIsLoading(false);
    }
  }, [user, isAuthLoading, loadUserData]);

  return { isLoading: isLoading || isAuthLoading };
};
