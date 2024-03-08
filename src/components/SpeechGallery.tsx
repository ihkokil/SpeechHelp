
import { useEffect, useState, useRef } from 'react';
import { Heart, GraduationCap, Cake, Briefcase, Mic, Flame, Flower, Speaker, Users, Hand, BookOpen, Megaphone, Music, Armchair, Award, CalendarDays } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/translations';

interface GalleryItemProps {
  image: string;
  titleKey: string;
  subtitleKey?: string;
  isVisible: boolean;
  index: number;
  icon: JSX.Element;
}

const GalleryItem = ({
  image,
  titleKey,
  subtitleKey,
  isVisible,
  index,
  icon
}: GalleryItemProps) => {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation();

  return <div className={`group relative rounded-md overflow-hidden opacity-0 ${isVisible ? `animate-fade-in delay-${index % 5 * 100}` : ''}`}>
      <img src={image} alt={t(titleKey, currentLanguage.code)} className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent opacity-70"></div>
      <div className="absolute top-3 right-3 bg-pink-600 rounded-full p-1.5 text-white">
        {icon}
      </div>
      <div className="absolute bottom-0 left-0 p-3">
        <h3 className="text-white text-sm font-medium">{t(titleKey, currentLanguage.code)}</h3>
        {subtitleKey && <p className="text-white/70 text-xs mt-1">{t(subtitleKey, currentLanguage.code)}</p>}
      </div>
    </div>;
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

  const speeches = [{
    image: "/lovable-uploads/33c67c99-8bf4-4acf-8736-21af0686d079.png",
    titleKey: "speechTypes.wedding.title",
    subtitleKey: "speechTypes.wedding.description",
    icon: <Heart className="h-4 w-4" />
  }, {
    image: "/lovable-uploads/9be03b29-2155-4883-8cab-d839e223604b.png",
    titleKey: "speechTypes.graduation.title",
    subtitleKey: "speechTypes.graduation.description",
    icon: <GraduationCap className="h-4 w-4" />
  }, {
    image: "/lovable-uploads/8a6c2e93-6843-4eb9-8b07-e8456c653de8.png",
    titleKey: "speechTypes.birthday.title",
    subtitleKey: "speechTypes.birthday.description",
    icon: <Cake className="h-4 w-4" />
  }, {
    image: "/lovable-uploads/77293a90-2a43-4957-8542-0613049ec390.png",
    titleKey: "speechTypes.business.title",
    subtitleKey: "speechTypes.business.description",
    icon: <Briefcase className="h-4 w-4" />
  }, {
    image: "/lovable-uploads/e4a82c35-24f4-4a85-bfa6-cdf784a2aeea.png",
    titleKey: "speechTypes.tedtalk.title",
    subtitleKey: "speechTypes.tedtalk.description",
    icon: <Mic className="h-4 w-4" />
  }, {
    image: "/lovable-uploads/fa0501ec-e268-4b60-8823-33cccfc3f9c9.png",
    titleKey: "speechTypes.motivational.title",
    subtitleKey: "speechTypes.motivational.description",
    icon: <Flame className="h-4 w-4" />
  }, {
    image: "/lovable-uploads/6b579e66-022a-4509-a23a-be31636b6aa7.png",
    titleKey: "speechTypes.funeral.title",
    subtitleKey: "speechTypes.funeral.description",
    icon: <Flower className="h-4 w-4" />
  }, {
    image: "/lovable-uploads/003145b7-6fd4-4884-aff4-22d532ef961f.png",
    titleKey: "speechTypes.keynote.title",
    subtitleKey: "speechTypes.keynote.description",
    icon: <Speaker className="h-4 w-4" />
  }, {
    image: "/lovable-uploads/792f3ee8-f60a-42c3-8537-923c72ec3992.png",
    titleKey: "speechTypes.social.title",
    subtitleKey: "speechTypes.social.description",
    icon: <Users className="h-4 w-4" />
  }, {
    image: "/lovable-uploads/c0a526b7-d971-41ab-afd7-3345ffe18a83.png",
    titleKey: "speechTypes.farewell.title",
    subtitleKey: "speechTypes.farewell.description",
    icon: <Hand className="h-4 w-4" />
  }, {
    image: "/lovable-uploads/aeaae355-f442-4199-9e24-7e5be18d5085.png",
    titleKey: "speechTypes.informative.title",
    subtitleKey: "speechTypes.informative.description",
    icon: <BookOpen className="h-4 w-4" />
  }, {
    image: "/lovable-uploads/2bc35e53-2bc5-4af1-9a59-637cecc0e333.png",
    titleKey: "speechTypes.persuasive.title",
    subtitleKey: "speechTypes.persuasive.description",
    icon: <Megaphone className="h-4 w-4" />
  }, {
    image: "/lovable-uploads/eb584538-b84a-4ada-82a3-3a65ba072531.png",
    titleKey: "speechTypes.entertaining.title",
    subtitleKey: "speechTypes.entertaining.description",
    icon: <Music className="h-4 w-4" />
  }, {
    image: "/lovable-uploads/2759cdfb-30f5-48e6-bbcc-7076095f6195.png",
    titleKey: "speechTypes.retirement.title",
    subtitleKey: "speechTypes.retirement.description",
    icon: <Armchair className="h-4 w-4" />
  }, {
    image: "/lovable-uploads/0ccb56bd-8358-4d39-bd27-1a676faf9ba6.png",
    titleKey: "speechTypes.award.title",
    subtitleKey: "speechTypes.award.description",
    icon: <Award className="h-4 w-4" />
  }, {
    image: "/lovable-uploads/02964ef1-c71e-43a1-bad8-ccb04d9c5080.png",
    titleKey: "speechTypes.other.title",
    subtitleKey: "speechTypes.other.description",
    icon: <CalendarDays className="h-4 w-4" />
  }];

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
          {speeches.map((speech, index) => (
            <GalleryItem 
              key={index} 
              image={speech.image} 
              titleKey={speech.titleKey} 
              subtitleKey={speech.subtitleKey} 
              isVisible={isVisible} 
              index={index} 
              icon={speech.icon} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SpeechGallery;
