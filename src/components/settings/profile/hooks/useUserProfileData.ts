
import { useState, useEffect, useCallback } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useAuth } from '@/contexts/AuthContext';
import { ProfileFormValues } from '../types';

/**
 * Hook to load user profile data into the form
 */
export const useUserProfileData = (
  form: UseFormReturn<ProfileFormValues>,
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
      
      // Reset form with user data
      form.reset({
        firstName: metadata.first_name || '',
        lastName: metadata.last_name || '',
        email: user.email || '',
        password: '',
        phone: metadata.phone || '',
        countryCode: metadata.country_code || 'US',
      });
      
      console.log('Form reset with values:', {
        firstName: metadata.first_name || '',
        lastName: metadata.last_name || '',
        email: user.email || '',
        phone: metadata.phone || '',
        countryCode: metadata.country_code || 'US',
      });
      
      setDataLoaded(true);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading user data:', error);
      setIsLoading(false);
    }
  }, [user, dataLoaded, form, setOriginalEmail]);

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
