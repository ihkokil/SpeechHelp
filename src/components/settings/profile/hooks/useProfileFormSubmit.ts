
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { ProfileFormValues } from '../types';
import { supabase } from '@/integrations/supabase/client';

export const useProfileFormSubmit = (
  refreshUserData?: () => Promise<void>,
  avatarUrl?: string,
  refetchProfile?: () => Promise<void>
) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: ProfileFormValues) => {
    if (!user) {
      toast({
        title: "Authentication error",
        description: "You must be logged in to update your profile.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('Submitting profile data to profiles table:', data);
      
      // Check if email is being changed
      const isEmailChanged = data.email !== user.email;
      
      // If email is changed, verify password first
      if (isEmailChanged) {
        if (!data.password) {
          throw new Error("Password is required to change email address");
        }
        
        // Verify the password before changing email
        const { error: verifyError } = await supabase.auth.signInWithPassword({
          email: user.email!,
          password: data.password,
        });
        
        if (verifyError) {
          throw new Error("Incorrect password. Please try again.");
        }
        
        // Update email
        const { error: updateEmailError } = await supabase.auth.updateUser({
          email: data.email,
        });
        
        if (updateEmailError) {
          throw updateEmailError;
        }
        
        toast({
          title: "Email verification sent",
          description: "Please check your new email address for a verification link.",
        });
      }

      const profileUpdateData = {
        first_name: data.firstName,
        last_name: data.lastName,
        phone: data.phone,
        country_code: data.countryCode, // This is now the country code (US, CA, etc.)
        avatar_url: avatarUrl || null,
        updated_at: new Date().toISOString()
      };

      console.log('Updating profile with country code:', profileUpdateData);

      // Use upsert to handle both insert and update cases
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...profileUpdateData,
          is_active: true,
          created_at: new Date().toISOString(),
        }, {
          onConflict: 'id'
        });
      
      if (profileError) {
        console.error('Error upserting profile:', profileError);
        throw profileError;
      }
      
      console.log('Profile updated successfully in profiles table with country code:', data.countryCode);
      
      // Also update user metadata for backward compatibility
      const metadata = {
        first_name: data.firstName,
        last_name: data.lastName,
        phone: data.phone,
        country_code: data.countryCode, // Store country code in metadata too
      };
      
      console.log('Updating user metadata with country code:', metadata);
      
      const { error: metadataError } = await supabase.auth.updateUser({
        data: metadata
      });
      
      if (metadataError) {
        console.warn('Error updating user metadata (non-critical):', metadataError);
      }
      
      // Refresh profile data
      if (refetchProfile) {
        await refetchProfile();
      }
      
      // Refresh the user data in AuthContext
      if (refreshUserData) {
        await refreshUserData();
      }
      
      toast({
        title: "Profile updated",
        description: "Your profile information has been saved successfully.",
      });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update failed",
        description: error.message || "There was a problem updating your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    handleSubmit
  };
};
