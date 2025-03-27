import { Facebook, Instagram, Linkedin, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/translations';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation();
  
  // Updated to use the correct logo path
  const logoPath = "/speech-help-new-logo.svg";

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-6 md:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-2">
            <a href="#" className="inline-block mb-4">
              <img 
                src={logoPath}
                alt="SpeechHelp Logo" 
                className="h-14" 
              />
            </a>
            <p className="text-gray-600 mb-6 max-w-md">
              {t('footer.description', currentLanguage.code)}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="p-2 rounded-full text-gray-600 hover:text-pink-600 hover:bg-pink-50 transition-colors">
                <X className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 rounded-full text-gray-600 hover:text-pink-600 hover:bg-pink-50 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 rounded-full text-gray-600 hover:text-pink-600 hover:bg-pink-50 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 rounded-full text-gray-600 hover:text-pink-600 hover:bg-pink-50 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-600 hover:text-pink-600 transition-colors">{t('footer.about', currentLanguage.code)}</a>
              </li>
              <li>
                <a href="#features" className="text-gray-600 hover:text-pink-600 transition-colors">{t('footer.features', currentLanguage.code)}</a>
              </li>
              <li>
                <Link 
                  to="/pricing" 
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
                  className="text-gray-600 hover:text-pink-600 transition-colors"
                >
                  {t('footer.pricing', currentLanguage.code)}
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-pink-600 transition-colors">{t('footer.faq', currentLanguage.code)}</a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-4">{t('footer.contactUs', currentLanguage.code)}</h3>
            <ul className="space-y-3">
              <li>
                <a href="mailto:hello@speechhelp.ai" className="text-gray-600 hover:text-pink-600 transition-colors">hello@speechhelp.ai</a>
              </li>
              <li>
                <a href="tel:+18005551234" className="text-gray-600 hover:text-pink-600 transition-colors">+1 (800) 555-1234</a>
              </li>
              <li>
                <a href="#contact" className="text-gray-600 hover:text-pink-600 transition-colors">{t('footer.support', currentLanguage.code)}</a>
              </li>
              <li>
                <a href="#contact" className="text-gray-600 hover:text-pink-600 transition-colors">{t('footer.community', currentLanguage.code)}</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            © {currentYear} SpeechHelp is a registered service of Creativity Crisis, LLC | {t('footer.rights', currentLanguage.code)}
          </p>
          <div className="flex space-x-6 text-sm">
            <a href="#" className="text-gray-600 hover:text-pink-600 transition-colors">{t('footer.privacy', currentLanguage.code)}</a>
            <a href="#" className="text-gray-600 hover:text-pink-600 transition-colors">{t('footer.terms', currentLanguage.code)}</a>
            <a href="#" className="text-gray-600 hover:text-pink-600 transition-colors">{t('footer.cookies', currentLanguage.code)}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
