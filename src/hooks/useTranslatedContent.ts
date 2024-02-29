
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/translations';
import { useCallback } from 'react';

export const useTranslatedContent = () => {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation();
  
  const translate = useCallback((key: string, variables?: Record<string, string>) => {
    let translated = t(key, currentLanguage.code);
    
    // Replace variables if they exist
    if (variables) {
      Object.entries(variables).forEach(([key, value]) => {
        translated = translated.replace(`{${key}}`, value);
      });
    }
    
    return translated;
  }, [currentLanguage.code, t]);

  return { translate, currentLanguage };
};

