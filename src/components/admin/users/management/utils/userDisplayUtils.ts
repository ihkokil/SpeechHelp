import { User } from '../../types';
import { format, formatDistanceToNow } from 'date-fns';
import { getCountryByCode, getAllCountries } from '@/utils/phoneUtils';

export const formatDate = (dateString: string | null) => {
  if (!dateString) return 'Never';
  try {
    return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
  } catch (error) {
    return 'Invalid date';
  }
};

export const formatDateRelative = (dateString: string | null) => {
  if (!dateString) return 'Never';
  try {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  } catch (error) {
    return 'Invalid date';
  }
};

// New function for detailed date-time formatting
export const formatDateTimeDetailed = (dateString: string | null) => {
  if (!dateString) return 'Never';
  try {
    return format(new Date(dateString), 'MMM dd, yyyy • HH:mm');
  } catch (error) {
    return 'Invalid date';
  }
};

// Helper function to safely extract string values
const safeString = (value: any): string => {
  if (typeof value === 'string') return value.trim();
  if (value === null || value === undefined) return '';
  return String(value).trim();
};

// Helper function to construct full name from first and last name
const constructFullName = (firstName: string, lastName: string): string => {
  const first = safeString(firstName);
  const last = safeString(lastName);
  if (first && last) {
    return `${first} ${last}`;
  }
  if (first) return first;
  if (last) return last;
  return '';
};

export const getUserName = (user: User) => {
  // Prioritize profiles table first_name and last_name
  const firstName = safeString(user.first_name);
  const lastName = safeString(user.last_name);
  
  // Try to construct from profile first_name and last_name
  let fullName = constructFullName(firstName, lastName);
  
  // If no profile data, try user_metadata as fallback
  if (!fullName) {
    const metaFirstName = safeString(user.user_metadata?.first_name);
    const metaLastName = safeString(user.user_metadata?.last_name);
    fullName = constructFullName(metaFirstName, metaLastName);
  }
  
  // If still no name, fallback to user_metadata full_name or name
  if (!fullName && user.user_metadata?.full_name) {
    fullName = safeString(user.user_metadata.full_name);
  }
  
  if (!fullName && user.user_metadata?.name) {
    fullName = safeString(user.user_metadata.name);
  }
  
  // Final fallback to email
  if (!fullName && user.email) {
    return user.email.split('@')[0];
  }
  
  return fullName || 'Unknown User';
};

export const formatUserDisplayName = (user: User) => {
  return getUserName(user);
};

// Enhanced phone number formatting using profiles table data
export const getUserPhone = (user: User) => {
  console.log('📱 Getting user phone from profiles table:', {
    userId: user.id,
    email: user.email,
    profilePhone: user.phone,
    profileCountryCode: user.country_code
  });
  
  // Get phone directly from profiles table
  const phone = safeString(user.phone);
  
  if (!phone) {
    console.log('📱 No phone found for user:', user.email);
    return '—';
  }
  
  // Get country code from profiles table and ensure it's uppercase
  const countryCode = safeString(user.country_code).toUpperCase();
  
  console.log('📱 Processing country code:', {
    originalCountryCode: user.country_code,
    processedCountryCode: countryCode
  });
  
  if (countryCode) {
    // Get country data for dial code
    const country = getCountryByCode(countryCode);
    console.log('📱 Country lookup result:', {
      countryCode,
      country,
      dialCode: country?.dialCode,
      flag: country?.flag
    });
    
    if (country?.dialCode) {
      const formattedPhone = `+${country.dialCode} ${phone}`;
      console.log('📱 Final formatted phone:', formattedPhone);
      return formattedPhone;
    } else {
      console.log('📱 No country found for code:', countryCode);
    }
  }
  
  // Return phone as-is if no country code or country not found
  console.log('📱 Returning phone without country code:', phone);
  return phone;
};

// Simple country flag URL getter (keeping this for potential future use)
export const getCountryFlagUrl = (countryCode: string | undefined) => {
  if (!countryCode) return '';
  
  if (countryCode === 'England') return 'https://flagcdn.com/w20/gb.png';
  
  return `https://flagcdn.com/w20/${countryCode.toLowerCase()}.png`;
};

// Get country flag emoji from profiles table
export const getCountryFlag = (user: User) => {
  console.log('🏳️ Getting country flag for user:', {
    userId: user.id,
    email: user.email,
    profileCountryCode: user.country_code
  });
  
  // Get country code directly from profiles table and ensure it's uppercase
  const countryCode = safeString(user.country_code).toUpperCase();
  
  console.log('🏳️ Processing country code for flag:', {
    originalCountryCode: user.country_code,
    processedCountryCode: countryCode
  });
  
  if (!countryCode) {
    console.log('🏳️ No country code found, using default flag');
    return '🌍';
  }
  
  // Look up country by code
  const country = getCountryByCode(countryCode);
  
  console.log('🏳️ Country flag lookup result:', {
    countryCode,
    country,
    flag: country?.flag
  });
  
  if (country?.flag) {
    console.log('🏳️ Found country flag:', {
      countryCode,
      countryName: country.name,
      flag: country.flag
    });
    return country.flag;
  }
  
  console.log('🏳️ Country not found in lookup, using default flag:', countryCode);
  return '🌍';
};
