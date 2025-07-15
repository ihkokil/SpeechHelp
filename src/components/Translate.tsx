
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
    // We need to convert the translation to JSX elements
    const parts: (string | ReactNode)[] = [];
    let lastIndex = 0;
    
    Object.entries(components).forEach(([tag, renderFn]) => {
      const regex = new RegExp(`<${tag}>(.*?)</${tag}>`, 'g');
      let match;
      
      while ((match = regex.exec(translation)) !== null) {
        // Add text before the match
        if (match.index > lastIndex) {
          parts.push(translation.substring(lastIndex, match.index));
        }
        
        // Add the transformed content
        parts.push(renderFn(match[1]));
        
        // Update last index
        lastIndex = match.index + match[0].length;
      }
    });
    
    // Add any remaining text
    if (lastIndex < translation.length) {
      parts.push(translation.substring(lastIndex));
    }
    
    // If we found any tags to replace, return the JSX elements
    if (parts.length > 0) {
      return <>{parts}</>;
    }
  }
  
  // If the translation is the same as the key and it looks like a translation key,
  // render the fallback content if provided or format the key in a user-friendly way
  if (translation === text && text.includes('.')) {
    if (fallback !== undefined) {
      return <>{fallback}</>;
    }
    // Convert key to readable text: speechLab.backButton -> Back Button
    const parts = text.split('.');
    const lastPart = parts[parts.length - 1];
    const readableText = lastPart
      .replace(/([A-Z])/g, ' $1') // Add space before capital letters
      .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
      .trim();
    return <>{readableText}</>;
  }
  
  return <>{translation}</>;
};

export default Translate;
