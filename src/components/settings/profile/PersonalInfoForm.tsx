
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Mail, Phone } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import countryData from '../../../data/countries';
import { ProfileFormValues } from './types';

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
    </>
  );
};

export default PersonalInfoForm;
