
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/translations';

interface TranslateProps {
  text: string;
}

const Translate: React.FC<TranslateProps> = ({ text }) => {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation();
  
  return <>{t(text, currentLanguage.code)}</>;
};

export default Translate;
