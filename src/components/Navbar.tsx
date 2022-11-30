
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
          >
            <img 
              src="/lovable-uploads/84f00e48-230b-4b88-9f37-7a1ba9b6ffda.png" 
              alt="SpeechHelp Logo" 
              className="h-10 w-auto object-contain" 
              style={{ display: 'block' }}
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center ml-12 space-x-4 lg:space-x-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-pink-600 font-medium transition-colors whitespace-nowrap"
            >
              {t('nav.home', currentLanguage.code)}
            </Link>
            <Link
              to="#features"
              className="text-gray-700 hover:text-pink-600 font-medium transition-colors whitespace-nowrap"
            >
              {t('nav.features', currentLanguage.code)}
            </Link>
            <Link
              to="#how-it-works"
              className="text-gray-700 hover:text-pink-600 font-medium transition-colors whitespace-nowrap"
            >
              {t('nav.howItWorks', currentLanguage.code)}
            </Link>
            <Link
              to="#testimonials"
              className="text-gray-700 hover:text-pink-600 font-medium transition-colors whitespace-nowrap"
            >
              {t('nav.testimonials', currentLanguage.code)}
            </Link>
            <Link
              to="#contact"
              className="text-gray-700 hover:text-pink-600 font-medium transition-colors whitespace-nowrap"
            >
              {t('nav.contact', currentLanguage.code)}
            </Link>

            <div className="flex items-center space-x-4">
              <UserMenu />
              <LanguageSelector />
            </div>
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
              <Link
                to="/"
                className="text-gray-700 hover:text-pink-600 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.home', currentLanguage.code)}
              </Link>
              <Link
                to="#features"
                className="text-gray-700 hover:text-pink-600 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.features', currentLanguage.code)}
              </Link>
              <Link
                to="#how-it-works"
                className="text-gray-700 hover:text-pink-600 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.howItWorks', currentLanguage.code)}
              </Link>
              <Link
                to="#testimonials"
                className="text-gray-700 hover:text-pink-600 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.testimonials', currentLanguage.code)}
              </Link>
              <Link
                to="#contact"
                className="text-gray-700 hover:text-pink-600 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.contact', currentLanguage.code)}
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
