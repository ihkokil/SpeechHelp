import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { User, Mail, Phone, MapPin } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { AsYouType, CountryCode } from 'libphonenumber-js';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import countryData from '../../data/countries';
import statesProvinces from '../../data/statesProvinces';

const profileFormSchema = z.object({
  firstName: z.string().min(2, { message: 'First name must be at least 2 characters.' }),
  lastName: z.string().min(2, { message: 'Last name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  phone: z.string().optional(),
  countryCode: z.string().default('US'),
  streetAddress: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

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
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 w-full animate-pulse rounded-md bg-gray-200" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
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
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} tabIndex={1} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} tabIndex={2} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 text-gray-500 mr-2" />
                        <Input placeholder="name@example.com" {...field} tabIndex={3} />
                      </div>
                    </FormControl>
                    <FormDescription>
                      This email is associated with your account
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="countryCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Country Code</FormLabel>
                      <Select 
                        onValueChange={handleCountryCodeChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger tabIndex={4}>
                            <SelectValue placeholder="Select country code" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white">
                          {countryData.map((country) => (
                            <SelectItem key={country.code} value={country.code}>
                              +{country.dialCode} ({country.name})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field: { value, onChange, ...field } }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 text-gray-500 mr-2" />
                          <div className="flex items-center gap-2 w-full">
                            <div className="flex-shrink-0 w-16 text-right text-gray-500 font-medium">
                              +{selectedDialCode}
                            </div>
                            <Input 
                              placeholder="Phone number" 
                              value={formattedPhone}
                              onChange={handlePhoneChange}
                              className="flex-grow"
                              tabIndex={5}
                              {...field}
                            />
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="border-t pt-6 mt-6">
                <h3 className="font-medium text-gray-900 mb-4 flex items-center">
                  <MapPin className="h-4 w-4 text-pink-600 mr-2" />
                  Address Information
                </h3>
                
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country of Residence</FormLabel>
                        <Select 
                          onValueChange={handleCountryChange}
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger tabIndex={6}>
                              <SelectValue placeholder="Select country" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-white">
                            {countryData.map((country) => (
                              <SelectItem key={country.code} value={country.name}>
                                {country.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                
                  <FormField
                    control={form.control}
                    name="streetAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street Address</FormLabel>
                        <FormControl>
                          <Textarea placeholder="123 Main St, Apt 4B" {...field} tabIndex={7} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="San Francisco" {...field} tabIndex={8} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State / Province</FormLabel>
                          <Select 
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger tabIndex={9}>
                                <SelectValue placeholder="Select state/province" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-white max-h-60">
                              {availableStates.length > 0 ? (
                                availableStates.map((state) => (
                                  <SelectItem key={state.code} value={state.name}>
                                    {state.name}
                                  </SelectItem>
                                ))
                              ) : (
                                <SelectItem value="N/A">No states/provinces available</SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="zipCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ZIP / Postal Code</FormLabel>
                        <FormControl>
                          <Input placeholder="94103" {...field} tabIndex={10} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
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
