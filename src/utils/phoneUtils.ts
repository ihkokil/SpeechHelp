
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

// Enhanced function to detect country from phone number format
const detectCountryFromPhone = (phone: string): Country | undefined => {
  if (!phone) return undefined;
  
  const cleaned = phone.replace(/\D/g, '');
  
  // Try to match by phone number patterns and lengths
  // UK mobile numbers (starting with 07 and 11 digits total including country code)
  if (cleaned.match(/^(44)?7[0-9]{9}$/)) {
    return getCountryByCode('GB');
  }
  
  // French mobile numbers (starting with 06, 07 and 10 digits total)
  if (cleaned.match(/^(33)?[67][0-9]{8}$/) || cleaned.match(/^0[67][0-9]{8}$/)) {
    return getCountryByCode('FR');
  }
  
  // German mobile numbers (starting with 01 and 11-12 digits total)
  if (cleaned.match(/^(49)?1[5-7][0-9]{7,8}$/) || cleaned.match(/^01[5-7][0-9]{7,8}$/)) {
    return getCountryByCode('DE');
  }
  
  // Try to detect by checking if phone starts with common international codes
  for (const country of countriesComplete) {
    if (cleaned.startsWith(country.dialCode) && cleaned.length > country.dialCode.length) {
      const remainingDigits = cleaned.length - country.dialCode.length;
      // Basic validation: most countries have 7-10 digits after country code
      if (remainingDigits >= 7 && remainingDigits <= 10) {
        return country;
      }
    }
  }
  
  return undefined;
};

// Enhanced function to extract country code from database with smart detection
export const extractCountryCodeFromUser = (user: any): string => {
  console.log('🔍 Extracting country code for user:', {
    userId: user.id,
    email: user.email,
    profileCountryCode: user.country_code,
    userMetadataCountryCode: user.user_metadata?.country_code,
    userMetadataCountry: user.user_metadata?.country,
    phone: user.phone || user.user_metadata?.phone
  });

  // First, try to detect country from phone number if available
  const phone = user.phone || user.user_metadata?.phone;
  if (phone) {
    const detectedCountry = detectCountryFromPhone(phone);
    if (detectedCountry) {
      console.log('✅ Detected country from phone pattern:', phone, '->', detectedCountry.code);
      return detectedCountry.code;
    }
  }

  // Priority 1: Check profiles.country_code (main database field)
  if (user.country_code && user.country_code !== '' && user.country_code !== 'US') {
    console.log('✅ Found country code in profiles table:', user.country_code);
    return user.country_code;
  }
  
  // Priority 2: Check user_metadata.country_code (auth metadata)
  if (user.user_metadata?.country_code && user.user_metadata.country_code !== '') {
    console.log('✅ Found country code in user_metadata:', user.user_metadata.country_code);
    return user.user_metadata.country_code;
  }
  
  // Priority 3: Try to map country name to country code from user metadata
  const countryName = user.user_metadata?.country;
  if (countryName && countryName !== '') {
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
  
  // Priority 4: Default to US as final fallback
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

// Enhanced function to format phone with smart country detection
export const formatPhoneWithCountryCode = (phone: string, user: any): string => {
  if (!phone) return '—';
  
  console.log('📞 Formatting phone for user:', {
    userId: user.id,
    email: user.email,
    rawPhone: phone
  });
  
  try {
    // First try to detect country from phone number
    let countryCode = '';
    let country: Country | undefined;
    
    const detectedCountry = detectCountryFromPhone(phone);
    if (detectedCountry) {
      countryCode = detectedCountry.code;
      country = detectedCountry;
      console.log('✅ Using detected country from phone:', countryCode);
    } else {
      // Fall back to stored country code
      countryCode = extractCountryCodeFromUser(user);
      country = getCountryByCode(countryCode);
      console.log('✅ Using stored country code:', countryCode);
    }
    
    const dialCode = country?.dialCode || '1';
    
    // Clean the phone number - remove all non-numeric characters
    let cleanPhone = phone.replace(/\D/g, '');
    
    // Skip formatting if phone is too short
    if (cleanPhone.length < 7) {
      console.log('📋 Phone too short, returning as-is:', phone);
      return phone;
    }
    
    // Remove leading country code if it exists
    if (cleanPhone.startsWith(dialCode) && cleanPhone.length > dialCode.length) {
      cleanPhone = cleanPhone.substring(dialCode.length);
    }
    
    // Remove leading 1 for US/Canada numbers if present
    if ((countryCode === 'US' || countryCode === 'CA') && cleanPhone.startsWith('1') && cleanPhone.length === 11) {
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
