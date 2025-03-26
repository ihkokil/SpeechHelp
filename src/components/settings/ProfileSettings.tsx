
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { AsYouType, CountryCode } from 'libphonenumber-js';
import countryData from '../../data/countries';
import statesProvinces from '../../data/statesProvinces';
import { profileFormSchema, ProfileFormValues } from './profile/types';
import PersonalInfoForm from './profile/PersonalInfoForm';
import AddressForm from './profile/AddressForm';
import ProfileFormSkeleton from './profile/ProfileFormSkeleton';

const ProfileSettings = () => {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formattedPhone, setFormattedPhone] = useState('');
  const [availableStates, setAvailableStates] = useState<typeof statesProvinces['US']>([]);
  const [selectedDialCode, setSelectedDialCode] = useState('1');

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: user?.user_metadata?.first_name || '',
      lastName: user?.user_metadata?.last_name || '',
      email: user?.email || '',
      phone: user?.user_metadata?.phone || '',
      countryCode: user?.user_metadata?.country_code || 'US',
      streetAddress: user?.user_metadata?.street_address || '',
      city: user?.user_metadata?.city || '',
      state: user?.user_metadata?.state || '',
      zipCode: user?.user_metadata?.zip_code || '',
      country: user?.user_metadata?.country || 'United States',
    },
  });

  const { watch, setValue } = form;
  const currentPhone = watch('phone');
  const countryCode = watch('countryCode');
  const selectedCountry = watch('country');

  useEffect(() => {
    const countryEntry = countryData.find(c => c.name === selectedCountry);
    if (countryEntry) {
      const states = statesProvinces[countryEntry.code] || [];
      setAvailableStates(states);
      
      if (form.getValues('state') && states.length > 0 && !states.some(s => s.name === form.getValues('state'))) {
        form.setValue('state', '');
      }
    } else {
      setAvailableStates([]);
    }
  }, [selectedCountry, form]);

  useEffect(() => {
    const countryEntry = countryData.find(c => c.code === countryCode);
    if (countryEntry) {
      setSelectedDialCode(countryEntry.dialCode);
    }
  }, [countryCode]);

  useEffect(() => {
    if (currentPhone) {
      try {
        const formatter = new AsYouType(countryCode as CountryCode);
        const formatted = formatter.input(currentPhone);
        setFormattedPhone(formatted);
      } catch (error) {
        console.error('Error formatting phone number:', error);
        setFormattedPhone(currentPhone);
      }
    } else {
      setFormattedPhone('');
    }
  }, [currentPhone, countryCode]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = e.target.value.replace(/\D/g, '');
    setValue('phone', numericValue);
  };

  const handleCountryCodeChange = (code: string) => {
    setValue('countryCode', code);
    const countryEntry = countryData.find(c => c.code === code);
    if (countryEntry) {
      setSelectedDialCode(countryEntry.dialCode);
    }
  };

  const handleCountryChange = (countryName: string) => {
    form.setValue('country', countryName);
  };

  const onSubmit = async (data: ProfileFormValues) => {
    setIsSubmitting(true);
    try {
      console.log('Updated profile data:', data);
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update failed",
        description: "There was a problem updating your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <ProfileFormSkeleton />;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
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
                  tabIndex={11}
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
