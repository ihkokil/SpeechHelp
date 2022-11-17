
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/translations';

interface TranslateProps {
  text: string;
}

const Translate: React.FC<TranslateProps> = ({ text }) => {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation();
  
  const translation = t(text, currentLanguage.code);
  
  // If the translation is the same as the key and it looks like a translation key,
  // render it in a more user-friendly way
  if (translation === text && text.includes('.')) {
    const parts = text.split('.');
    return <>{parts[parts.length - 1].replace(/([A-Z])/g, ' $1').trim()}</>;
  }
  
  return <>{translation}</>;
};

export default Translate;
