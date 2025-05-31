
import { useState, useEffect, useCallback } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { ProfileFormValues } from '../types';
import { extractDialCodeFromUser } from '@/utils/phoneUtils';

/**
 * Hook to load user profile data from the profiles table into the form
 */
export const useUserProfileData = (
  form: UseFormReturn<ProfileFormValues>,
  setOriginalEmail?: (email: string) => void
) => {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState<string>('');

  // Load user data into form
  const loadUserData = useCallback(async () => {
    if (!user || dataLoaded) return;

    try {
      console.log('Loading user profile data from profiles table for:', user.id);
      
      // Fetch profile data from the profiles table
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('first_name, last_name, phone, country_code, avatar_url, created_at, updated_at')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
      }

      console.log('Profile data fetched:', profile);
      
      if (user.email && setOriginalEmail) {
        setOriginalEmail(user.email);
      }
      
      // Set avatar URL if available
      if (profile?.avatar_url) {
        setAvatarUrl(profile.avatar_url);
      }
      
      // Extract dial code from user data (handles both dial codes and country codes)
      const dialCode = extractDialCodeFromUser({
        country_code: profile?.country_code,
        user_metadata: user.user_metadata
      });
      
      // Reset form with profile data
      form.reset({
        firstName: profile?.first_name || '',
        lastName: profile?.last_name || '',
        email: user.email || '',
        password: '',
        phone: profile?.phone || '',
        countryCode: dialCode, // Use extracted dial code
      });
      
      console.log('Form reset with profile values:', {
        firstName: profile?.first_name || '',
        lastName: profile?.last_name || '',
        email: user.email || '',
        phone: profile?.phone || '',
        countryCode: dialCode,
        avatarUrl: profile?.avatar_url || ''
      });
      
      setDataLoaded(true);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading user profile data:', error);
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

  return { 
    isLoading: isLoading || isAuthLoading,
    avatarUrl,
    setAvatarUrl,
    refetchProfile: loadUserData
  };
};
