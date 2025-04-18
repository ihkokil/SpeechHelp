
import { useEffect, useState, useRef } from 'react';
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
    ? 'translate-x-[-100px]' 
    : 'translate-x-[100px]';
  
  return (
    <div className={`mb-8 transform transition-all duration-700 ease-out opacity-0 ${animationClass} ${
      isVisible ? 'opacity-100 translate-x-0' : ''
    }`}>
      <div className="flex items-start">
        <div className="relative mr-6">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-pink-100 text-pink-600 font-bold border-2 border-pink-600 z-10 transform transition-all duration-500 hover:scale-110">
            {stepNumber}
          </div>
        </div>
        <div className="flex-1 pt-1">
          <h3 className="text-xl font-semibold text-pink-600 mb-2">
            {t(`howItWorks.step${stepNumber}.title`, currentLanguage.code)}
          </h3>
          <p className="text-gray-600 mb-6 max-w-md">
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
    <section id="how-it-works" className="py-16 md:py-24 bg-gray-50 relative overflow-hidden">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center max-w-3xl mx-auto mb-16" ref={sectionRef}>
          <h2 className={`text-3xl md:text-4xl font-bold mb-6 transform transition-all duration-700 opacity-0 translate-y-8 ${
            isVisible ? 'opacity-100 translate-y-0' : ''
          }`}>
            How It <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">Works</span>
          </h2>
          <p className={`text-lg text-gray-600 transform transition-all duration-700 delay-200 opacity-0 translate-y-8 ${
            isVisible ? 'opacity-100 translate-y-0' : ''
          }`}>
            {t('howItWorks.subtitle', currentLanguage.code)}
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
            <div className="space-y-8">
              <Step
                key={1}
                icon={stepIcons[0]}
                stepNumber={1}
                isVisible={isVisible}
                slideDirection="left"
              />
              <Step
                key={2}
                icon={stepIcons[1]}
                stepNumber={2}
                isVisible={isVisible}
                slideDirection="right"
              />
            </div>
            <div className="space-y-8">
              <Step
                key={3}
                icon={stepIcons[2]}
                stepNumber={3}
                isVisible={isVisible}
                slideDirection="left"
              />
              <Step
                key={4}
                icon={stepIcons[3]}
                stepNumber={4}
                isVisible={isVisible}
                slideDirection="right"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
