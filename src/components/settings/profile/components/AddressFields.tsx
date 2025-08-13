
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
  const statesForCountry = getStatesForCountry(selectedCountryCode || '');

  // Clear state when country changes
  React.useEffect(() => {
    if (selectedCountryCode) {
      form.setValue('state', '');
    }
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
            <Select 
              onValueChange={(value) => {
                field.onChange(value);
                // Also clear the state field when country changes
                form.setValue('state', '');
              }} 
              value={field.value || ''}
            >
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

      {/* Street Address - Second Field */}
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

      {/* City - Third Field */}
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

      {/* State/Province Field - Fourth Field (Only show if country has states) */}
      {statesForCountry.length > 0 && (
        <FormField
          control={form.control}
          name="state"
          render={({ field }) => (
            <FormItem>
              <FormLabel>State / Province</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                value={field.value || ''}
                key={selectedCountryCode} // Force re-render when country changes
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select state / province" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {statesForCountry.map((state) => (
                    <SelectItem key={`${selectedCountryCode}-${state.code}`} value={state.code}>
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

      {/* ZIP/Postal Code - Fifth Field */}
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
  );
};

export default AddressFields;
