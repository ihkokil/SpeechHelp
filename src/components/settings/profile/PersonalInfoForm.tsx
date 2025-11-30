
import { UseFormReturn } from 'react-hook-form';
import { ProfileFormValues } from './types';
import NameFields from './components/NameFields';
import EmailField from './components/EmailField';
import PasswordConfirmField from './components/PasswordConfirmField';
import AddressFields from './components/AddressFields';
import PhoneInput from '@/components/ui/phone-input';
import { AvatarDisplay } from '@/components/ui/avatar-display';
import { AvatarUploadControls } from './components/AvatarUploadControls';
import { MapPin, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

interface PersonalInfoFormProps {
  form: UseFormReturn<ProfileFormValues>;
  originalEmail: string;
}

const PersonalInfoForm = ({ form, originalEmail }: PersonalInfoFormProps) => {
  const { user, profile, refreshUser } = useAuth();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  // Watch the email field to detect changes
  const currentEmail = form.watch('email');
  const isEmailChanged = currentEmail !== originalEmail;

  const handleAvatarChange = (avatarUrl: string | null) => {
    // Refresh user data to reflect the change across the app
    refreshUser();
  };

  const getUserInitials = () => {
    const firstName = form.watch('firstName');
    const lastName = form.watch('lastName');
    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    }
    return user?.email?.charAt(0).toUpperCase() || 'U';
  };

  return (
    <div className="space-y-8">
      {/* Profile Picture Section */}
      <div className="space-y-4">
        <div className="flex items-start gap-6">
          {/* Avatar Image on the left */}
          <div className="flex-shrink-0">
            <AvatarDisplay
              currentAvatarUrl={profile?.avatar_url}
              previewUrl={previewUrl}
              size="md"
              initials={getUserInitials()}
              isUploading={isUploading}
            />
          </div>
          
          {/* Upload controls and text on the right */}
          <div className="flex-1 space-y-3">
            <div>
              <p className="text-sm text-gray-600">JPG, PNG or GIF. Max size 2MB.</p>
            </div>
            <AvatarUploadControls
              currentAvatarUrl={profile?.avatar_url}
              onAvatarChange={handleAvatarChange}
              onPreviewChange={setPreviewUrl}
              onUploadingChange={setIsUploading}
            />
          </div>
        </div>
      </div>

      <div className="space-y-6 border-t pt-6">
        <NameFields form={form} />
        <EmailField form={form} disabled={false} />
        <PasswordConfirmField form={form} isEmailChanged={isEmailChanged} />
        <PhoneInput 
          form={form}
          phoneFieldName="phone"
          countryFieldName="countryCode"
          label="Phone Number"
          placeholder="Enter your phone number"
        />
      </div>

      {/* Address Section */}
      <div className="border-t pt-6">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="h-5 w-5 text-pink-500" />
          <h4 className="text-lg font-medium">Address Information</h4>
        </div>
        <p className="text-sm text-gray-500 mb-6">
          Add your address information for billing and delivery purposes
        </p>
        <AddressFields form={form} />
      </div>
    </div>
  );
};

export default PersonalInfoForm;
