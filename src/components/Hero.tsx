
import React, { useEffect, useState, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/translations';
import { Link } from 'react-router-dom';
import { ButtonCustom } from './ui/button-custom';
import { useIsMobile } from '@/hooks/use-mobile';
import Translate from '@/components/Translate';

const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const heroRef = useRef<HTMLElement>(null);
  
  const videoUrl = "https://yotrueuqjxmgcwlbbyps.supabase.co/storage/v1/object/public/videofiles//SpeechHelp_App.mov";
  const videoUrlMP4 = "https://yotrueuqjxmgcwlbbyps.supabase.co/storage/v1/object/public/videofiles//SpeechHelp_App.mp4";
  
  useEffect(() => {
    setIsLoaded(true);
    
    const preventScroll = () => {
      if (heroRef.current) {
        window.scrollTo(0, 0);
      }
    };
    
    window.scrollTo(0, 0);
    setTimeout(() => window.scrollTo(0, 0), 100);
    setTimeout(() => window.scrollTo(0, 0), 300);
    
    window.addEventListener('scroll', preventScroll);
    
    const scrollTimer = setTimeout(() => {
      window.removeEventListener('scroll', preventScroll);
    }, 1000);
    
    return () => {
      window.removeEventListener('scroll', preventScroll);
      clearTimeout(scrollTimer);
    };
  }, []);

  const navbarHeight = 76;

  return (
    <>
      <section 
        ref={heroRef}
        className="text-white pb-8 sm:pb-16 md:pb-24 overflow-hidden relative"
        style={{ paddingTop: navbarHeight + 20 }}
      >
        <div 
          className="absolute inset-0 z-0 overflow-hidden" 
          style={{ 
            top: navbarHeight,
            height: `calc(100% - ${navbarHeight}px + ${isMobile ? '5vh' : '20vh'})` 
          }}
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover object-center"
            poster="/lovable-uploads/68db13b8-6c44-4a91-85dc-bc5cd4405e8c.png"
          >
            <source src={videoUrl} type="video/quicktime" />
            <source src={videoUrlMP4} type="video/mp4" />
          </video>
          {/* Enhanced video overlay with improved readability */}
          <div className="absolute inset-0 bg-black/50 backdrop-brightness-75 backdrop-contrast-125"></div>
        </div>
        
        <div className="relative z-10 mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 pt-8 sm:pt-16 pb-6 sm:pb-12 max-w-[1600px]">
          <div className="mx-auto text-center">
            <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight sm:leading-tight md:leading-tight lg:leading-tight mb-3 sm:mb-4 opacity-0 ${isLoaded ? 'animate-fade-in stagger-1' : ''}`}>
              <Translate 
                text="headers.needCreativeSpeech" 
                fallback={
                  <>
                    Need a <span className="text-pink-500">creative speech</span>?
                  </>
                } 
                components={{
                  highlight: (text) => <span className="text-pink-500">{text}</span>
                }}
              />
            </h1>
            
            <h2 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-medium leading-tight sm:leading-tight md:leading-tight lg:leading-tight mb-6 sm:mb-8 opacity-0 ${isLoaded ? 'animate-fade-in stagger-2' : ''}`}>
              <Translate text="hero.subheadline" />
            </h2>
            
            <div className={`flex justify-center mb-8 sm:mb-16 mt-8 sm:mt-14 opacity-0 ${isLoaded ? 'animate-fade-in stagger-3' : ''}`}>
              <Link to="/pricing">
                <ButtonCustom variant="magenta" size="lg" className="group text-base sm:text-lg lg:text-xl xl:text-2xl px-8 lg:px-12 xl:px-16 py-4 lg:py-6">
                  <span><Translate text="hero.cta" /></span>
                </ButtonCustom>
              </Link>
            </div>
            
            <div className={`grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 lg:gap-12 xl:gap-16 max-w-5xl xl:max-w-6xl mx-auto mt-8 sm:mt-16 opacity-0 ${isLoaded ? 'animate-fade-in stagger-4' : ''}`}>
              <div className="text-center">
                <div className="rounded-full bg-pink-600 h-10 w-10 lg:h-14 lg:w-14 xl:h-16 xl:w-16 flex items-center justify-center mx-auto mb-2">
                  <span className="text-base lg:text-lg xl:text-xl font-bold">AI</span>
                </div>
                <p className="text-gray-300 text-sm lg:text-base xl:text-lg"><Translate text="hero.feature1" /></p>
              </div>
              <div className="text-center">
                <div className="rounded-full bg-pink-600 h-10 w-10 lg:h-14 lg:w-14 xl:h-16 xl:w-16 flex items-center justify-center mx-auto mb-2">
                  <span className="text-base lg:text-lg xl:text-xl font-bold">⌛</span>
                </div>
                <p className="text-gray-300 text-sm lg:text-base xl:text-lg"><Translate text="hero.feature2" /></p>
              </div>
              <div className="text-center">
                <div className="rounded-full bg-pink-600 h-10 w-10 lg:h-14 lg:w-14 xl:h-16 xl:w-16 flex items-center justify-center mx-auto mb-2">
                  <span className="text-base lg:text-lg xl:text-xl font-bold">★</span>
                </div>
                <p className="text-gray-300 text-sm lg:text-base xl:text-lg"><Translate text="hero.feature3" /></p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
