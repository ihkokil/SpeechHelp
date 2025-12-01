import React, { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { adminSettingsService } from '@/services/adminSettingsService';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { profileFormSchema, ProfileFormValues } from '@/components/settings/profile/types';
import PersonalInfoForm from '@/components/settings/profile/PersonalInfoForm';
import { profileService } from '@/services/profileService';
import { supabase } from '@/integrations/supabase/client';
import { ButtonCustom } from '@/components/ui/button-custom';
import ProfileFormSkeleton from '@/components/settings/profile/ProfileFormSkeleton';
import { User } from 'lucide-react';

const AdminProfileSettings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [originalEmail, setOriginalEmail] = useState('');
  const { adminUser } = useAdminAuth();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      countryCode: 'US',
      streetAddress: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'US',
      currentPassword: ''
    },
  });

  // Check if this is the special admin "speechhelpmaster"
  const isSpeechHelpMaster = adminUser?.username === 'speechhelpmaster' || adminUser?.email?.includes('speechhelpmaster');

  useEffect(() => {
    loadProfileData();
  }, [adminUser]);

  const loadProfileData = async () => {
    setIsLoadingData(true);
    try {
      if (!adminUser) return;

      if (isSpeechHelpMaster) {
        // For speechhelpmaster, load from admin_settings only
        await loadFromAdminSettings();
      } else {
        // For regular admins, load from user profile first, then admin settings
        await loadFromUserProfile();
      }
    } catch (error) {
      console.error('Error loading profile data:', error);
      toast({
        title: "Error",
        description: "Failed to load profile data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingData(false);
    }
  };

  const loadFromAdminSettings = async () => {
    if (!adminUser) return;

    // Start with admin user data
    const nameParts = adminUser.username.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    const initialData = {
      firstName,
      lastName,
      email: adminUser.email,
      phone: '',
      countryCode: 'US',
      streetAddress: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'US',
      currentPassword: ''
    };

    setOriginalEmail(adminUser.email);

    // Load from admin settings
    const result = await adminSettingsService.getSettings('profile');
    if (result.success && result.data) {
      const settings = result.data.reduce((acc, setting) => {
        acc[setting.setting_key] = setting.setting_value;
        return acc;
      }, {} as any);

      form.reset({
        firstName: settings.first_name || firstName,
        lastName: settings.last_name || lastName,
        email: settings.email || adminUser.email,
        phone: settings.phone || '',
        countryCode: settings.country_code || 'US',
        streetAddress: settings.street_address || '',
        city: settings.city || '',
        state: settings.state || '',
        zipCode: settings.zip_code || '',
        country: settings.country || 'US',
        currentPassword: ''
      });
    } else {
      form.reset(initialData);
    }
  };

  const loadFromUserProfile = async () => {
    if (!adminUser) return;

    try {
      // Try to get user profile data using the edge function
      const { data, error } = await supabase.functions.invoke('admin-profile-sync', {
        body: {
          action: 'get_profile',
          admin_user_id: adminUser.id
        }
      });

      if (error) {
        console.error('Error fetching user profile:', error);
        await loadFromAdminSettings(); // Fallback to admin settings
        return;
      }

      if (data?.success && data?.data) {
        const profileData = data.data;
        setOriginalEmail(profileData.email);
        
        form.reset({
          firstName: profileData.first_name || '',
          lastName: profileData.last_name || '',
          email: profileData.email || adminUser.email,
          phone: profileData.phone || '',
          countryCode: profileData.country_code || 'US',
          streetAddress: profileData.street_address || '',
          city: profileData.city || '',
          state: profileData.state || '',
          zipCode: profileData.zip_code || '',
          country: profileData.country || 'US',
          currentPassword: ''
        });
      } else {
        await loadFromAdminSettings(); // Fallback to admin settings
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      await loadFromAdminSettings(); // Fallback to admin settings
    }
  };

  const handleSubmit = async (data: ProfileFormValues) => {
    setIsLoading(true);
    try {
      if (!adminUser) {
        throw new Error('No admin user found');
      }

      if (isSpeechHelpMaster) {
        // For speechhelpmaster, save to admin_settings only
        await saveToAdminSettings(data);
      } else {
        // For regular admins, save to both profiles and admin_settings
        await saveToBothSources(data);
      }

      toast({
        title: "Profile updated",
        description: "Your profile information has been saved successfully.",
      });
    } catch (error: any) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveToAdminSettings = async (data: ProfileFormValues) => {
    const savePromises = [
      adminSettingsService.saveSetting('first_name', data.firstName, 'profile'),
      adminSettingsService.saveSetting('last_name', data.lastName, 'profile'),
      adminSettingsService.saveSetting('email', data.email, 'profile'),
      adminSettingsService.saveSetting('phone', data.phone || '', 'profile'),
      adminSettingsService.saveSetting('country_code', data.countryCode, 'profile'),
      adminSettingsService.saveSetting('street_address', data.streetAddress || '', 'profile'),
      adminSettingsService.saveSetting('city', data.city || '', 'profile'),
      adminSettingsService.saveSetting('state', data.state || '', 'profile'),
      adminSettingsService.saveSetting('zip_code', data.zipCode || '', 'profile'),
      adminSettingsService.saveSetting('country', data.country, 'profile')
    ];

    const results = await Promise.all(savePromises);
    const hasErrors = results.some(result => !result.success);

    if (hasErrors) {
      const errors = results.filter(r => !r.success).map(r => r.error).join(', ');
      throw new Error(errors);
    }
  };

  const saveToBothSources = async (data: ProfileFormValues) => {
    if (!adminUser) return;

    try {
      // Find the user profile using the admin's email
      const { data: authUsers, error: authError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', (await supabase.auth.getUser()).data.user?.id)
        .maybeSingle();

      // If we have a corresponding user profile, update it
      if (!authError && authUsers) {
        const profileUpdates = {
          first_name: data.firstName,
          last_name: data.lastName,
          phone: data.phone || '',
          country_code: data.countryCode,
          address_street_address: data.streetAddress || '',
          address_city: data.city || '',
          address_state: data.state || '',
          address_zip_code: data.zipCode || '',
          address_country_code: data.country,
          updated_at: new Date().toISOString()
        };

        const { error: profileError } = await supabase
          .from('profiles')
          .update(profileUpdates)
          .eq('id', authUsers.id);

        if (profileError) {
          console.error('Error updating profile:', profileError);
        }
      }
    } catch (error) {
      console.error('Error finding user profile:', error);
    }

    // Always save to admin settings for consistency
    await saveToAdminSettings(data);
  };

  if (isLoadingData) {
    return <ProfileFormSkeleton />;
  }

  if (!adminUser) {
    return <div className="flex items-center justify-center p-8">No admin user found. Please log in again.</div>;
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          <div className="space-y-6">
            <div className="flex flex-col gap-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <User className="h-5 w-5 text-pink-500" />
                  <h3 className="text-lg font-semibold">Personal Information</h3>
                </div>
                <p className="text-sm text-gray-500 mb-6">
                  {isSpeechHelpMaster 
                    ? 'Update your admin profile information'
                    : 'Update your personal information and contact details'
                  }
                </p>
                <PersonalInfoForm 
                  form={form}
                  originalEmail={originalEmail}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <ButtonCustom 
              variant="premium" 
              type="submit" 
              className="px-6"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </ButtonCustom>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AdminProfileSettings;