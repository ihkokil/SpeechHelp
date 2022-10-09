
import { useState } from 'react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ChevronDownIcon } from 'lucide-react';

const languages = [
  { code: 'en-US', label: 'USA English', flag: '🇺🇸' },
  { code: 'en-GB', label: 'UK English', flag: '🇬🇧' },
  { code: 'fr', label: 'French', flag: '🇫🇷' },
  { code: 'es', label: 'Spanish', flag: '🇪🇸' }
];

const LanguageSelector = () => {
  const [currentLanguage, setCurrentLanguage] = useState(languages[0]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors">
        <span className="text-lg">{currentLanguage.flag}</span>
        <span className="text-sm font-medium hidden sm:inline">{currentLanguage.label}</span>
        <ChevronDownIcon className="h-4 w-4 text-gray-500" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => setCurrentLanguage(language)}
            className="flex items-center cursor-pointer"
          >
            <span className="text-lg mr-2">{language.flag}</span>
            <span>{language.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
