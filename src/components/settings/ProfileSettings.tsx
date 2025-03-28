
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';
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
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center">
            <User className="h-5 w-5 mr-2 text-pink-600" />
            Personal Information
          </CardTitle>
          <CardDescription>
            Update your personal information and contact details
          </CardDescription>
        </CardHeader>
        <CardContent>
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
              
              <AddressForm 
                form={form}
                availableStates={availableStates}
                handleCountryChange={handleCountryChange}
              />
              
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSettings;
