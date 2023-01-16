
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import UserMenu from "./UserMenu";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "@/translations";
import LanguageSelector from "./dashboard/LanguageSelector";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    // Only attempt to scroll if we're on the homepage
    if (location.pathname === '/') {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMenuOpen(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  const handlePricingClick = () => {
    // If already on pricing page, scroll to top
    if (location.pathname === '/pricing') {
      scrollToTop();
    }
    setIsMenuOpen(false);
  };

  const handleNavigation = (sectionId: string) => {
    if (location.pathname === '/') {
      // If already on homepage, just scroll
      scrollToSection(sectionId);
    } else {
      // If on another page, we'll navigate to home with a hash
      // The hash will be handled in useEffect in Index.tsx
      setIsMenuOpen(false);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        isScrolled
          ? "bg-white/50 backdrop-blur-md shadow-md py-3"
          : "bg-white py-5"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center space-x-2"
            onClick={scrollToTop}
          >
            <img 
              src="/lovable-uploads/84f00e48-230b-4b88-9f37-7a1ba9b6ffda.png" 
              alt="SpeechHelp Logo" 
              className="h-10" 
              style={{ display: 'block' }}
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {location.pathname === '/' ? (
              // On homepage, use smooth scrolling
              <>
                <button
                  onClick={scrollToTop}
                  className="text-gray-700 hover:text-pink-600 font-medium transition-colors"
                >
                  {t('nav.home', currentLanguage.code)}
                </button>
                <button
                  onClick={() => scrollToSection('features')}
                  className="text-gray-700 hover:text-pink-600 font-medium transition-colors"
                >
                  {t('nav.features', currentLanguage.code)}
                </button>
                <button
                  onClick={() => scrollToSection('how-it-works')}
                  className="text-gray-700 hover:text-pink-600 font-medium transition-colors"
                >
                  {t('nav.howItWorks', currentLanguage.code)}
                </button>
                <Link
                  to="/pricing"
                  className="text-gray-700 hover:text-pink-600 font-medium transition-colors"
                  onClick={handlePricingClick}
                >
                  Pricing
                </Link>
                <button
                  onClick={() => scrollToSection('contact')}
                  className="text-gray-700 hover:text-pink-600 font-medium transition-colors"
                >
                  {t('nav.contact', currentLanguage.code)}
                </button>
              </>
            ) : (
              // On other pages, use links to homepage with hash
              <>
                <Link
                  to="/"
                  className="text-gray-700 hover:text-pink-600 font-medium transition-colors"
                  onClick={scrollToTop}
                >
                  {t('nav.home', currentLanguage.code)}
                </Link>
                <Link
                  to="/#features"
                  className="text-gray-700 hover:text-pink-600 font-medium transition-colors"
                >
                  {t('nav.features', currentLanguage.code)}
                </Link>
                <Link
                  to="/#how-it-works"
                  className="text-gray-700 hover:text-pink-600 font-medium transition-colors"
                >
                  {t('nav.howItWorks', currentLanguage.code)}
                </Link>
                <Link
                  to="/pricing"
                  className="text-gray-700 hover:text-pink-600 font-medium transition-colors"
                  onClick={handlePricingClick}
                >
                  Pricing
                </Link>
                <Link
                  to="/#contact"
                  className="text-gray-700 hover:text-pink-600 font-medium transition-colors"
                >
                  {t('nav.contact', currentLanguage.code)}
                </Link>
              </>
            )}

            <UserMenu />
            <LanguageSelector />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <UserMenu />
            <LanguageSelector />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 bg-white rounded-lg shadow-lg p-4">
            <div className="flex flex-col space-y-4">
              {location.pathname === '/' ? (
                // On homepage, use smooth scrolling for mobile
                <>
                  <button
                    onClick={scrollToTop}
                    className="text-gray-700 hover:text-pink-600 font-medium transition-colors text-left"
                  >
                    {t('nav.home', currentLanguage.code)}
                  </button>
                  <button
                    onClick={() => scrollToSection('features')}
                    className="text-gray-700 hover:text-pink-600 font-medium transition-colors text-left"
                  >
                    {t('nav.features', currentLanguage.code)}
                  </button>
                  <button
                    onClick={() => scrollToSection('how-it-works')}
                    className="text-gray-700 hover:text-pink-600 font-medium transition-colors text-left"
                  >
                    {t('nav.howItWorks', currentLanguage.code)}
                  </button>
                  <Link
                    to="/pricing"
                    className="text-gray-700 hover:text-pink-600 font-medium transition-colors"
                    onClick={handlePricingClick}
                  >
                    Pricing
                  </Link>
                  <button
                    onClick={() => scrollToSection('contact')}
                    className="text-gray-700 hover:text-pink-600 font-medium transition-colors text-left"
                  >
                    {t('nav.contact', currentLanguage.code)}
                  </button>
                </>
              ) : (
                // On other pages, use links to homepage with hash for mobile
                <>
                  <Link
                    to="/"
                    className="text-gray-700 hover:text-pink-600 font-medium transition-colors text-left"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('nav.home', currentLanguage.code)}
                  </Link>
                  <Link
                    to="/#features"
                    className="text-gray-700 hover:text-pink-600 font-medium transition-colors text-left"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('nav.features', currentLanguage.code)}
                  </Link>
                  <Link
                    to="/#how-it-works"
                    className="text-gray-700 hover:text-pink-600 font-medium transition-colors text-left"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('nav.howItWorks', currentLanguage.code)}
                  </Link>
                  <Link
                    to="/pricing"
                    className="text-gray-700 hover:text-pink-600 font-medium transition-colors"
                    onClick={handlePricingClick}
                  >
                    Pricing
                  </Link>
                  <Link
                    to="/#contact"
                    className="text-gray-700 hover:text-pink-600 font-medium transition-colors text-left"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('nav.contact', currentLanguage.code)}
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
