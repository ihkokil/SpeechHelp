import { User } from '../../types';
import { format, formatDistanceToNow } from 'date-fns';
import { formatPhoneNumber } from '@/components/settings/profile/utils/phoneUtils';
import countries from '@/data/countries';

export const formatDate = (dateString: string | null) => {
  if (!dateString) return 'Never';
  return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
};

export const formatDateRelative = (dateString: string | null) => {
  if (!dateString) return 'Never';
  try {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  } catch (error) {
    return 'Invalid date';
  }
};

export const formatUserName = (user: User) => {
  const firstName = user.user_metadata?.first_name || '';
  const lastName = user.user_metadata?.last_name || '';
  
  if (firstName && lastName) {
    return `${firstName} ${lastName}`;
  }
  
  if (user.user_metadata?.full_name) {
    return user.user_metadata.full_name;
  }
  
  if (user.user_metadata?.name) {
    return user.user_metadata.name;
  }
  
  if (user.email) {
    return `${user.email.split('@')[0]} (No name provided)`;
  }
  
  return 'No name provided';
};

export const formatDateTimeForDisplay = (dateString: string) => {
  if (!dateString) return 'Never';
  try {
    return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};

export const getUserName = (user: User) => {
  const firstName = user.user_metadata?.first_name || '';
  const lastName = user.user_metadata?.last_name || '';
  
  if (firstName && lastName) {
    return `${firstName} ${lastName}`;
  }
  
  if (user.user_metadata?.full_name) {
    return user.user_metadata.full_name;
  }
  
  if (user.user_metadata?.name) {
    return user.user_metadata.name;
  }
  
  if (user.email) {
    return `${user.email.split('@')[0]} (No name provided)`;
  }
  
  return 'No name provided';
};

export const formatUserDisplayName = (user: User) => {
  return getUserName(user);
};

export const getUserPhone = (user: User) => {
  const phone = user.user_metadata?.phone;
  if (!phone) return '—';
  
  try {
    const countryCode = user.user_metadata?.country_code || 'US';
    
    let dialCode = '1';
    
    const formattedNumber = formatPhoneNumber(phone, countryCode);
    
    if (countryCode && countryCode !== 'US') {
      const country = countries.find((c: any) => c.code === countryCode);
      if (country) {
        dialCode = country.dialCode;
      }
    }
    
    return `+${dialCode} ${formattedNumber}`;
  } catch (error) {
    console.error('Error formatting phone number:', error);
    return phone; // Return the raw phone number as fallback
  }
};

export const getCountryFlagUrl = (countryCode: string | undefined) => {
  if (!countryCode) return '';
  
  if (countryCode === 'England') return 'https://flagcdn.com/w20/gb.png';
  
  return `https://flagcdn.com/w20/${countryCode.toLowerCase()}.png`;
};

export const getCountryCode = (user: User) => {
  const countryCode = user.user_metadata?.country_code;
  
  if (user.user_metadata?.country === 'United Kingdom' || 
      user.user_metadata?.country === 'England' || 
      user.user_metadata?.state === 'England') {
    return 'GB';
  }
  
  return countryCode;
};
