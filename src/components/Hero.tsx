
import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/translations';
import { Link } from 'react-router-dom';
import { ButtonCustom } from './ui/button-custom';
import { AspectRatio } from './ui/aspect-ratio';

const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation();
  
  // Video hosted on Supabase
  const videoUrl = "https://yotrueuqjxmgcwlbbyps.supabase.co/storage/v1/object/sign/videofiles/Video%20Montage%20-%20Speech%20Help%20App.mov?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2aWRlb2ZpbGVzL1ZpZGVvIE1vbnRhZ2UgLSBTcGVlY2ggSGVscCBBcHAubW92IiwiaWF0IjoxNzQzMDk4MTg0LCJleHAiOjE3NzQ2MzQxODR9.wLJRfrryzMvSYVz8ZeCt6YPHJvBheaX4JZ2MAeEt1R4";
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className="text-white pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden relative">
      {/* Video Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute w-full h-full object-cover"
          poster="/lovable-uploads/68db13b8-6c44-4a91-85dc-bc5cd4405e8c.png"
        >
          <source src={videoUrl} type="video/quicktime" />
          <source src={videoUrl} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/60"></div>
      </div>
      
      <div className="container relative z-10 mx-auto px-6 md:px-12">
        <div className="max-w-5xl mx-auto text-center">
          {/* Main Headline */}
          <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold leading-tight md:leading-tight lg:leading-tight mb-4 opacity-0 ${isLoaded ? 'animate-fade-in stagger-1' : ''}`}>
            {t('hero.headline', currentLanguage.code).replace('creative speech?', '')} <span className="text-pink-400">creative speech?</span>
          </h1>
          
          {/* Subheadline - updated to match main heading font size */}
          <p className={`text-4xl md:text-5xl lg:text-6xl text-white/80 max-w-3xl mx-auto mb-8 opacity-0 ${isLoaded ? 'animate-fade-in stagger-2' : ''}`}>
            {t('hero.subheadline', currentLanguage.code)}
          </p>
          
          {/* CTA Button - Updated to link to pricing page */}
          <div className={`flex justify-center mb-12 opacity-0 ${isLoaded ? 'animate-fade-in stagger-3' : ''}`}>
            <Link to="/pricing">
              <ButtonCustom variant="magenta" size="lg" className="group">
                <span>{t('hero.cta', currentLanguage.code)}</span>
              </ButtonCustom>
            </Link>
          </div>
          
          {/* Features/Benefits Icons */}
          <div className={`grid grid-cols-3 gap-4 md:gap-8 max-w-3xl mx-auto mt-8 opacity-0 ${isLoaded ? 'animate-fade-in stagger-4' : ''}`}>
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
