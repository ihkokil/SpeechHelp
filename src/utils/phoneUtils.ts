
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

// Enhanced function to extract country code from user metadata with multiple fallbacks
export const extractCountryCodeFromUser = (user: any): string => {
  console.log('🔍 Extracting country code for user:', {
    userId: user.id,
    email: user.email,
    userMetadataCountryCode: user.user_metadata?.country_code,
    profileCountryCode: user.country_code,
    userMetadataCountry: user.user_metadata?.country,
    rawMetadata: user.user_metadata
  });

  // Priority 1: Check user_metadata.country_code
  if (user.user_metadata?.country_code) {
    console.log('✅ Found country code in user_metadata:', user.user_metadata.country_code);
    return user.user_metadata.country_code;
  }
  
  // Priority 2: Check profiles.country_code (from the profiles table)
  if (user.country_code) {
    console.log('✅ Found country code in profiles table:', user.country_code);
    return user.country_code;
  }
  
  // Priority 3: Try to map country name to country code
  const countryName = user.user_metadata?.country;
  if (countryName) {
    console.log('🔍 Trying to map country name to code:', countryName);
    
    // Handle special cases first
    if (countryName.toLowerCase().includes('united kingdom') || 
        countryName.toLowerCase().includes('england') ||
        countryName.toLowerCase().includes('britain')) {
      console.log('✅ Mapped UK/England/Britain to GB');
      return 'GB';
    }
    
    // Try exact match first
    let country = countriesComplete.find(c => 
      c.name.toLowerCase() === countryName.toLowerCase()
    );
    
    // If no exact match, try partial match
    if (!country) {
      country = countriesComplete.find(c => 
        c.name.toLowerCase().includes(countryName.toLowerCase()) ||
        countryName.toLowerCase().includes(c.name.toLowerCase())
      );
    }
    
    if (country) {
      console.log('✅ Successfully mapped country name to code:', countryName, '->', country.code);
      return country.code;
    } else {
      console.log('❌ Could not map country name to code:', countryName);
    }
  }
  
  // Priority 4: Default to US
  console.log('⚠️ No country code found, defaulting to US for user:', user.email);
  return 'US';
};

// Enhanced function to format phone with proper country code and better error handling
export const formatPhoneWithCountryCode = (phone: string, user: any): string => {
  if (!phone) return '—';
  
  console.log('📞 Formatting phone for user:', {
    userId: user.id,
    email: user.email,
    rawPhone: phone
  });
  
  try {
    const countryCode = extractCountryCodeFromUser(user);
    const country = getCountryByCode(countryCode);
    const dialCode = country?.dialCode || '1';
    
    // Handle phone numbers that might already include country code
    let cleanPhone = phone;
    
    // If phone starts with +, remove it and any country code
    if (phone.startsWith('+')) {
      cleanPhone = phone.substring(1);
      // Remove common dial codes if they exist at the start
      if (cleanPhone.startsWith(dialCode)) {
        cleanPhone = cleanPhone.substring(dialCode.length);
      }
    }
    
    // Remove any leading country codes that might be there
    if (cleanPhone.startsWith(dialCode)) {
      cleanPhone = cleanPhone.substring(dialCode.length);
    }
    
    const formattedNumber = formatPhoneNumber(cleanPhone);
    const result = `+${dialCode} ${formattedNumber}`;
    
    console.log('✅ Phone formatting result:', {
      originalPhone: phone,
      countryCode,
      dialCode,
      cleanedPhone: cleanPhone,
      formattedResult: result
    });
    
    return result;
  } catch (error) {
    console.error('❌ Error formatting phone number:', error, {
      phone,
      userId: user.id,
      email: user.email
    });
    return phone; // Return the raw phone number as fallback
  }
};
