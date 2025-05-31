
import { useState, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { formatPhoneNumber, stripNonNumeric } from '../utils/phoneUtils';
import { getCountryByCode } from '../utils/locationUtils';
import { ProfileFormValues } from '../types';

export const usePhoneInput = (form: UseFormReturn<ProfileFormValues>) => {
  const [formattedPhone, setFormattedPhone] = useState('');
  const [selectedDialCode, setSelectedDialCode] = useState('1');
  
  const { watch, setValue } = form;
  const currentPhone = watch('phone');
  const countryCode = watch('countryCode');
  
  // Format phone number when it changes
  useEffect(() => {
    if (currentPhone) {
      setFormattedPhone(formatPhoneNumber(currentPhone, countryCode));
    } else {
      setFormattedPhone('');
    }
  }, [currentPhone, countryCode]);
  
  // Update dial code when country code changes
  useEffect(() => {
    const countryEntry = getCountryByCode(countryCode);
    if (countryEntry) {
      setSelectedDialCode(countryEntry.dialCode);
    }
  }, [countryCode]);
  
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = stripNonNumeric(e.target.value);
    setValue('phone', numericValue);
  };
  
  const handleCountryCodeChange = (code: string) => {
    setValue('countryCode', code);
    const countryEntry = getCountryByCode(code);
    if (countryEntry) {
      setSelectedDialCode(countryEntry.dialCode);
    }
  };
  
  return {
    formattedPhone,
    selectedDialCode,
    handlePhoneChange,
    handleCountryCodeChange
  };
};
