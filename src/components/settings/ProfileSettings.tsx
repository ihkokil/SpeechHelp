
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import AddressForm from './profile/AddressForm';
import PersonalInfoForm from './profile/PersonalInfoForm';
import { useProfileForm } from './profile/useProfileForm';
import ProfileFormSkeleton from './profile/ProfileFormSkeleton';

const profileFormSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

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

  return (
    <div className="space-y-6">
      {isLoading ? (
        <ProfileFormSkeleton />
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Tabs defaultValue="personal" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Profile Settings</CardTitle>
                      <CardDescription>
                        Manage your personal information and address
                      </CardDescription>
                    </div>
                    <TabsList>
                      <TabsTrigger value="personal">Personal</TabsTrigger>
                      <TabsTrigger value="address">Address</TabsTrigger>
                    </TabsList>
                  </div>
                </CardHeader>
                <CardContent>
                  <TabsContent value="personal">
                    <PersonalInfoForm 
                      form={form}
                      formattedPhone={formattedPhone}
                      selectedDialCode={selectedDialCode}
                      handlePhoneChange={handlePhoneChange}
                      handleCountryCodeChange={handleCountryCodeChange}
                      originalEmail={originalEmail}
                    />
                  </TabsContent>
                  <TabsContent value="address">
                    <AddressForm 
                      form={form} 
                      availableStates={availableStates}
                      handleCountryChange={handleCountryChange}
                    />
                  </TabsContent>
                </CardContent>
              </Card>
            </Tabs>

            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-[#b84c9f] px-6 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#a3428e] transition-all"
              >
                Save Changes
              </button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}
