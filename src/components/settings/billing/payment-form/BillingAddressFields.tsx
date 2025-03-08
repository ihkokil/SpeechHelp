
import React, { useState, useEffect } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { PaymentFormValues } from './PaymentFormSchema';
import countryData from '@/data/countries';
import { StateProvince } from '@/data/statesProvinces';
import { getStatesForCountry } from '../utils/locationUtils';
import { getCountryByName } from '@/components/settings/profile/utils/locationUtils';

interface BillingAddressFieldsProps {
  form: UseFormReturn<PaymentFormValues>;
}

const BillingAddressFields: React.FC<BillingAddressFieldsProps> = ({ form }) => {
  const [states, setStates] = useState<StateProvince[]>([]);
  const selectedCountry = form.watch('billingCountry');
  
  useEffect(() => {
    if (selectedCountry) {
      const countryObj = getCountryByName(selectedCountry);
      if (countryObj) {
        const statesForCountry = getStatesForCountry(countryObj.code);
        setStates(statesForCountry);
        
        // Reset state if changing to a country without the current state
        const currentState = form.getValues('billingState');
        if (currentState && statesForCountry.length > 0 && !statesForCountry.some(s => s.name === currentState)) {
          form.setValue('billingState', '');
        }
      }
    }
  }, [selectedCountry, form]);

  return (
    <>
      <h3 className="text-lg font-medium border-t pt-6">Billing Address</h3>
      
      <FormField
        control={form.control}
        name="billingStreet"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Street Address</FormLabel>
            <FormControl>
              <Input placeholder="123 Main St" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="billingCity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input placeholder="San Francisco" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="billingCountry"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <Select 
                onValueChange={(value) => {
                  field.onChange(value);
                }}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger className="w-full focus:border-pink-500">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-white max-h-60">
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
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="billingState"
          render={({ field }) => (
            <FormItem>
              <FormLabel>State/Province</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                value={field.value}
                disabled={states.length === 0}
              >
                <FormControl>
                  <SelectTrigger className="w-full focus:border-pink-500">
                    <SelectValue placeholder={states.length === 0 ? "Select country first" : "Select state/province"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-white max-h-60 z-[150]">
                  {states.length > 0 ? (
                    states.map((state) => (
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
        
        <FormField
          control={form.control}
          name="billingZip"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ZIP/Postal Code</FormLabel>
              <FormControl>
                <Input placeholder="94105" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
};

export default BillingAddressFields;
