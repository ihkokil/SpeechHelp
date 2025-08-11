
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { ProfileFormValues } from '../types';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getAllCountries, getStatesForCountry } from '../utils/locationUtils';

interface AddressFieldsProps {
  form: UseFormReturn<ProfileFormValues>;
}

const AddressFields = ({ form }: AddressFieldsProps) => {
  const countries = getAllCountries();
  const selectedCountryCode = form.watch('country');
  const statesForCountry = getStatesForCountry(selectedCountryCode);

  // Clear state when country changes
  React.useEffect(() => {
    form.setValue('state', '');
  }, [selectedCountryCode, form]);

  return (
    <div className="space-y-4">
      {/* Country Selection - First Field */}
      <FormField
        control={form.control}
        name="country"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Country</FormLabel>
            <Select onValueChange={field.onChange} value={field.value || ''}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
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
              <Input
                {...field}
                placeholder="Enter your street address"
                value={field.value || ''}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Enter your city"
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="zipCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ZIP/Postal Code</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Enter ZIP/postal code"
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* State/Province Field - Only show if country has states */}
      {statesForCountry.length > 0 && (
        <FormField
          control={form.control}
          name="state"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {selectedCountryCode === 'CA' ? 'Province' : 'State'}
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value || ''}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={`Select ${selectedCountryCode === 'CA' ? 'province' : 'state'}`} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {statesForCountry.map((state) => (
                    <SelectItem key={state.code} value={state.code}>
                      {state.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
};

export default AddressFields;
