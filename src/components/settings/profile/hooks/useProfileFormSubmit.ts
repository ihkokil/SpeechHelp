
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { profileService } from '@/services/profileService';
import { supabase } from '@/integrations/supabase/client';
import { ProfileFormValues } from '../types';

export const useProfileFormSubmit = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user, refreshUser } = useAuth();

  const onSubmit = async (data: ProfileFormValues) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to update your profile",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Check if email is being changed and password is required
      const currentUser = await supabase.auth.getUser();
      const currentEmail = currentUser.data.user?.email;
      const isEmailChanged = data.email !== currentEmail;

      if (isEmailChanged && !data.currentPassword) {
        toast({
          title: "Password Required",
          description: "Please enter your current password to update your email address",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }

      // Verify password if email is being changed
      if (isEmailChanged && data.currentPassword) {
        const { error: passwordError } = await supabase.functions.invoke('verify-password', {
          body: { password: data.currentPassword }
        });

        if (passwordError) {
          toast({
            title: "Invalid Password",
            description: "The password you entered is incorrect",
            variant: "destructive"
          });
          setIsSubmitting(false);
          return;
        }
      }

      // Update profile in profiles table
      const updateResult = await profileService.updateUserProfile(user.id, {
        first_name: data.firstName,
        last_name: data.lastName,
        phone: data.phone || null,
        country_code: data.countryCode,
        // Address fields will be stored in user metadata for now
        // In a future update, these could be moved to dedicated columns
      });

      if (!updateResult.success) {
        throw new Error(updateResult.error || 'Failed to update profile');
      }

      // Update auth metadata with address information
      const { error: metadataError } = await supabase.auth.updateUser({
        data: {
          first_name: data.firstName,
          last_name: data.lastName,
          full_name: `${data.firstName} ${data.lastName}`,
          phone: data.phone || '',
          country_code: data.countryCode,
          street_address: data.streetAddress || '',
          city: data.city || '',
          state: data.state || '',
          zip_code: data.zipCode || '',
          country: data.country,
        }
      });

      if (metadataError) {
        console.error('Error updating user metadata:', metadataError);
        // Don't throw error as profile update was successful
      }

      // Update email if changed
      if (isEmailChanged) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: data.email
        });

        if (emailError) {
          throw new Error('Failed to update email address');
        }

        toast({
          title: "Email Update Sent",
          description: "Please check your new email address to confirm the change",
        });
      }

      // Refresh user data
      await refreshUser();

      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully",
      });

    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return { onSubmit, isSubmitting };
};
