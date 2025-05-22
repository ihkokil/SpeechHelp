
import { UseFormReturn } from 'react-hook-form';
import { ProfileFormValues } from './types';
import NameFields from './components/NameFields';
import EmailField from './components/EmailField';
import PasswordConfirmField from './components/PasswordConfirmField';
import AvatarUpload from './components/AvatarUpload';
import PhoneInput from '@/components/ui/phone-input';

interface PersonalInfoFormProps {
  form: UseFormReturn<ProfileFormValues>;
  originalEmail: string;
  avatarUrl?: string;
  onAvatarChange: (url: string) => void;
}

const PersonalInfoForm = ({ 
  form, 
  originalEmail, 
  avatarUrl, 
  onAvatarChange 
}: PersonalInfoFormProps) => {
  // Watch the email field to detect changes
  const currentEmail = form.watch('email');
  const isEmailChanged = currentEmail !== originalEmail;

  // Watch name fields for avatar initials
  const firstName = form.watch('firstName');
  const lastName = form.watch('lastName');

  return (
    <div className="space-y-6">
      <AvatarUpload
        avatarUrl={avatarUrl}
        onAvatarChange={onAvatarChange}
        firstName={firstName}
        lastName={lastName}
      />
      <NameFields form={form} />
      <EmailField form={form} />
      <PasswordConfirmField form={form} isEmailChanged={isEmailChanged} />
      <PhoneInput 
        form={form}
        phoneFieldName="phone"
        countryFieldName="countryCode"
        label="Phone Number"
        placeholder="Enter your phone number"
      />
    </div>
  );
};

export default PersonalInfoForm;
