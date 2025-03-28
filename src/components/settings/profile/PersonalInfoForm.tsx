
import { UseFormReturn } from 'react-hook-form';
import { ProfileFormValues } from './types';
import NameFields from './components/NameFields';
import EmailField from './components/EmailField';
import PhoneFields from './components/PhoneFields';

interface PersonalInfoFormProps {
  form: UseFormReturn<ProfileFormValues>;
  formattedPhone: string;
  selectedDialCode: string;
  handlePhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCountryCodeChange: (code: string) => void;
}

const PersonalInfoForm = ({
  form,
  formattedPhone,
  selectedDialCode,
  handlePhoneChange,
  handleCountryCodeChange
}: PersonalInfoFormProps) => {
  return (
    <>
      <NameFields form={form} />
      <EmailField form={form} />
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
