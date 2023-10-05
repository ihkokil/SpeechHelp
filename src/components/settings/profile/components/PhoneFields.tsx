
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
              onValueChange={(value) => {
                console.log('Country code changed to:', value);
                handleCountryCodeChange(value);
                field.onChange(value);
              }}
              value={field.value || 'US'}
              defaultValue={field.value || 'US'}
            >
              <FormControl>
                <div className="relative">
                  <SelectTrigger 
                    className="w-full pl-10" 
                    data-focus-visible="true"
                  >
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                      <Phone className="h-4 w-4 text-gray-500" />
                    </div>
                    <SelectValue placeholder="Select Country / Associated Phone Code" />
                  </SelectTrigger>
                </div>
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
              <div className="relative flex items-center">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <Phone className="h-4 w-4 text-gray-500" />
                </div>
                <div className="flex items-center w-full">
                  <div className="pl-10 pr-2 py-2 border rounded-l-md bg-gray-50 text-gray-500 font-medium min-w-[60px] text-center">
                    +{selectedDialCode}
                  </div>
                  <Input 
                    placeholder="Phone number" 
                    value={formattedPhone}
                    onChange={handlePhoneChange}
                    className="flex-grow rounded-l-none"
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
