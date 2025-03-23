
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
    
    // Return the key itself if no translation is found
    return key;
  };

  return { t: getTranslation };
}

export default translations;
