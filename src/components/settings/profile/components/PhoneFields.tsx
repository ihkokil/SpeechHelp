
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Phone } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import countryData from '@/data/countries';
import { ProfileFormValues } from '../types';

interface PhoneFieldsProps {
  form: UseFormReturn<ProfileFormValues>;
  formattedPhone: string;
  selectedDialCode: string;
  handlePhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCountryCodeChange: (code: string) => void;
}

const PhoneFields = ({
  form,
  formattedPhone,
  selectedDialCode,
  handlePhoneChange,
  handleCountryCodeChange
}: PhoneFieldsProps) => {
  return (
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
  );
};

export default PhoneFields;
