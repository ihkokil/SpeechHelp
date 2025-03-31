
import { User } from '../../types';
import { format } from 'date-fns';
import { formatPhoneNumber } from '@/components/settings/profile/utils/phoneUtils';
import countries from '@/data/countries';

export const formatDate = (dateString: string | null) => {
  if (!dateString) return 'Never';
  return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
};

export const getUserName = (user: User) => {
  return user.user_metadata?.full_name || 
         user.user_metadata?.name || 
         user.email?.split('@')[0] || 
         'Unknown';
};

export const getUserPhone = (user: User) => {
  const phone = user.user_metadata?.phone;
  if (!phone) return '—';
  
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
