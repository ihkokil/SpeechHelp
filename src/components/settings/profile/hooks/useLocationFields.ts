
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
  
  // For debugging
  useEffect(() => {
    if (selectedState) {
      console.log('Selected state changed in form:', selectedState);
    }
  }, [selectedState]);
  
  // Update available states when country changes
  useEffect(() => {
    const countryEntry = getCountryByName(selectedCountry);
    if (countryEntry) {
      const states = getStatesForCountry(countryEntry.code);
      setAvailableStates(states);
      
      // Clear state if it's invalid for the new country and there are states available
      const currentState = getValues('state');
      if (currentState && !isStateValidForCountry(currentState, states) && states.length > 0) {
        setValue('state', '');
      }
    } else {
      setAvailableStates([]);
    }
  }, [selectedCountry, setValue, getValues]);
  
  const handleCountryChange = (countryName: string) => {
    console.log('Setting country to:', countryName);
    setValue('country', countryName);
    
    // Update country code to match the selected country
    const countryEntry = getCountryByName(countryName);
    if (countryEntry) {
      setValue('countryCode', countryEntry.code);
      
      // Update available states
      const states = getStatesForCountry(countryEntry.code);
      setAvailableStates(states);
      
      // Clear state if it's invalid for the new country
      const currentState = getValues('state');
      if (currentState && !isStateValidForCountry(currentState, states) && states.length > 0) {
        setValue('state', '');
      }
    }
  };
  
  return {
    availableStates,
    handleCountryChange
  };
};
