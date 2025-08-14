
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { ProfileFormValues } from '../types';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getAllCountries, getStatesForCountry } from '../utils/locationUtils';
import { countriesComplete } from '@/data/countriesComplete';

interface AddressFieldsProps {
  form: UseFormReturn<ProfileFormValues>;
}

const AddressFields = ({ form }: AddressFieldsProps) => {
  const countries = getAllCountries();
  const selectedCountryCode = form.watch('country');
  const statesForCountry = getStatesForCountry(selectedCountryCode || '');

  console.log('Current selected country code:', selectedCountryCode);
  console.log('Available states for country:', statesForCountry);

  // Get country flag by code
  const getCountryFlag = (countryCode: string) => {
    const countryWithFlag = countriesComplete.find(country => country.code === countryCode);
    return countryWithFlag?.flag || '🌍';
  };

  const handleCountryChange = (value: string, fieldOnChange: (value: string) => void) => {
    console.log('Country changed to:', value);
    // Call field.onChange first to update the form field immediately
    fieldOnChange(value);
    // Then clear the state field since country changed
    form.setValue('state', '');
    // Trigger form validation/update
    form.trigger('country');
  };

  const handleStateChange = (value: string, fieldOnChange: (value: string) => void) => {
    console.log('State changed to:', value);
    fieldOnChange(value);
    form.trigger('state');
  };

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
              onValueChange={(value) => handleCountryChange(value, field.onChange)}
              value={field.value || ''}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select country">
                    {field.value && (
                      <span className="flex items-center gap-2">
                        <span>{getCountryFlag(field.value)}</span>
                        <span>{countries.find(c => c.code === field.value)?.name}</span>
                      </span>
                    )}
                  </SelectValue>
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    <span className="flex items-center gap-2">
                      <span>{getCountryFlag(country.code)}</span>
                      <span>{country.name}</span>
                    </span>
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
                onValueChange={(value) => handleStateChange(value, field.onChange)}
                value={field.value || ''}
                key={`states-${selectedCountryCode}-${field.value}`}
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
