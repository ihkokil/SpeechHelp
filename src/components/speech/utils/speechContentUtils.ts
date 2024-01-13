
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * Creates a placeholder speech based on the given title and details
 */
export const createPlaceholderSpeech = (title: string, details: Record<string, string> = {}): string => {
  // Get the current language from the context
  const languageContext = useLanguage();
  const { currentLanguage } = languageContext;
  
  const audience = details.audience || 'general audience';
  
  let placeholderContent = '';
  
  // Generate language-specific placeholder content
  if (currentLanguage.code === 'es') {
    placeholderContent = `# ${title}\n\n*Este es un discurso de muestra.*\n\nDirigido a: ${audience}.\n\nEdite este discurso para personalizarlo según sus necesidades.`;
  } else if (currentLanguage.code === 'fr') {
    placeholderContent = `# ${title}\n\n*Ceci est un exemple de discours.*\n\nDestiné à: ${audience}.\n\nModifiez ce discours pour le personnaliser selon vos besoins.`;
  } else {
    placeholderContent = `# ${title}\n\n*This is a sample speech.*\n\nIntended for: ${audience}.\n\nEdit this speech to customize it to your needs.`;
  }
  
  // Create structured content with language metadata
  const structuredContent = {
    content: placeholderContent,
    metadata: {
      language: currentLanguage.code,
      createdAt: new Date().toISOString()
    }
  };
  
  return JSON.stringify(structuredContent);
};
