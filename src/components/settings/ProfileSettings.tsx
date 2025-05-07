
import { Card, CardContent } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { User, MapPin } from 'lucide-react';
import PersonalInfoForm from './profile/PersonalInfoForm';
import AddressForm from './profile/AddressForm';
import ProfileFormSkeleton from './profile/ProfileFormSkeleton';
import { useProfileForm } from './profile/useProfileForm';

const ProfileSettings = () => {
  const {
    form,
    isLoading,
    isSubmitting,
    originalEmail,
    formattedPhone,
    selectedDialCode,
    availableStates,
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
      <div>
        <h3 className="font-medium text-gray-900 mb-4 flex items-center">
          <User className="h-4 w-4 text-pink-600 mr-2" />
          Personal Information
        </h3>
        <p className="text-sm text-gray-500 mb-6">
          Update your personal information and contact details
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <PersonalInfoForm 
              form={form}
              formattedPhone={formattedPhone}
              selectedDialCode={selectedDialCode}
              handlePhoneChange={handlePhoneChange}
              handleCountryCodeChange={handleCountryCodeChange}
              originalEmail={originalEmail}
            />
            
            <div className="mt-8">
              <h3 className="font-medium text-gray-900 mb-4 flex items-center">
                <MapPin className="h-4 w-4 text-pink-600 mr-2" />
                Address Information
              </h3>
              
              <AddressForm 
                form={form}
                availableStates={availableStates}
                handleCountryChange={handleCountryChange}
              />
            </div>
            
            <div className="flex justify-end pt-4">
              <Button 
                type="submit" 
                className="bg-purple-600 hover:bg-purple-700 text-white" 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ProfileSettings;
