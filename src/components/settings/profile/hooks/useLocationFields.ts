
import { useState, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { StateProvince } from '@/data/statesProvinces';
import { getCountryByName, getStatesForCountry, isStateValidForCountry } from '../utils/locationUtils';
import { ProfileFormValues } from '../types';

export const useLocationFields = (form: UseFormReturn<ProfileFormValues>) => {
  const [availableStates, setAvailableStates] = useState<StateProvince[]>([]);
  
  const { watch, setValue, getValues } = form;
  const selectedCountry = watch('country');
  const selectedState = watch('state');
  
  // Update available states when country changes
  useEffect(() => {
    const countryEntry = getCountryByName(selectedCountry);
    if (countryEntry) {
      console.log('Getting states for country:', countryEntry.code);
      const states = getStatesForCountry(countryEntry.code);
      setAvailableStates(states);
      
      // Check if current state is valid for the selected country
      const currentState = getValues('state');
      if (currentState) {
        console.log('Current state value:', currentState);
        const isValid = isStateValidForCountry(currentState, states);
        
        // Only clear state if it's invalid AND there are states available for this country
        if (!isValid && states.length > 0) {
          console.log('Clearing invalid state:', currentState);
          setValue('state', '', { shouldDirty: true, shouldTouch: true });
        } else {
          console.log('Keeping valid state:', currentState);
        }
      }
    } else {
      setAvailableStates([]);
    }
  }, [selectedCountry, setValue, getValues]);
  
  // Debug selected state changes
  useEffect(() => {
    console.log('Current state value in form:', selectedState);
  }, [selectedState]);
  
  const handleCountryChange = (countryName: string) => {
    console.log('Setting country to:', countryName);
    setValue('country', countryName, { shouldDirty: true, shouldTouch: true });
    
    // Update country code to match the selected country
    const countryEntry = getCountryByName(countryName);
    if (countryEntry) {
      setValue('countryCode', countryEntry.code, { shouldDirty: true, shouldTouch: true });
      
      // Update available states
      const states = getStatesForCountry(countryEntry.code);
      setAvailableStates(states);
      
      // Only clear state if it's invalid AND there are states available
      const currentState = getValues('state');
      if (currentState && !isStateValidForCountry(currentState, states) && states.length > 0) {
        console.log('Clearing invalid state after country change:', currentState);
        setValue('state', '', { shouldDirty: true, shouldTouch: true });
      }
    }
  };
  
  return {
    availableStates,
    handleCountryChange
  };
};
