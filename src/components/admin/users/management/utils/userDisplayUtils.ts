
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
 * Get user phone with proper formatting
 */
export const getUserPhone = (user: User): string | null => {
  return user.phone || null;
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
