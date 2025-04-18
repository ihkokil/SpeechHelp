
import { useEffect, useState, useRef } from 'react';
import { PencilIcon, SparklesIcon, MicIcon } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/translations';
import { useIsMobile } from '@/hooks/use-mobile';

interface StepProps {
  icon: JSX.Element;
  stepNumber: number;
  isVisible: boolean;
}

const Step = ({ icon, stepNumber, isVisible }: StepProps) => {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  
  return (
    <div 
      className={`transform transition-all duration-700 ease-out opacity-0 translate-y-10 ${
        isVisible ? 'opacity-100 translate-y-0' : ''
      } hover:bg-gray-50 rounded-lg p-3 transition-all duration-300 group w-full`}
    >
      <div className="flex items-start gap-3">
        <div className="relative flex-shrink-0">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-pink-100 text-pink-600 font-bold border-2 border-pink-600 z-10 
            transform transition-all duration-500 group-hover:scale-110 group-hover:bg-pink-200">
            {stepNumber}
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-pink-600 mb-1 group-hover:text-pink-700 transition-colors">
            {t(`howItWorks.step${stepNumber}.title`, currentLanguage.code)}
          </h3>
          <p className="text-xs text-gray-600 group-hover:text-gray-800 transition-colors">
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
  const isMobile = useIsMobile();

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
    <PencilIcon key={1} className="h-4 w-4 text-pink-600" />,
    <SparklesIcon key={2} className="h-4 w-4 text-pink-600" />,
    <PencilIcon key={3} className="h-4 w-4 text-pink-600" />,
    <MicIcon key={4} className="h-4 w-4 text-pink-600" />
  ];

  return (
    <section id="how-it-works" className="py-6 bg-gray-50 relative overflow-hidden">
      <div className="container mx-auto px-3">
        <div className="text-center max-w-3xl mx-auto mb-4" ref={sectionRef}>
          <h2 className={`text-lg font-bold mb-2 transform transition-all duration-700 opacity-0 translate-y-8 ${
            isVisible ? 'opacity-100 translate-y-0' : ''
          }`}>
            How It <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">Works</span>
          </h2>
          <p className={`text-xs text-gray-600 transform transition-all duration-700 delay-200 opacity-0 translate-y-8 ${
            isVisible ? 'opacity-100 translate-y-0' : ''
          }`}>
            {t('howItWorks.subtitle', currentLanguage.code)}
          </p>
        </div>

        <div className="max-w-xs mx-auto">
          <div className="space-y-3">
            {[1, 2, 3, 4].map((stepNumber) => (
              <Step
                key={stepNumber}
                icon={stepIcons[stepNumber - 1]}
                stepNumber={stepNumber}
                isVisible={isVisible}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
