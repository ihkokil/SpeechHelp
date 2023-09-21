
import { AsYouType, CountryCode } from 'libphonenumber-js';

export const formatPhoneNumber = (phone: string, countryCode: string): string => {
  if (!phone) return '';
  
  try {
    const formatter = new AsYouType(countryCode as CountryCode);
    return formatter.input(phone);
  } catch (error) {
    console.error('Error formatting phone number:', error);
    return phone;
  }
};

export const stripNonNumeric = (value: string): string => {
  return value.replace(/\D/g, '');
};
