
import { User } from '../../types';
import { format, formatDistanceToNow } from 'date-fns';
import { formatPhoneWithCountryCode, getCountryByCode, extractCountryCodeFromUser, getPhoneFromDatabase } from '@/utils/phoneUtils';

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

// Enhanced function to get user phone from profiles table
export const getUserPhone = (user: User) => {
  console.log('📋 Getting phone for user in admin table:', {
    userId: user.id,
    email: user.email,
    profilePhone: user.phone,
    countryCode: user.country_code,
    metadataPhone: user.user_metadata?.phone
  });
  
  // Get phone and country code directly from profiles table fields
  const phone = safeString(user.phone);
  const countryCode = safeString(user.country_code);
  
  if (!phone) {
    console.log('📋 No phone found in profiles for user:', user.email);
    return '—';
  }
  
  // Format phone with country code if available
  if (countryCode && countryCode !== '') {
    // If country code doesn't start with +, add it
    const formattedCountryCode = countryCode.startsWith('+') ? countryCode : `+${countryCode}`;
    return `${formattedCountryCode} ${phone}`;
  }
  
  return phone;
};

export const getCountryFlagUrl = (countryCode: string | undefined) => {
  if (!countryCode) return '';
  
  if (countryCode === 'England') return 'https://flagcdn.com/w20/gb.png';
  
  return `https://flagcdn.com/w20/${countryCode.toLowerCase()}.png`;
};

export const getCountryCode = (user: User) => {
  return safeString(user.country_code);
};

// Function to get country flag emoji
export const getCountryFlag = (user: User) => {
  const countryCode = safeString(user.country_code);
  
  // If we have a country code, try to get the flag
  if (countryCode) {
    const country = getCountryByCode(countryCode);
    return country?.flag || '🌍';
  }
  
  return '🌍';
};
