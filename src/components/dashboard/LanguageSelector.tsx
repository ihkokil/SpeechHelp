
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ChevronDownIcon } from 'lucide-react';
import { useLanguage, languages } from '@/contexts/LanguageContext';

const LanguageSelector = () => {
  const { currentLanguage, setLanguage } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors">
        <span className="text-lg">{currentLanguage.flag}</span>
        <span className="text-sm font-medium hidden sm:inline truncate max-w-[80px]">{currentLanguage.label}</span>
        <ChevronDownIcon className="h-4 w-4 text-gray-500" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-white">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => setLanguage(language)}
            className="flex items-center cursor-pointer"
          >
            <span className="text-lg mr-2">{language.flag}</span>
            <span className="truncate">{language.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
