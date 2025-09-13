
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { profileService, UserProfile } from '@/services/profileService';

export const useUserProfileData = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [originalEmail, setOriginalEmail] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        setOriginalEmail(user.email || '');
        
        // Get profile data from profiles table  
        const profileData = await profileService.getUserProfile(user.id);
        
        if (profileData) {
          setProfile(profileData);
        } else {
          // If no profile exists, sync from auth metadata
          await profileService.syncAuthToProfile(user);
          const syncedProfile = await profileService.getUserProfile(user.id);
          setProfile(syncedProfile);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  // Extract address data from profile's dedicated columns
  const addressData = {
    streetAddress: profile?.address_street_address || '',
    city: profile?.address_city || '',
    state: profile?.address_state || '',
    zipCode: profile?.address_zip_code || '',
    country: profile?.address_country_code || 'US'
  };

  console.log('🏠 useUserProfileData - Address extraction debug:', {
    userId: user?.id,
    profile_address_data: {
      address_street_address: profile?.address_street_address,
      address_city: profile?.address_city,
      address_state: profile?.address_state,
      address_zip_code: profile?.address_zip_code,
      address_country_code: profile?.address_country_code
    },
    extractedAddress: addressData
  });

  return {
    profile,
    isLoading,
    originalEmail,
    addressData
  };
};
