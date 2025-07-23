
import { format } from 'date-fns';

export const getSpeechTypeLabel = (speechType: string) => {
  const labels: Record<string, string> = {
    wedding: 'Wedding',
    business: 'Business',
    birthday: 'Birthday',
    graduation: 'Graduation',
    funeral: 'Funeral',
    motivational: 'Motivational',
    informative: 'Informative',
    entertaining: 'Entertaining',
    persuasive: 'Persuasive',
    introduction: 'Introduction',
    farewell: 'Farewell',
    award: 'Award',
    retirement: 'Retirement',
    keynote: 'Keynote',
    tedtalk: 'TED Talk',
    social: 'Social',
    other: 'Other'
  };
  
  return labels[speechType] || speechType.charAt(0).toUpperCase() + speechType.slice(1);
};

export const getSpeechTypeColor = (speechType: string) => {
  const colors: Record<string, string> = {
    wedding: 'bg-pink-100 text-pink-800',
    business: 'bg-blue-100 text-blue-800',
    birthday: 'bg-yellow-100 text-yellow-800',
    graduation: 'bg-green-100 text-green-800',
    funeral: 'bg-gray-100 text-gray-800',
    motivational: 'bg-purple-100 text-purple-800',
    informative: 'bg-indigo-100 text-indigo-800',
    entertaining: 'bg-orange-100 text-orange-800',
    persuasive: 'bg-red-100 text-red-800',
    introduction: 'bg-teal-100 text-teal-800',
    farewell: 'bg-amber-100 text-amber-800',
    award: 'bg-emerald-100 text-emerald-800',
    retirement: 'bg-slate-100 text-slate-800',
    keynote: 'bg-violet-100 text-violet-800',
    tedtalk: 'bg-cyan-100 text-cyan-800',
    social: 'bg-lime-100 text-lime-800',
    other: 'bg-neutral-100 text-neutral-800'
  };
  
  return colors[speechType] || colors.other;
};

export const formatSpeechDate = (dateString: string): string => {
  try {
    return format(new Date(dateString), 'PPP p');
  } catch (error) {
    console.error('Error formatting date:', dateString, error);
    return 'Invalid date';
  }
};
