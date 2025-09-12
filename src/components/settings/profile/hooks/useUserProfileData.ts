
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

  // Enhanced address data extraction with comprehensive field mapping
  const extractAddressField = (fieldVariants: string[]) => {
    const metadata = user?.user_metadata || {};
    const rawMetadata = user?.raw_user_meta_data || {};
    
    // Check user_metadata first, then raw_user_meta_data
    for (const variant of fieldVariants) {
      if (metadata[variant] && String(metadata[variant]).trim()) {
        return String(metadata[variant]).trim();
      }
    }
    for (const variant of fieldVariants) {
      if (rawMetadata[variant] && String(rawMetadata[variant]).trim()) {
        return String(rawMetadata[variant]).trim();
      }
    }
    return '';
  };

  const addressData = {
    streetAddress: extractAddressField([
      'streetAddress', 'street_address', 'address'
    ]),
    city: extractAddressField([
      'city'
    ]),
    state: extractAddressField([
      'state', 'province', 'stateProvince'
    ]),
    zipCode: extractAddressField([
      'zipCode', 'zip_code', 'postal_code', 'postalCode'
    ]),
    country: extractAddressField([
      'country', 'countryCode', 'country_code'
    ]) || user?.user_metadata?.country_code || 'US',
  };

  console.log('🏠 useUserProfileData - Address extraction debug:', {
    userId: user?.id,
    user_metadata: user?.user_metadata,
    raw_user_meta_data: user?.raw_user_meta_data,
    extractedAddress: addressData
  });

  return {
    profile,
    isLoading,
    originalEmail,
    addressData
  };
};
