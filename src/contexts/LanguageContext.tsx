
import React, { createContext, useContext, useState, useEffect } from 'react';

// Define available languages
export const languages = [
  { code: 'en-US', label: 'USA English', flag: '🇺🇸' },
  { code: 'en-GB', label: 'UK English', flag: '🇬🇧' },
  { code: 'fr', label: 'French', flag: '🇫🇷' },
  { code: 'es', label: 'Spanish', flag: '🇪🇸' }
];

type LanguageContextType = {
  currentLanguage: typeof languages[0];
  setLanguage: (language: typeof languages[0]) => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Get saved language from localStorage or default to browser preference or en-US
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    // Try to get saved language from localStorage
    const savedLanguage = localStorage.getItem('appLanguage');
    if (savedLanguage) {
      try {
        return JSON.parse(savedLanguage);
      } catch (error) {
        console.error('Error parsing saved language:', error);
      }
    }

    // Try to match browser language with available languages
    const browserLang = navigator.language;
    const matchedLang = languages.find(lang => 
      browserLang.toLowerCase().startsWith(lang.code.toLowerCase())
    );
    
    return matchedLang || languages[0];
  });

  // Save language to localStorage and update document attributes when it changes
  useEffect(() => {
    localStorage.setItem('appLanguage', JSON.stringify(currentLanguage));
    
    // Update document language for screen readers and SEO
    document.documentElement.lang = currentLanguage.code;
    
    // Update direction if needed (for RTL languages in the future)
    document.documentElement.dir = ['ar', 'he', 'fa'].includes(currentLanguage.code) ? 'rtl' : 'ltr';
  }, [currentLanguage]);

  const setLanguage = (language: typeof languages[0]) => {
    setCurrentLanguage(language);
    // Dispatch a custom event that components can listen to
    window.dispatchEvent(new CustomEvent('languagechange', { detail: language }));
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

