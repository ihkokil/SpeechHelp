
import { User } from '../../types';
import { format, formatDistanceToNow } from 'date-fns';
import { formatPhoneWithCountryCode, getCountryByCode, extractCountryCodeFromUser } from '@/utils/phoneUtils';

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
  // Always prioritize first_name and last_name from the user object (profile data)
  const firstName = safeString(user.first_name);
  const lastName = safeString(user.last_name);
  
  // Try to construct from profile first_name and last_name
  let fullName = constructFullName(firstName, lastName);
  
  // If no profile data, try user_metadata
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

export const getUserPhone = (user: User) => {
  const phone = user.user_metadata?.phone || user.phone;
  if (!phone) return '—';
  
  // Use the improved phone formatting function
  return formatPhoneWithCountryCode(phone, user);
};

export const getCountryFlagUrl = (countryCode: string | undefined) => {
  if (!countryCode) return '';
  
  if (countryCode === 'England') return 'https://flagcdn.com/w20/gb.png';
  
  return `https://flagcdn.com/w20/${countryCode.toLowerCase()}.png`;
};

export const getCountryCode = (user: User) => {
  return extractCountryCodeFromUser(user);
};

// New function to get country flag emoji
export const getCountryFlag = (user: User) => {
  const countryCode = extractCountryCodeFromUser(user);
  const country = getCountryByCode(countryCode);
  return country?.flag || '🌍';
};
