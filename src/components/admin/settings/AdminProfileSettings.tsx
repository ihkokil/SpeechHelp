
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload, User } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { adminSettingsService } from '@/services/adminSettingsService';

const AdminProfileSettings = () => {
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    avatar: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Load profile data on component mount
  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    setIsLoadingData(true);
    try {
      const result = await adminSettingsService.getSettings('profile');
      if (result.success && result.data) {
        const settings = result.data.reduce((acc, setting) => {
          acc[setting.setting_key] = setting.setting_value;
          return acc;
        }, {} as any);

        setProfileData({
          firstName: settings.first_name || '',
          lastName: settings.last_name || '',
          email: settings.email || '',
          avatar: settings.avatar || ''
        });
      }
    } catch (error) {
      console.error('Error loading profile data:', error);
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Create a preview URL for the uploaded image
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setProfileData(prev => ({
          ...prev,
          avatar: result
        }));
      };
      reader.readAsDataURL(file);
      
      toast({
        title: "Avatar uploaded",
        description: "Your avatar has been updated. Remember to save your changes.",
      });
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Save each profile setting
      const savePromises = [
        adminSettingsService.saveSetting('first_name', profileData.firstName, 'profile'),
        adminSettingsService.saveSetting('last_name', profileData.lastName, 'profile'),
        adminSettingsService.saveSetting('email', profileData.email, 'profile'),
        adminSettingsService.saveSetting('avatar', profileData.avatar, 'profile')
      ];

      const results = await Promise.all(savePromises);
      const hasErrors = results.some(result => !result.success);

      if (hasErrors) {
        const errors = results.filter(r => !r.success).map(r => r.error).join(', ');
        throw new Error(errors);
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

  const getInitials = () => {
    return `${profileData.firstName.charAt(0)}${profileData.lastName.charAt(0)}`.toUpperCase();
  };

  if (isLoadingData) {
    return <div className="flex items-center justify-center p-8">Loading profile data...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Avatar Upload Section */}
      <div className="flex items-center space-x-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={profileData.avatar} alt="Admin avatar" />
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

      {/* Profile Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            value={profileData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            placeholder="Enter your first name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            value={profileData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            placeholder="Enter your last name"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          value={profileData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          placeholder="Enter your email address"
        />
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
};

export default AdminProfileSettings;
