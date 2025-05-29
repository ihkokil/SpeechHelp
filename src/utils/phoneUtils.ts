
import { countriesComplete } from '@/data/countriesComplete';

export interface Country {
  name: string;
  code: string;
  dialCode: string;
  flag: string;
}

export const formatPhoneNumber = (phone: string): string => {
  if (!phone) return '';
  
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format based on length
  if (cleaned.length <= 3) {
    return cleaned;
  } else if (cleaned.length <= 6) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
  } else if (cleaned.length <= 10) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  } else {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
  }
};

export const stripNonNumeric = (value: string): string => {
  return value.replace(/\D/g, '');
};

export const getCountryByCode = (code: string): Country | undefined => {
  return countriesComplete.find(country => country.code === code);
};

export const getCountryByDialCode = (dialCode: string): Country | undefined => {
  return countriesComplete.find(country => country.dialCode === dialCode);
};

export const getAllCountries = (): Country[] => {
  return countriesComplete;
};

export const parsePhoneNumber = (phoneNumber: string, countryCode: string): { 
  country: Country | undefined, 
  formattedNumber: string 
} => {
  if (!phoneNumber) {
    return { country: undefined, formattedNumber: '' };
  }
  
  const country = getCountryByCode(countryCode);
  const cleaned = stripNonNumeric(phoneNumber);
  const formatted = formatPhoneNumber(cleaned);
  
  return { country, formattedNumber: formatted };
};
