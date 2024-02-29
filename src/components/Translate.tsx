
import { useTranslatedContent } from '@/hooks/useTranslatedContent';

interface TranslateProps {
  text: string;
  fallback?: string;
  variables?: Record<string, string>;
}

const Translate: React.FC<TranslateProps> = ({ text, fallback, variables }) => {
  const { translate } = useTranslatedContent();
  
  const translation = translate(text, variables);
  
  // If the translation is the same as the key and it looks like a translation key,
  // render the fallback text if provided or format the key in a user-friendly way
  if (translation === text && text.includes('.')) {
    if (fallback) {
      return <>{fallback}</>;
    }
    const parts = text.split('.');
    return <>{parts[parts.length - 1].replace(/([A-Z])/g, ' $1').trim()}</>;
  }
  
  return <>{translation}</>;
};

export default Translate;

