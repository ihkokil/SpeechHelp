
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useTranslation } from "@/translations";
import { useLanguage } from "@/contexts/LanguageContext";

interface NavLinksProps {
  isMobile?: boolean;
  onItemClick?: () => void;
}

const NavLinks = ({ isMobile = false, onItemClick }: NavLinksProps) => {
  const location = useLocation();
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation();

  const scrollToSection = (sectionId: string) => {
    // Only attempt to scroll if we're on the homepage
    if (location.pathname === '/') {
      const element = document.getElementById(sectionId);
      if (element) {
        // Adding offset to account for the navbar height plus extra padding
        const navbarHeight = 76; // Height of the navbar in pixels
        const extraPadding = 40; // Extra padding for better visual spacing
        const offsetPosition = element.getBoundingClientRect().top + window.scrollY - navbarHeight - extraPadding;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
    if (onItemClick) onItemClick();
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (onItemClick) onItemClick();
  };

  const handlePricingClick = () => {
    // If already on pricing page, scroll to top
    if (location.pathname === '/pricing') {
      scrollToTop();
    }
    if (onItemClick) onItemClick();
  };

  const handleNavigation = (sectionId: string) => {
    if (location.pathname === '/') {
      // If already on homepage, just scroll
      scrollToSection(sectionId);
    } else {
      // If on another page, we'll navigate to home with a hash
      if (onItemClick) onItemClick();
    }
  };

  const className = isMobile 
    ? "text-gray-700 hover:text-pink-600 font-medium transition-colors text-left" 
    : "text-gray-700 hover:text-pink-600 font-medium transition-colors";

  if (location.pathname === '/') {
    // On homepage, use smooth scrolling
    return (
      <>
        <button
          onClick={scrollToTop}
          className={className}
        >
          {t('nav.home', currentLanguage.code)}
        </button>
        <button
          onClick={() => scrollToSection('features')}
          className={className}
        >
          {t('nav.features', currentLanguage.code)}
        </button>
        <button
          onClick={() => scrollToSection('how-it-works')}
          className={className}
        >
          {t('nav.howItWorks', currentLanguage.code)}
        </button>
        <Link
          to="/pricing"
          className={className}
          onClick={handlePricingClick}
        >
          Pricing
        </Link>
        <button
          onClick={() => scrollToSection('contact')}
          className={className}
        >
          {t('nav.contact', currentLanguage.code)}
        </button>
      </>
    );
  }

  // On other pages, use links to homepage with hash
  return (
    <>
      <Link
        to="/"
        className={className}
        onClick={scrollToTop}
      >
        {t('nav.home', currentLanguage.code)}
      </Link>
      <Link
        to="/#features"
        className={className}
        onClick={onItemClick}
      >
        {t('nav.features', currentLanguage.code)}
      </Link>
      <Link
        to="/#how-it-works"
        className={className}
        onClick={onItemClick}
      >
        {t('nav.howItWorks', currentLanguage.code)}
      </Link>
      <Link
        to="/pricing"
        className={className}
        onClick={handlePricingClick}
      >
        Pricing
      </Link>
      <Link
        to="/#contact"
        className={className}
        onClick={onItemClick}
      >
        {t('nav.contact', currentLanguage.code)}
      </Link>
    </>
  );
};

export default NavLinks;
