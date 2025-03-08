
import { UseFormReturn } from 'react-hook-form';
import { ProfileFormValues } from './types';
import NameFields from './components/NameFields';
import EmailField from './components/EmailField';
import PhoneFields from './components/PhoneFields';
import PasswordConfirmField from './components/PasswordConfirmField';

interface PersonalInfoFormProps {
  form: UseFormReturn<ProfileFormValues>;
  formattedPhone: string;
  selectedDialCode: string;
  handlePhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCountryCodeChange: (code: string) => void;
  originalEmail: string;
}

const PersonalInfoForm = ({
  form,
  formattedPhone,
  selectedDialCode,
  handlePhoneChange,
  handleCountryCodeChange,
  originalEmail
}: PersonalInfoFormProps) => {
  const currentEmail = form.watch('email');
  const isEmailChanged = currentEmail !== originalEmail;

  return (
    <>
      <NameFields form={form} />
      <EmailField form={form} />
      <PasswordConfirmField form={form} isEmailChanged={isEmailChanged} />
      <PhoneFields 
        form={form}
        formattedPhone={formattedPhone}
        selectedDialCode={selectedDialCode}
        handlePhoneChange={handlePhoneChange}
        handleCountryCodeChange={handleCountryCodeChange}
      />
    </>
  );
};

export default PersonalInfoForm;
