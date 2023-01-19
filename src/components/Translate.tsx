
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/translations';

interface TranslateProps {
  text: string;
  fallback?: string;
}

const Translate: React.FC<TranslateProps> = ({ text, fallback }) => {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation();
  
  const translation = t(text, currentLanguage.code);
  
  // If the translation is the same as the key and it looks like a translation key,
  // render the fallback text if provided or format the key in a user-friendly way
  if (translation === text && text.includes('.')) {
    if (fallback) {
      return <>{fallback}</>;
    }
    
    // Extract the last part of the key and format it with first letter capitalized
    const parts = text.split('.');
    const lastPart = parts[parts.length - 1];
    
    // Capitalize the first letter and handle camelCase
    const formattedText = lastPart
      .replace(/([A-Z])/g, ' $1')
      .trim()
      .replace(/^\w/, (c) => c.toUpperCase());
    
    return <>{formattedText}</>;
  }
  
  // Ensure the first letter of any translation is capitalized
  const capitalizedTranslation = translation.charAt(0).toUpperCase() + translation.slice(1);
  return <>{capitalizedTranslation}</>;
};

export default Translate;
