
import { Form } from '@/components/ui/form';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import AddressForm from './profile/AddressForm';
import PersonalInfoForm from './profile/PersonalInfoForm';
import { useProfileForm } from './profile/useProfileForm';
import { ButtonCustom } from '@/components/ui/button-custom';
import ProfileFormSkeleton from './profile/ProfileFormSkeleton';
import { MapPin, User } from 'lucide-react';

export default function ProfileSettings() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("personal");
  
  const {
    form,
    formattedPhone,
    selectedDialCode,
    availableStates,
    isLoading,
    originalEmail,
    handlePhoneChange,
    handleCountryCodeChange,
    handleCountryChange,
    onSubmit
  } = useProfileForm();

  if (isLoading) {
    return <ProfileFormSkeleton />;
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-6">
            <div className="flex flex-col gap-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <User className="h-5 w-5 text-pink-500" />
                  <h3 className="text-lg font-semibold">Personal Information</h3>
                </div>
                <p className="text-sm text-gray-500 mb-6">Update your personal information and contact details</p>
                <PersonalInfoForm 
                  form={form}
                  formattedPhone={formattedPhone}
                  selectedDialCode={selectedDialCode}
                  handlePhoneChange={handlePhoneChange}
                  handleCountryCodeChange={handleCountryCodeChange}
                  originalEmail={originalEmail}
                />
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="h-5 w-5 text-pink-500" />
                  <h3 className="text-lg font-semibold">Address Information</h3>
                </div>
                <p className="text-sm text-gray-500 mb-6">Update your address information</p>
                <AddressForm 
                  form={form} 
                  availableStates={availableStates}
                  handleCountryChange={handleCountryChange}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <ButtonCustom 
              variant="premium" 
              type="submit" 
              className="px-6"
            >
              Save Changes
            </ButtonCustom>
          </div>
        </form>
      </Form>
    </div>
  );
}
