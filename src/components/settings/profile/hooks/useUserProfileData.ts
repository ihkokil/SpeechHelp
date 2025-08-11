
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

  return {
    profile,
    isLoading,
    originalEmail,
    // Include address data from user metadata
    addressData: {
      streetAddress: user?.user_metadata?.street_address || '',
      city: user?.user_metadata?.city || '',
      state: user?.user_metadata?.state || '',
      zipCode: user?.user_metadata?.zip_code || '',
      country: user?.user_metadata?.country || user?.user_metadata?.country_code || 'US',
    }
  };
};
