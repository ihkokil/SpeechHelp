
import { UseFormReturn } from 'react-hook-form';
import { ProfileFormValues } from './types';
import NameFields from './components/NameFields';
import EmailField from './components/EmailField';
import PasswordConfirmField from './components/PasswordConfirmField';
import PhoneInput from '@/components/ui/phone-input';

interface PersonalInfoFormProps {
  form: UseFormReturn<ProfileFormValues>;
  originalEmail: string;
}

const PersonalInfoForm = ({ form, originalEmail }: PersonalInfoFormProps) => {
  // Watch the email field to detect changes
  const currentEmail = form.watch('email');
  const isEmailChanged = currentEmail !== originalEmail;

  return (
    <div className="space-y-6">
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
