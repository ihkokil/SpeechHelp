
import { useEffect, useState, useRef } from 'react';
import { Wand2Icon, FileTextIcon, UsersIcon, ClockIcon, CalendarIcon, CreditCardIcon } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/translations';

interface FeatureProps {
  icon: JSX.Element;
  title: string;
  description: string;
  delay: number;
  translationPrefix: string;
}

const Feature = ({ icon, title, description, delay, translationPrefix }: FeatureProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const featureRef = useRef<HTMLDivElement>(null);
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
        }
      },
      { threshold: 0.1 }
    );

    if (featureRef.current) {
      observer.observe(featureRef.current);
    }

    return () => {
      if (featureRef.current) {
        observer.unobserve(featureRef.current);
      }
    };
  }, [delay]);

  return (
    <div
      ref={featureRef}
      className={`bg-white rounded-md p-6 border border-gray-100 transition-all duration-300 opacity-0 group hover:border-pink-200 ${
        isVisible ? 'animate-scale-in' : ''
      }`}
    >
      <div className="p-2 rounded-full bg-pink-100 w-fit mb-4 text-pink-600">{icon}</div>
      <h3 className="text-lg font-semibold mb-2 text-gray-800 group-hover:text-pink-600 transition-colors">
        {t(`${translationPrefix}.title`, currentLanguage.code)}
      </h3>
      <p className="text-gray-600">
        {t(`${translationPrefix}.description`, currentLanguage.code)}
      </p>
    </div>
  );
};

const Features = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const features = [
    {
      icon: <Wand2Icon className="h-6 w-6" />,
      translationPrefix: 'features.ai'
    },
    {
      icon: <FileTextIcon className="h-6 w-6" />,
      translationPrefix: 'features.writersBlock'
    },
    {
      icon: <UsersIcon className="h-6 w-6" />,
      translationPrefix: 'features.tailored'
    },
    {
      icon: <ClockIcon className="h-6 w-6" />,
      translationPrefix: 'features.quick'
    },
    {
      icon: <CalendarIcon className="h-6 w-6" />,
      translationPrefix: 'features.occasions'
    },
    {
      icon: <CreditCardIcon className="h-6 w-6" />,
      translationPrefix: 'features.subscription'
    }
  ];

  return (
    <section id="features" className="py-16 md:py-24 bg-white relative">
      <div className="container mx-auto px-6 md:px-12">
        <div className="max-w-3xl mx-auto text-center mb-12" ref={sectionRef}>
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 opacity-0 ${isVisible ? 'animate-fade-in' : ''}`}>
            {t('features.title', currentLanguage.code)}
          </h2>
          <p className={`text-lg text-gray-600 mb-6 opacity-0 ${isVisible ? 'animate-fade-in stagger-1' : ''}`}>
            {t('features.subtitle', currentLanguage.code)}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Feature
              key={index}
              icon={feature.icon}
              title=""
              description=""
              delay={index * 100}
              translationPrefix={feature.translationPrefix}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
