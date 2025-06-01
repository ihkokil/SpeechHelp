
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload, User } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { adminSettingsService } from '@/services/adminSettingsService';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import PhoneInput from '@/components/ui/phone-input';
import * as z from 'zod';

const adminProfileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  countryCode: z.string().default('US'),
});

type AdminProfileFormValues = z.infer<typeof adminProfileSchema>;

const AdminProfileSettings = () => {
  const [avatar, setAvatar] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const { adminUser } = useAdminAuth();

  const form = useForm<AdminProfileFormValues>({
    resolver: zodResolver(adminProfileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      countryCode: 'US',
    },
  });

  // Load profile data on component mount
  useEffect(() => {
    loadProfileData();
  }, [adminUser]);

  const loadProfileData = async () => {
    setIsLoadingData(true);
    try {
      if (adminUser) {
        console.log('Loading profile data for admin user:', adminUser);
        
        // First, populate with data from the current admin user
        const nameParts = adminUser.username.split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        form.reset({
          firstName,
          lastName,
          email: adminUser.email,
          phone: '',
          countryCode: 'US',
        });

        // Then, load any additional settings from the database
        console.log('Fetching admin settings from database...');
        const result = await adminSettingsService.getSettings('profile');
        console.log('Admin settings result:', result);
        
        if (result.success && result.data) {
          const settings = result.data.reduce((acc, setting) => {
            acc[setting.setting_key] = setting.setting_value;
            return acc;
          }, {} as any);

          console.log('Loaded settings:', settings);

          // Update form with database values if they exist
          form.reset({
            firstName: settings.first_name || firstName,
            lastName: settings.last_name || lastName,
            email: settings.email || adminUser.email,
            phone: settings.phone || '',
            countryCode: settings.country_code || 'US',
          });

          setAvatar(settings.avatar || '');
        } else if (result.error) {
          console.warn('Failed to load admin settings:', result.error);
        }
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

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Create a preview URL for the uploaded image
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setAvatar(result);
      };
      reader.readAsDataURL(file);
      
      toast({
        title: "Avatar uploaded",
        description: "Your avatar has been updated. Remember to save your changes.",
      });
    }
  };

  const handleSave = async (data: AdminProfileFormValues) => {
    setIsLoading(true);
    try {
      if (!adminUser) {
        throw new Error('No admin user found');
      }

      console.log('Saving admin profile data:', data);
      console.log('Current admin user:', adminUser);

      // Save each profile setting to the database
      const savePromises = [
        adminSettingsService.saveSetting('first_name', data.firstName, 'profile'),
        adminSettingsService.saveSetting('last_name', data.lastName, 'profile'),
        adminSettingsService.saveSetting('email', data.email, 'profile'),
        adminSettingsService.saveSetting('phone', data.phone || '', 'profile'),
        adminSettingsService.saveSetting('country_code', data.countryCode, 'profile'),
        adminSettingsService.saveSetting('avatar', avatar, 'profile')
      ];

      console.log('Executing save promises...');
      const results = await Promise.all(savePromises);
      console.log('Save results:', results);
      
      const hasErrors = results.some(result => !result.success);

      if (hasErrors) {
        const errors = results.filter(r => !r.success).map(r => r.error).join(', ');
        console.error('Save errors:', errors);
        throw new Error(errors);
      }
      
      console.log('All settings saved successfully');
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

  const getInitials = () => {
    const firstName = form.watch('firstName');
    const lastName = form.watch('lastName');
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  if (isLoadingData) {
    return <div className="flex items-center justify-center p-8">Loading profile data...</div>;
  }

  if (!adminUser) {
    return <div className="flex items-center justify-center p-8">No admin user found. Please log in again.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Avatar Upload Section */}
      <div className="flex items-center space-x-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={avatar} alt="Admin avatar" />
          <AvatarFallback className="text-lg">
            {getInitials() || <User className="h-8 w-8" />}
          </AvatarFallback>
        </Avatar>
        <div>
          <Label htmlFor="avatar-upload" className="cursor-pointer">
            <Button variant="outline" className="cursor-pointer" asChild>
              <span>
                <Upload className="h-4 w-4 mr-2" />
                Upload Avatar
              </span>
            </Button>
          </Label>
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarUpload}
          />
          <p className="text-sm text-muted-foreground mt-1">
            JPG, PNG or GIF. Max size 2MB.
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSave)} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                {...form.register('firstName')}
                placeholder="Enter your first name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                {...form.register('lastName')}
                placeholder="Enter your last name"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              {...form.register('email')}
              placeholder="Enter your email address"
            />
          </div>

          <PhoneInput 
            form={form}
            phoneFieldName="phone"
            countryFieldName="countryCode"
            label="Phone Number"
            placeholder="Enter your phone number"
          />

          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AdminProfileSettings;
