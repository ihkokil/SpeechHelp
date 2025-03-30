
import { AsYouType, CountryCode, parsePhoneNumber } from 'libphonenumber-js';

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

/**
 * Attempts to extract a country code from a phone number string
 * @param phoneNumber The phone number to extract the country code from
 * @returns The country code as a string, or null if it couldn't be determined
 */
export const getCountryCodeFromPhoneNumber = (phoneNumber: string): string | null => {
  if (!phoneNumber) return null;
  
  try {
    // Try to parse the phone number (defaults to international format)
    const parsedNumber = parsePhoneNumber(phoneNumber);
    if (parsedNumber && parsedNumber.country) {
      return parsedNumber.country;
    }
    
    // If we can't parse it with libphonenumber-js, default to null
    return null;
  } catch (error) {
    console.error('Error extracting country code from phone number:', error);
    return null;
  }
};
