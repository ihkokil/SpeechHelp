
import { UseFormReturn } from 'react-hook-form';
import { ProfileFormValues } from './types';
import NameFields from './components/NameFields';
import EmailField from './components/EmailField';
import PasswordConfirmField from './components/PasswordConfirmField';
import AddressFields from './components/AddressFields';
import PhoneInput from '@/components/ui/phone-input';
import { AvatarUpload } from '@/components/ui/avatar-upload';
import { MapPin, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface PersonalInfoFormProps {
  form: UseFormReturn<ProfileFormValues>;
  originalEmail: string;
}

const PersonalInfoForm = ({ form, originalEmail }: PersonalInfoFormProps) => {
  const { user, profile, refreshUser } = useAuth();
  
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
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-pink-500" />
          <h4 className="text-lg font-medium">Profile Picture</h4>
        </div>
        <p className="text-sm text-gray-500">
          Upload a profile picture to personalize your account
        </p>
        <div className="flex justify-center">
          <AvatarUpload
            currentAvatarUrl={profile?.avatar_url}
            onAvatarChange={handleAvatarChange}
            size="lg"
            initials={getUserInitials()}
          />
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
