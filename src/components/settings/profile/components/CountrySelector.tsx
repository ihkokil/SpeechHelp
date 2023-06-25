
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import countryData from '@/data/countries';
import { ProfileFormValues } from '../types';

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
          <Select 
            onValueChange={(value) => {
              handleCountryChange(value);
              field.onChange(value);
            }}
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
  );
};

export default CountrySelector;
