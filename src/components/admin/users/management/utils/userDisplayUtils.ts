
import { User } from '../../types';

/**
 * Format user display name prioritizing profiles table data
 */
export const formatUserDisplayName = (user: User): string => {
  // Prioritize first_name and last_name from profiles table
  if (user.first_name && user.last_name) {
    return `${user.first_name} ${user.last_name}`;
  }
  
  if (user.first_name) {
    return user.first_name;
  }
  
  if (user.username) {
    return user.username;
  }
  
  // Fallback to email username
  return user.email?.split('@')[0] || 'Unknown User';
};

/**
 * Get user phone with proper formatting including country code
 */
export const getUserPhone = (user: User): string => {
  const phone = user.phone;
  const countryCode = user.country_code;
  
  if (!phone) {
    return '—';
  }
  
  // Get the dial code based on country code
  const dialCode = getDialCodeFromCountryCode(countryCode || 'US');
  
  // Format the phone number
  const cleanPhone = phone.replace(/\D/g, ''); // Remove non-digits
  
  if (cleanPhone.length === 0) {
    return '—';
  }
  
  // Format based on length for better readability
  let formattedPhone = cleanPhone;
  if (cleanPhone.length >= 10) {
    // Format as (XXX) XXX-XXXX for 10+ digit numbers
    formattedPhone = `(${cleanPhone.slice(-10, -7)}) ${cleanPhone.slice(-7, -4)}-${cleanPhone.slice(-4)}`;
  } else if (cleanPhone.length >= 7) {
    // Format as XXX-XXXX for 7-9 digit numbers
    formattedPhone = `${cleanPhone.slice(0, -4)}-${cleanPhone.slice(-4)}`;
  }
  
  return `${dialCode} ${formattedPhone}`;
};

/**
 * Get dial code from country code
 */
const getDialCodeFromCountryCode = (countryCode: string): string => {
  const countryDialCodes: Record<string, string> = {
    'US': '+1',
    'CA': '+1',
    'GB': '+44',
    'AU': '+61',
    'DE': '+49',
    'FR': '+33',
    'ES': '+34',
    'IT': '+39',
    'JP': '+81',
    'KR': '+82',
    'CN': '+86',
    'IN': '+91',
    'BR': '+55',
    'MX': '+52',
    'NL': '+31',
    'SE': '+46',
    'NO': '+47',
    'DK': '+45',
    'FI': '+358',
    'BD': '+880',
    'PK': '+92',
    'NG': '+234',
    'ZA': '+27',
    'EG': '+20',
    'TR': '+90',
    'RU': '+7',
    'UA': '+380',
    'PL': '+48',
    'CZ': '+420',
    'HU': '+36',
    'GR': '+30',
    'PT': '+351',
    'IE': '+353',
    'BE': '+32',
    'CH': '+41',
    'AT': '+43',
    'LU': '+352',
    'MT': '+356',
    'CY': '+357',
  };
  
  return countryDialCodes[countryCode] || '+1';
};

/**
 * Get country flag emoji based on country code
 */
export const getCountryFlag = (user: User): string => {
  const countryCode = user.country_code || 'US';
  
  const flagMap: Record<string, string> = {
    'US': '🇺🇸',
    'CA': '🇨🇦',
    'GB': '🇬🇧',
    'AU': '🇦🇺',
    'DE': '🇩🇪',
    'FR': '🇫🇷',
    'ES': '🇪🇸',
    'IT': '🇮🇹',
    'JP': '🇯🇵',
    'KR': '🇰🇷',
    'CN': '🇨🇳',
    'IN': '🇮🇳',
    'BR': '🇧🇷',
    'MX': '🇲🇽',
    'NL': '🇳🇱',
    'SE': '🇸🇪',
    'NO': '🇳🇴',
    'DK': '🇩🇰',
    'FI': '🇫🇮',
    'BD': '🇧🇩',
    'PK': '🇵🇰',
    'NG': '🇳🇬',
    'ZA': '🇿🇦',
    'EG': '🇪🇬',
    'TR': '🇹🇷',
    'RU': '🇷🇺',
    'UA': '🇺🇦',
    'PL': '🇵🇱',
    'CZ': '🇨🇿',
    'HU': '🇭🇺',
    'GR': '🇬🇷',
    'PT': '🇵🇹',
    'IE': '🇮🇪',
    'BE': '🇧🇪',
    'CH': '🇨🇭',
    'AT': '🇦🇹',
    'LU': '🇱🇺',
    'MT': '🇲🇹',
    'CY': '🇨🇾',
  };
  
  return flagMap[countryCode] || '🌍';
};

/**
 * Get user initials for avatar
 */
export const getUserInitials = (user: User): string => {
  if (user.first_name && user.last_name) {
    return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
  }
  
  if (user.first_name) {
    return user.first_name[0].toUpperCase();
  }
  
  if (user.email) {
    return user.email[0].toUpperCase();
  }
  
  return 'U';
};

/**
 * Format subscription status with proper styling
 */
export const formatSubscriptionStatus = (user: User): { text: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' } => {
  const plan = user.subscription_plan || 'free_trial';
  
  switch (plan.toLowerCase()) {
    case 'premium':
      return { text: 'Premium', variant: 'default' };
    case 'pro':
      return { text: 'Pro', variant: 'default' };
    case 'free_trial':
      return { text: 'Free Trial', variant: 'outline' };
    default:
      return { text: plan, variant: 'secondary' };
  }
};
