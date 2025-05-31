
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

// New function to get the preferred country for dial code 1 (defaults to US)
export const getPreferredCountryForDialCode = (dialCode: string): Country | undefined => {
  const normalizedDialCode = dialCode.toString().replace('+', '').trim();
  
  // For dial code 1, prefer US over Canada
  if (normalizedDialCode === '1') {
    return countriesComplete.find(country => country.code === 'US');
  }
  
  // For other dial codes, use the regular function
  return getCountryByDialCode(dialCode);
};

export const getAllCountries = (): Country[] => {
  return countriesComplete;
};

export const parsePhoneNumber = (phoneNumber: string, dialCode: string): { 
  country: Country | undefined, 
  formattedNumber: string 
} => {
  if (!phoneNumber) {
    return { country: undefined, formattedNumber: '' };
  }
  
  const country = getCountryByDialCode(dialCode);
  const cleaned = stripNonNumeric(phoneNumber);
  const formatted = formatPhoneNumber(cleaned);
  
  return { country, formattedNumber: formatted };
};

// Enhanced function to extract dial code from database (updated to work with dial codes)
export const extractDialCodeFromUser = (user: any): string => {
  console.log('🔍 Extracting dial code for user:', {
    userId: user.id,
    email: user.email,
    profileCountryCode: user.country_code,
    userMetadataCountryCode: user.user_metadata?.country_code,
    userMetadataCountry: user.user_metadata?.country
  });

  // Priority 1: Check if it's already a dial code (starts with + or is numeric)
  if (user.country_code && (user.country_code.startsWith('+') || /^\d+$/.test(user.country_code))) {
    const dialCode = user.country_code.replace('+', '');
    console.log('✅ Found dial code in profiles table:', dialCode);
    return dialCode;
  }
  
  // Priority 2: Check user_metadata for dial code
  if (user.user_metadata?.country_code && (user.user_metadata.country_code.startsWith('+') || /^\d+$/.test(user.user_metadata.country_code))) {
    const dialCode = user.user_metadata.country_code.replace('+', '');
    console.log('✅ Found dial code in user_metadata:', dialCode);
    return dialCode;
  }
  
  // Priority 3: Try to convert country code to dial code
  if (user.country_code && user.country_code !== '') {
    const country = getCountryByCode(user.country_code);
    if (country) {
      console.log('✅ Converted country code to dial code:', user.country_code, '->', country.dialCode);
      return country.dialCode;
    }
  }
  
  // Priority 4: Try user_metadata country code
  if (user.user_metadata?.country_code && user.user_metadata.country_code !== '') {
    const country = getCountryByCode(user.user_metadata.country_code);
    if (country) {
      console.log('✅ Converted user_metadata country code to dial code:', user.user_metadata.country_code, '->', country.dialCode);
      return country.dialCode;
    }
  }
  
  // Priority 5: Try to map country name to dial code
  const countryName = user.user_metadata?.country;
  if (countryName && countryName !== '') {
    console.log('🔍 Trying to map country name to dial code:', countryName);
    
    // Handle special cases first
    if (countryName.toLowerCase().includes('united kingdom') || 
        countryName.toLowerCase().includes('england') ||
        countryName.toLowerCase().includes('britain')) {
      console.log('✅ Mapped UK/England/Britain to +44');
      return '44';
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
      console.log('✅ Successfully mapped country name to dial code:', countryName, '->', country.dialCode);
      return country.dialCode;
    } else {
      console.log('❌ Could not map country name to dial code:', countryName);
    }
  }
  
  // Priority 6: Default to US dial code as final fallback
  console.log('⚠️ No dial code found, defaulting to US (+1) for user:', user.email);
  return '1';
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
    const dialCode = extractDialCodeFromUser(user);
    
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

