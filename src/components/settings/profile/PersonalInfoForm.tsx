
import { UseFormReturn } from 'react-hook-form';
import { ProfileFormValues } from './types';
import NameFields from './components/NameFields';
import EmailField from './components/EmailField';
import PasswordConfirmField from './components/PasswordConfirmField';
import AddressFields from './components/AddressFields';
import PhoneInput from '@/components/ui/phone-input';
import { MapPin } from 'lucide-react';

interface PersonalInfoFormProps {
  form: UseFormReturn<ProfileFormValues>;
  originalEmail: string;
}

const PersonalInfoForm = ({ form, originalEmail }: PersonalInfoFormProps) => {
  // Watch the email field to detect changes
  const currentEmail = form.watch('email');
  const isEmailChanged = currentEmail !== originalEmail;

  console.log('PersonalInfoForm - originalEmail:', originalEmail);
  console.log('PersonalInfoForm - currentEmail:', currentEmail);
  console.log('PersonalInfoForm - isEmailChanged:', isEmailChanged);

  return (
    <div className="space-y-8">
      <div className="space-y-6">
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
