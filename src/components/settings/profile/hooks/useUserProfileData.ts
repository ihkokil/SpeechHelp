
import { useState, useEffect, useCallback } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useAuth } from '@/contexts/AuthContext';
import { ProfileFormValues } from '../types';
import { profileService } from '@/services/profileService';

/**
 * Hook to load user profile data into the form - uses profiles table as source of truth
 */
export const useUserProfileData = (
  form: UseFormReturn<ProfileFormValues>,
  setOriginalEmail?: (email: string) => void
) => {
  const { user, profile, isLoading: isAuthLoading } = useAuth();
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load user data into form - prioritize profiles table data
  const loadUserData = useCallback(async () => {
    if (!user || dataLoaded) return;

    try {
      console.log('Loading user profile data for:', user.id);
      
      // Set original email from auth user
      if (user.email && setOriginalEmail) {
        setOriginalEmail(user.email);
      }
      
      // Use profile data if available, otherwise fallback to auth metadata
      const profileData = profile || await profileService.getCurrentUserProfile();
      
      const formData = {
        firstName: profileData?.first_name || '',
        lastName: profileData?.last_name || '',
        email: user.email || '',
        password: '',
        phone: profileData?.phone || '',
        countryCode: profileData?.country_code || 'US',
      };
      
      // Reset form with profile data
      form.reset(formData);
      
      console.log('Form reset with profile values:', formData);
      
      setDataLoaded(true);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading user profile data:', error);
      setIsLoading(false);
    }
  }, [user, profile, dataLoaded, form, setOriginalEmail]);

  // Load user data when component mounts or user/profile changes
  useEffect(() => {
    if (!isAuthLoading && user) {
      loadUserData();
    } else if (!isAuthLoading) {
      setIsLoading(false);
    }
  }, [user, profile, isAuthLoading, loadUserData]);

  return { isLoading: isLoading || isAuthLoading };
};
