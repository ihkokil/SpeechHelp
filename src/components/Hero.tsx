
import { useEffect, useState } from 'react';
import { PlayCircle } from 'lucide-react';
import { ButtonCustom } from './ui/button-custom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/translations';

const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation();
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className="text-white pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden relative">
      {/* Image Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/lovable-uploads/68db13b8-6c44-4a91-85dc-bc5cd4405e8c.png" 
          alt="Woman giving speech to an audience" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60"></div>
      </div>
      
      <div className="container relative z-10 mx-auto px-6 md:px-12">
        <div className="max-w-5xl mx-auto text-center">
          {/* Main Headline */}
          <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold leading-tight md:leading-tight lg:leading-tight mb-4 opacity-0 ${isLoaded ? 'animate-fade-in stagger-1' : ''}`}>
            {t('hero.headline', currentLanguage.code)} <span className="text-pink-400"></span>
          </h1>
          
          {/* Subheadline - updated to match main heading font size */}
          <p className={`text-4xl md:text-5xl lg:text-6xl text-white/80 max-w-3xl mx-auto mb-8 opacity-0 ${isLoaded ? 'animate-fade-in stagger-2' : ''}`}>
            {t('hero.subheadline', currentLanguage.code)}
          </p>
          
          {/* Play button */}
          <div className={`flex justify-center items-center mb-10 opacity-0 ${isLoaded ? 'animate-fade-in stagger-3' : ''}`}>
            <div className="relative inline-block">
              <div className="absolute inset-0 rounded-full bg-pink-500/30 animate-ping"></div>
              <PlayCircle className="h-16 w-16 text-pink-500 relative z-10 cursor-pointer hover:text-pink-400 transition-colors" />
            </div>
          </div>
          
          {/* CTA Button */}
          <div className={`flex justify-center mb-12 opacity-0 ${isLoaded ? 'animate-fade-in stagger-4' : ''}`}>
            <ButtonCustom variant="magenta" size="lg" className="group">
              <span>{t('hero.cta', currentLanguage.code)}</span>
            </ButtonCustom>
          </div>
          
          {/* Features/Benefits Icons */}
          <div className={`grid grid-cols-3 gap-4 md:gap-8 max-w-3xl mx-auto mt-8 opacity-0 ${isLoaded ? 'animate-fade-in stagger-5' : ''}`}>
            <div className="text-center">
              <div className="rounded-full bg-pink-600 h-10 w-10 flex items-center justify-center mx-auto mb-2">
                <span className="text-base font-bold">AI</span>
              </div>
              <p className="text-gray-300 text-sm">{t('hero.feature1', currentLanguage.code)}</p>
            </div>
            <div className="text-center">
              <div className="rounded-full bg-pink-600 h-10 w-10 flex items-center justify-center mx-auto mb-2">
                <span className="text-base font-bold">⌛</span>
              </div>
              <p className="text-gray-300 text-sm">{t('hero.feature2', currentLanguage.code)}</p>
            </div>
            <div className="text-center">
              <div className="rounded-full bg-pink-600 h-10 w-10 flex items-center justify-center mx-auto mb-2">
                <span className="text-base font-bold">★</span>
              </div>
              <p className="text-gray-300 text-sm">{t('hero.feature3', currentLanguage.code)}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
