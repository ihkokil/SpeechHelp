
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/translations';

export const getSpeechTypeLabel = (type: string) => {
  const typeMap: Record<string, string> = {
    'wedding': 'Wedding Speech',
    'graduation': 'Graduation Speech',
    'birthday': 'Birthday Speech',
    'business': 'Business Speech',
    'tedtalk': 'TED Talk',
    'motivational': 'Motivational Speech',
    'funeral': 'Funeral Speech',
    'keynote': 'Keynote Address',
    'social': 'Social Speech',
    'farewell': 'Farewell Speech',
    'other': 'Other Speech'
  };
  
  return typeMap[type] || type;
};

export const getTypeColor = (type: string) => {
  const colorMap: Record<string, string> = {
    'wedding': 'bg-pink-100 text-pink-800',
    'graduation': 'bg-blue-100 text-blue-800',
    'birthday': 'bg-purple-100 text-purple-800',
    'business': 'bg-slate-100 text-slate-800',
    'tedtalk': 'bg-red-100 text-red-800',
    'motivational': 'bg-amber-100 text-amber-800',
    'funeral': 'bg-gray-100 text-gray-800',
    'keynote': 'bg-emerald-100 text-emerald-800',
    'social': 'bg-indigo-100 text-indigo-800',
    'farewell': 'bg-cyan-100 text-cyan-800',
    'other': 'bg-gray-100 text-gray-800'
  };
  
  return colorMap[type] || 'bg-gray-100 text-gray-800';
};

// Helper hook to get translated speech type
export const useTranslatedSpeechType = () => {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation();
  
  const getTranslatedTypeLabel = (type: string) => {
    const key = `speechTypes.${type}`;
    const translated = t(key, currentLanguage.code);
    
    // If translation doesn't exist, fall back to the original function
    if (translated === key) {
      return getSpeechTypeLabel(type);
    }
    
    return translated;
  };
  
  return { getTranslatedTypeLabel };
};
