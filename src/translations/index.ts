
import translations from './translations';

export function useTranslation() {
  const getTranslation = (key: string, languageCode: string) => {
    // First, try to get translation for specific language
    if (translations[languageCode] && translations[languageCode][key]) {
      return translations[languageCode][key];
    }
    
    // Fallback to en-US if translation is not available
    if (translations['en-US'] && translations['en-US'][key]) {
      return translations['en-US'][key];
    }
    
    // If still not found, try to format the key in a user-friendly way
    if (key.includes('.')) {
      const parts = key.split('.');
      const lastPart = parts[parts.length - 1];
      // Convert camelCase to readable text
      return lastPart.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim();
    }
    
    // Return the key itself as last resort
    return key;
  };

  return { t: getTranslation };
}

export default translations;
