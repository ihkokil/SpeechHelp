
import React, { useEffect, useState, useRef } from 'react';
import { PencilIcon, SparklesIcon, MicIcon } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/translations';

interface StepProps {
  icon: JSX.Element;
  stepNumber: number;
  isVisible: boolean;
  slideDirection: 'left' | 'right';
}

const Step = ({ icon, stepNumber, isVisible, slideDirection }: StepProps) => {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation();
  
  const animationClass = slideDirection === 'left' 
    ? 'translate-x-[-30px] sm:translate-x-[-50px]' 
    : 'translate-x-[30px] sm:translate-x-[50px]';
  
  return (
    <div 
      className={`transform transition-all duration-700 ease-out opacity-0 ${animationClass} ${
        isVisible ? 'opacity-100 translate-x-0' : ''
      } hover:scale-105 hover:shadow-lg hover:bg-gray-50 rounded-lg p-3 sm:p-4 md:p-6 transition-all duration-300 group w-full`}
    >
      <div className="flex items-start gap-2 sm:gap-4">
        <div className="relative flex-shrink-0">
          <div className="flex items-center justify-center w-8 h-8 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-pink-100 text-pink-600 text-sm sm:text-base font-bold border-2 border-pink-600 z-10 
            transform transition-all duration-500 group-hover:scale-110 group-hover:bg-pink-200">
            {stepNumber}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg md:text-xl font-semibold text-pink-600 mb-1 sm:mb-2 group-hover:text-pink-700 transition-colors">
            {t(`howItWorks.step${stepNumber}.title`, currentLanguage.code)}
          </h3>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 group-hover:text-gray-800 transition-colors pr-1">
            {t(`howItWorks.step${stepNumber}.description`, currentLanguage.code)}
          </p>
        </div>
      </div>
    </div>
  );
};

const HowItWorks = () => {
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

  const stepIcons = [
    <PencilIcon key={1} className="h-5 w-5 text-pink-600" />,
    <SparklesIcon key={2} className="h-5 w-5 text-pink-600" />,
    <PencilIcon key={3} className="h-5 w-5 text-pink-600" />,
    <MicIcon key={4} className="h-5 w-5 text-pink-600" />
  ];

  return (
    <section id="how-it-works" className="py-8 sm:py-12 md:py-16 lg:py-24 bg-gray-50 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <div className="text-center max-w-full sm:max-w-3xl mx-auto mb-8 sm:mb-12 lg:mb-16" ref={sectionRef}>
          <h2 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 lg:mb-6 transform transition-all duration-700 opacity-0 translate-y-8 ${
            isVisible ? 'opacity-100 translate-y-0' : ''
          }`}>
            {t('headers.howItWorks', currentLanguage.code)} <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">{t('headers.works', currentLanguage.code)}</span>
          </h2>
          <p className={`text-base sm:text-lg md:text-xl text-gray-600 transform transition-all duration-700 delay-200 opacity-0 translate-y-8 ${
            isVisible ? 'opacity-100 translate-y-0' : ''
          } px-2`}>
            {t('howItWorks.subtitle', currentLanguage.code)}
          </p>
        </div>

        <div className="max-w-4xl mx-auto px-2">
          <div className="grid grid-cols-1 gap-6 sm:gap-6 lg:gap-8">
            {[1, 2, 3, 4].map((stepNumber) => (
              <Step
                key={`step-${stepNumber}`}
                icon={stepIcons[stepNumber - 1]}
                stepNumber={stepNumber}
                isVisible={isVisible}
                slideDirection={stepNumber % 2 === 0 ? 'right' : 'left'}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
