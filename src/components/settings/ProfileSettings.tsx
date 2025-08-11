
import { Form } from '@/components/ui/form';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import PersonalInfoForm from './profile/PersonalInfoForm';
import { useProfileForm } from './profile/useProfileForm';
import { ButtonCustom } from '@/components/ui/button-custom';
import ProfileFormSkeleton from './profile/ProfileFormSkeleton';
import { User } from 'lucide-react';

export default function ProfileSettings() {
  const { toast } = useToast();
  
  const {
    form,
    isLoading,
    originalEmail,
    onSubmit
  } = useProfileForm();

  if (isLoading) {
    return <ProfileFormSkeleton />;
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-8">
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
                  originalEmail={originalEmail}
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
