import { useEffect, useState, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/translations';
import { speechTypesData } from './speech/data/speechTypesData';

interface GalleryItemProps {
  image: string;
  title: string;
  subtitle: string;
  isVisible: boolean;
  index: number;
  icon: React.ReactElement;
}

const GalleryItem = ({
  image,
  title,
  subtitle,
  isVisible,
  index,
  icon
}: GalleryItemProps) => {
  return (
    <div className={`group relative rounded-md overflow-hidden opacity-0 aspect-[4/3] ${isVisible ? `animate-fade-in delay-${index % 5 * 100}` : ''}`}>
      <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent opacity-70"></div>
      <div className="absolute top-3 right-3 bg-pink-600 rounded-full p-1.5 text-white">
        {icon}
      </div>
      <div className="absolute bottom-0 left-0 p-3">
        <h3 className="text-white text-sm font-medium">{title}</h3>
        <p className="text-white/70 text-xs mt-1">{subtitle}</p>
      </div>
    </div>
  );
};

const SpeechGallery = () => {
  const [isVisible, setIsVisible] = useState(false);
  const galleryRef = useRef<HTMLDivElement>(null);
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation();

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
      }
    }, {
      threshold: 0.1
    });

    if (galleryRef.current) {
      observer.observe(galleryRef.current);
    }

    return () => {
      if (galleryRef.current) {
        observer.unobserve(galleryRef.current);
      }
    };
  }, []);

  return (
    <section className="py-8 sm:py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 md:px-12" ref={galleryRef}>
        <div className="max-w-[90%] sm:max-w-3xl mx-auto text-center mb-8 sm:mb-12">
          <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 opacity-0 ${isVisible ? 'animate-fade-in' : ''}`}>
            {t('gallery.header', currentLanguage.code)} <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">{t('gallery.headerHighlight', currentLanguage.code)}</span>
          </h2>
          <p className={`text-base sm:text-lg text-gray-600 opacity-0 ${isVisible ? 'animate-fade-in stagger-1' : ''}`}>
            {t('gallery.subheader', currentLanguage.code)}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {speechTypesData.map((speech, index) => (
            <GalleryItem 
              key={index} 
              image={speech.image} 
              title={speech.label} 
              subtitle={speech.description} 
              isVisible={isVisible} 
              index={index} 
              icon={speech.icon as React.ReactElement} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SpeechGallery;
