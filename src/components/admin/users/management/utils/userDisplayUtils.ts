import { User } from '../../types';
import { format, formatDistanceToNow } from 'date-fns';
import { getCountryByDialCode, getAllCountries } from '@/utils/phoneUtils';

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

// Simplified phone number formatting - just return the raw phone number
export const getUserPhone = (user: User) => {
  console.log('📱 Getting user phone (simplified):', {
    userId: user.id,
    email: user.email,
    profilePhone: user.phone
  });
  
  // Get phone directly from profiles table
  const phone = safeString(user.phone);
  
  if (!phone) {
    console.log('📱 No phone found for user:', user.email);
    return '—';
  }
  
  console.log('📱 Returning raw phone:', phone);
  return phone;
};

// Simple country flag URL getter (keeping this for potential future use)
export const getCountryFlagUrl = (countryCode: string | undefined) => {
  if (!countryCode) return '';
  
  if (countryCode === 'England') return 'https://flagcdn.com/w20/gb.png';
  
  return `https://flagcdn.com/w20/${countryCode.toLowerCase()}.png`;
};

// Get country flag emoji from profiles table using dial codes
export const getCountryFlag = (user: User) => {
  console.log('🏳️ Getting country flag for user:', {
    userId: user.id,
    email: user.email,
    profileCountryCode: user.country_code
  });
  
  // Get dial code directly from profiles table
  const dialCode = safeString(user.country_code);
  
  console.log('🏳️ Processing dial code for flag:', {
    originalValue: user.country_code,
    processedValue: dialCode
  });
  
  if (!dialCode) {
    console.log('🏳️ No dial code found, using default flag');
    return '🌍';
  }
  
  // Clean the dial code (remove any + prefix)
  const cleanDialCode = dialCode.replace('+', '');
  
  // Look up the country by dial code
  const country = getCountryByDialCode(cleanDialCode);
  
  console.log('🏳️ Dial code lookup result:', {
    dialCode: cleanDialCode,
    country,
    flag: country?.flag
  });
  
  if (country?.flag) {
    console.log('🏳️ Found country flag:', {
      dialCode: cleanDialCode,
      countryName: country.name,
      flag: country.flag
    });
    return country.flag;
  }
  
  console.log('🏳️ Country not found in lookup, using default flag:', cleanDialCode);
  return '🌍';
};
