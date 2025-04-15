
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

// New function to extract country code from user metadata
export const extractCountryCodeFromUser = (user: any): string => {
  // Check various sources for country code
  if (user.user_metadata?.country_code) {
    return user.user_metadata.country_code;
  }
  
  if (user.country_code) {
    return user.country_code;
  }
  
  // Check if country name is provided and try to map it
  const countryName = user.user_metadata?.country;
  if (countryName) {
    const country = countriesComplete.find(c => 
      c.name.toLowerCase() === countryName.toLowerCase() ||
      c.name.toLowerCase().includes(countryName.toLowerCase())
    );
    if (country) {
      return country.code;
    }
  }
  
  // Default to US if no country code found
  return 'US';
};

// New function to format phone with proper country code
export const formatPhoneWithCountryCode = (phone: string, user: any): string => {
  if (!phone) return '—';
  
  try {
    const countryCode = extractCountryCodeFromUser(user);
    const country = getCountryByCode(countryCode);
    const dialCode = country?.dialCode || '1';
    const formattedNumber = formatPhoneNumber(phone);
    
    return `+${dialCode} ${formattedNumber}`;
  } catch (error) {
    console.error('Error formatting phone number:', error);
    return phone; // Return the raw phone number as fallback
  }
};
