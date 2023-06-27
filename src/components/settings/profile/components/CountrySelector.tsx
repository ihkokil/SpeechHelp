
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import countryData from '@/data/countries';
import { ProfileFormValues } from '../types';
import { Globe } from 'lucide-react';

interface CountrySelectorProps {
  form: UseFormReturn<ProfileFormValues>;
  handleCountryChange: (countryName: string) => void;
}

const CountrySelector = ({ form, handleCountryChange }: CountrySelectorProps) => {
  return (
    <FormField
      control={form.control}
      name="country"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Country of Residence</FormLabel>
          <FormControl>
            <div className="flex items-center">
              <Globe className="h-4 w-4 text-gray-500 mr-2" />
              <Select 
                onValueChange={(value) => {
                  console.log('Country changed to:', value);
                  handleCountryChange(value);
                  field.onChange(value);
                }}
                value={field.value || ''}
                defaultValue={field.value || ''}
              >
                <SelectTrigger className="w-full" tabIndex={6}>
                  <SelectValue placeholder="Select Country of Residence" />
                </SelectTrigger>
                <SelectContent className="bg-white max-h-60">
                  {countryData.map((country) => (
                    <SelectItem key={country.code} value={country.name}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CountrySelector;
