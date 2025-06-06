
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
  console.log('🔍 getCountryByCode called with:', { code, type: typeof code });
  
  if (!code) {
    console.log('❌ No code provided to getCountryByCode');
    return undefined;
  }
  
  // Ensure code is uppercase for consistent matching
  const normalizedCode = code.toUpperCase().trim();
  console.log('🔍 Normalized code:', normalizedCode);
  
  const result = countriesComplete.find(country => {
    const countryCode = country.code.toUpperCase().trim();
    const match = countryCode === normalizedCode;
    if (match) {
      console.log('✅ Found matching country:', {
        searchCode: normalizedCode,
        foundCountry: country
      });
    }
    return match;
  });
  
  if (!result) {
    console.log('❌ No country found for code:', normalizedCode);
  }
  
  return result;
};

export const getCountryByDialCode = (dialCode: string): Country | undefined => {
  console.log('🔍 getCountryByDialCode called with:', { dialCode, type: typeof dialCode });
  
  if (!dialCode) {
    console.log('❌ No dial code provided to getCountryByDialCode');
    return undefined;
  }
  
  // Remove + if present and ensure it's a string
  const normalizedDialCode = dialCode.toString().replace('+', '').trim();
  console.log('🔍 Normalized dial code:', normalizedDialCode);
  
  const result = countriesComplete.find(country => {
    const countryDialCode = country.dialCode.toString().trim();
    const match = countryDialCode === normalizedDialCode;
    if (match) {
      console.log('✅ Found matching country by dial code:', {
        searchDialCode: normalizedDialCode,
        foundCountry: country
      });
    }
    return match;
  });
  
  if (!result) {
    console.log('❌ No country found for dial code:', normalizedDialCode);
  }
  
  return result;
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

// Enhanced function to extract country code from database (now returns country codes like US, CA)
export const extractCountryCodeFromUser = (user: any): string => {
  console.log('🔍 Extracting country code for user:', {
    userId: user.id,
    email: user.email,
    profileCountryCode: user.country_code,
    userMetadataCountryCode: user.user_metadata?.country_code,
    userMetadataCountry: user.user_metadata?.country
  });

  // Priority 1: Check if it's already a country code (2-letter code like US, CA)
  if (user.country_code && /^[A-Z]{2}$/i.test(user.country_code)) {
    const countryCode = user.country_code.toUpperCase();
    console.log('✅ Found country code in profiles table:', countryCode);
    return countryCode;
  }
  
  // Priority 2: Check user_metadata for country code
  if (user.user_metadata?.country_code && /^[A-Z]{2}$/i.test(user.user_metadata.country_code)) {
    const countryCode = user.user_metadata.country_code.toUpperCase();
    console.log('✅ Found country code in user_metadata:', countryCode);
    return countryCode;
  }
  
  // Priority 3: Check if it's a dial code and convert to country code
  if (user.country_code && (user.country_code.startsWith('+') || /^\d+$/.test(user.country_code))) {
    const dialCode = user.country_code.replace('+', '');
    const country = getCountryByDialCode(dialCode);
    if (country) {
      console.log('✅ Converted dial code to country code:', dialCode, '->', country.code);
      return country.code;
    }
  }
  
  // Priority 4: Try user_metadata dial code
  if (user.user_metadata?.country_code && (user.user_metadata.country_code.startsWith('+') || /^\d+$/.test(user.user_metadata.country_code))) {
    const dialCode = user.user_metadata.country_code.replace('+', '');
    const country = getCountryByDialCode(dialCode);
    if (country) {
      console.log('✅ Converted user_metadata dial code to country code:', dialCode, '->', country.code);
      return country.code;
    }
  }
  
  // Priority 5: Try to map country name to country code
  const countryName = user.user_metadata?.country;
  if (countryName && countryName !== '') {
    console.log('🔍 Trying to map country name to country code:', countryName);
    
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
      console.log('✅ Successfully mapped country name to country code:', countryName, '->', country.code);
      return country.code;
    } else {
      console.log('❌ Could not map country name to country code:', countryName);
    }
  }
  
  // Priority 6: Default to US country code as final fallback
  console.log('⚠️ No country code found, defaulting to US for user:', user.email);
  return 'US';
};

// Enhanced function to get phone number directly from database fields
export const getPhoneFromDatabase = (user: any): string => {
  console.log('📞 Getting phone from database for user:', {
    userId: user.id,
    email: user.email,
    profilePhone: user.phone,
    metadataPhone: user.user_metadata?.phone
  });

  // Priority 1: Check profiles.phone (main database field)
  if (user.phone && user.phone !== '') {
    console.log('✅ Found phone in profiles table:', user.phone);
    return user.phone;
  }

  // Priority 2: Check user_metadata.phone (auth metadata fallback)
  if (user.user_metadata?.phone && user.user_metadata.phone !== '') {
    console.log('✅ Found phone in user_metadata:', user.user_metadata.phone);
    return user.user_metadata.phone;
  }

  console.log('❌ No phone found in database for user:', user.email);
  return '';
};

// Enhanced function to format phone with proper dial code from database
export const formatPhoneWithDialCode = (phone: string, user: any): string => {
  if (!phone) return '—';
  
  console.log('📞 Formatting phone for user:', {
    userId: user.id,
    email: user.email,
    rawPhone: phone
  });
  
  try {
    const countryCode = extractCountryCodeFromUser(user);
    const country = getCountryByCode(countryCode);
    
    if (!country) {
      console.log('❌ Could not find country for code:', countryCode);
      return phone;
    }
    
    const dialCode = country.dialCode;
    
    // Clean the phone number - remove all non-numeric characters
    let cleanPhone = phone.replace(/\D/g, '');
    
    // Skip formatting if phone is too short
    if (cleanPhone.length < 7) {
      console.log('📋 Phone too short, returning as-is:', phone);
      return phone;
    }
    
    // Remove leading dial code if it exists
    if (cleanPhone.startsWith(dialCode) && cleanPhone.length > dialCode.length) {
      cleanPhone = cleanPhone.substring(dialCode.length);
    }
    
    // Remove leading 1 for US/Canada numbers if present
    if (dialCode === '1' && cleanPhone.startsWith('1') && cleanPhone.length === 11) {
      cleanPhone = cleanPhone.substring(1);
    }
    
    // Format the clean phone number
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
