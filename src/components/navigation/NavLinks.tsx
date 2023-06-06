
import { Link } from "react-router-dom";
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/translations';
import { useAuth } from '@/contexts/AuthContext';

interface NavLinksProps {
  isMobile?: boolean;
  onItemClick?: () => void;
}

const NavLinks: React.FC<NavLinksProps> = ({ isMobile = false, onItemClick }) => {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation();
  const { user } = useAuth();
  
  const linkClasses = isMobile
    ? "block py-3 font-medium hover:text-pink-600 transition-colors"
    : "font-medium hover:text-pink-600 transition-colors";
  
  return (
    <div className={isMobile ? "" : "flex items-center space-x-6"}>
      <Link
        to="/#features"
        className={linkClasses}
        onClick={onItemClick}
      >
        {t('nav.features', currentLanguage.code)}
      </Link>
      <Link
        to="/#how-it-works"
        className={linkClasses}
        onClick={onItemClick}
      >
        {t('nav.howItWorks', currentLanguage.code)}
      </Link>
      <Link
        to="/pricing"
        className={linkClasses}
        onClick={onItemClick}
      >
        {t('nav.pricing', currentLanguage.code)}
      </Link>
      <Link
        to="/#contact"
        className={linkClasses}
        onClick={onItemClick}
      >
        {t('nav.contact', currentLanguage.code)}
      </Link>
      <Link
        to="/svg-uploader"
        className={linkClasses}
        onClick={onItemClick}
      >
        SVG Uploader
      </Link>
      <Link
        to="/logo-manager"
        className={linkClasses}
        onClick={onItemClick}
      >
        Logo Manager
      </Link>
    </div>
  );
};

export default NavLinks;
