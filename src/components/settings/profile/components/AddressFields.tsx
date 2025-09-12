
import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { ProfileFormValues } from '../types';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getAllCountries, getStatesForCountry } from '../utils/locationUtils';

interface AddressFieldsProps {
  form: UseFormReturn<ProfileFormValues>;
}

const AddressFields = ({ form }: AddressFieldsProps) => {
  const [countryOpen, setCountryOpen] = useState(false);
  const [stateOpen, setStateOpen] = useState(false);
  
  const countries = getAllCountries();
  const selectedCountryCode = form.watch('country');
  const statesForCountry = getStatesForCountry(selectedCountryCode || '');

  console.log('🏠 AddressFields - Current selected country code:', selectedCountryCode);
  console.log('🏠 AddressFields - Available states for country:', statesForCountry);

  const handleCountryChange = (value: string) => {
    console.log('🏠 Address country changing to:', value);
    
    // Update country field
    form.setValue('country', value, { shouldValidate: true, shouldDirty: true });
    
    // Clear state field when country changes
    form.setValue('state', '', { shouldValidate: true, shouldDirty: true });
    
    // Trigger validation for both fields
    form.trigger(['country', 'state']);
    
    setCountryOpen(false);
  };

  const handleStateChange = (value: string) => {
    console.log('🏠 State changing to:', value);
    form.setValue('state', value, { shouldValidate: true, shouldDirty: true });
    form.trigger('state');
    setStateOpen(false);
  };

  // Enhanced field change handlers to ensure consistent data saving
  const handleAddressFieldChange = (fieldName: string, value: string) => {
    console.log(`🏠 AddressFields - ${fieldName} changed to:`, value);
    form.setValue(fieldName as keyof ProfileFormValues, value, { 
      shouldValidate: true, 
      shouldDirty: true 
    });
  };

  const selectedCountry = countries.find(c => c.code === selectedCountryCode);
  const selectedState = statesForCountry.find(s => s.code === form.watch('state'));

  return (
    <div className="space-y-4">
      {/* Country Selection - First Field */}
      <FormField
        control={form.control}
        name="country"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Country</FormLabel>
            <Popover open={countryOpen} onOpenChange={setCountryOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={countryOpen}
                    className="w-full justify-between text-black hover:text-black"
                  >
                    {selectedCountry ? (
                      <span className="flex items-center gap-2 text-black">
                        <span>{selectedCountry.flag}</span>
                        <span>{selectedCountry.name}</span>
                      </span>
                    ) : (
                      <span className="text-gray-500">Select country...</span>
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command>
                  <CommandInput 
                    placeholder="Search countries..." 
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck="false"
                  />
                  <CommandList>
                    <CommandEmpty>No country found.</CommandEmpty>
                    <CommandGroup>
                      {countries.map((country) => (
                        <CommandItem
                          key={country.code}
                          value={`${country.name} ${country.code}`}
                          onSelect={() => handleCountryChange(country.code)}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedCountryCode === country.code ? "opacity-100" : "opacity-0"
                            )}
                          />
                          <span className="flex items-center gap-2">
                            <span>{country.flag}</span>
                            <span>{country.name}</span>
                          </span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
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
                onChange={(e) => {
                  field.onChange(e);
                  handleAddressFieldChange('streetAddress', e.target.value);
                }}
                autoComplete="off"
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
                onChange={(e) => {
                  field.onChange(e);
                  handleAddressFieldChange('city', e.target.value);
                }}
                autoComplete="off"
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
            <FormItem className="flex flex-col">
              <FormLabel>State / Province</FormLabel>
              <Popover open={stateOpen} onOpenChange={setStateOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={stateOpen}
                      className="w-full justify-between text-black hover:text-black"
                    >
                      {selectedState ? (
                        <span className="text-black">{selectedState.name}</span>
                      ) : (
                        <span className="text-gray-500">Select state / province...</span>
                      )}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput 
                      placeholder="Search states..." 
                      autoComplete="off"
                      autoCorrect="off"
                      spellCheck="false"
                    />
                    <CommandList>
                      <CommandEmpty>No state found.</CommandEmpty>
                      <CommandGroup>
                        {statesForCountry.map((state) => (
                          <CommandItem
                            key={`${selectedCountryCode}-${state.code}`}
                            value={`${state.name} ${state.code}`}
                            onSelect={() => handleStateChange(state.code)}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                form.watch('state') === state.code ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {state.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
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
                onChange={(e) => {
                  field.onChange(e);
                  handleAddressFieldChange('zipCode', e.target.value);
                }}
                autoComplete="off"
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
