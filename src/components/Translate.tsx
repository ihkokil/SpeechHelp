
import { useTranslatedContent } from '@/hooks/useTranslatedContent';
import React, { ReactNode } from 'react';

interface TranslateProps {
  text: string;
  fallback?: ReactNode;
  variables?: Record<string, string>;
  components?: Record<string, (text: string) => ReactNode>;
}

const Translate: React.FC<TranslateProps> = ({ 
  text, 
  fallback, 
  variables, 
  components 
}) => {
  const { translate } = useTranslatedContent();
  
  let translation = translate(text, variables);
  
  // If components are provided, replace tagged content
  if (components) {
    Object.entries(components).forEach(([tag, renderFn]) => {
      const regex = new RegExp(`<${tag}>(.*?)</${tag}>`, 'g');
      translation = translation.replace(regex, (match, content) => {
        return renderFn(content);
      });
    });
  }
  
  // If the translation is the same as the key and it looks like a translation key,
  // render the fallback content if provided or format the key in a user-friendly way
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

