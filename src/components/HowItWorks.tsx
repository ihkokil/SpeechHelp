
import React, { useEffect, useState, useRef } from 'react';
import { PencilIcon, SparklesIcon, MicIcon } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/translations';
import { useIsMobile } from '@/hooks/use-mobile';

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
    <div 
      className={`transform transition-all duration-700 ease-out opacity-0 ${animationClass} ${
        isVisible ? 'opacity-100 translate-x-0' : ''
      } hover:scale-105 hover:shadow-lg hover:bg-gray-50 rounded-lg p-4 sm:p-6 transition-all duration-300 group w-full`}
    >
      <div className="flex items-start gap-4">
        <div className="relative flex-shrink-0">
          <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-pink-100 text-pink-600 font-bold border-2 border-pink-600 z-10 
            transform transition-all duration-500 group-hover:scale-110 group-hover:bg-pink-200">
            {stepNumber}
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg sm:text-xl font-semibold text-pink-600 mb-2 group-hover:text-pink-700 transition-colors">
            {t(`howItWorks.step${stepNumber}.title`, currentLanguage.code)}
          </h3>
          <p className="text-base sm:text-lg text-gray-600 group-hover:text-gray-800 transition-colors">
            {t(`howItWorks.step${stepNumber}.description`, currentLanguage.code)}
          </p>
        </div>
      </div>
    </div>
  );
};

const CurvedArrow = ({ index, isVisible }: { index: number; isVisible: boolean }) => {
  const upwardCurve = index % 2 === 0;
  
  // Define the paths for the curved arrows that connect from the circle of one step to the next circle
  // Path format: M(start-x,start-y) C(control1-x,control1-y) (control2-x,control2-y) (end-x,end-y)
  const path = upwardCurve
    ? "M10,10 C120,-50 200,100 320,10" 
    : "M10,10 C120,100 200,-50 320,10";
  
  // Define marker ID for arrow
  const markerId = `arrowhead${index}`;

  return (
    <div className="hidden lg:block relative w-full h-24 -mt-4">
      <svg className="absolute left-1/2 -translate-x-1/2 w-80 h-24">
        <defs>
          <linearGradient id={`purpleGradient${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#9333EA" />
            <stop offset="100%" stopColor="#E879F9" />
          </linearGradient>
          
          <marker 
            id={markerId} 
            markerWidth="10" 
            markerHeight="8" 
            refX="9.5" 
            refY="4" 
            orient="auto"
            markerUnits="userSpaceOnUse"
          >
            <path 
              d="M0,0 L0,8 L10,4 L0,0" 
              fill={`url(#purpleGradient${index})`} 
            />
          </marker>
        </defs>
        
        <path
          d={path}
          fill="none"
          stroke={`url(#purpleGradient${index})`}
          strokeWidth="3"
          markerEnd={`url(#${markerId})`}
          className={`opacity-0 transition-all duration-1000 ${isVisible ? 'opacity-100' : ''}`}
        />
      </svg>
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
    <PencilIcon key={1} className="h-5 w-5 text-pink-600" />,
    <SparklesIcon key={2} className="h-5 w-5 text-pink-600" />,
    <PencilIcon key={3} className="h-5 w-5 text-pink-600" />,
    <MicIcon key={4} className="h-5 w-5 text-pink-600" />
  ];

  return (
    <section id="how-it-works" className="py-12 sm:py-16 md:py-24 bg-gray-50 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16" ref={sectionRef}>
          <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 transform transition-all duration-700 opacity-0 translate-y-8 ${
            isVisible ? 'opacity-100 translate-y-0' : ''
          }`}>
            How It <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">Works</span>
          </h2>
          <p className={`text-lg sm:text-xl text-gray-600 transform transition-all duration-700 delay-200 opacity-0 translate-y-8 ${
            isVisible ? 'opacity-100 translate-y-0' : ''
          }`}>
            {t('howItWorks.subtitle', currentLanguage.code)}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="space-y-6 sm:space-y-8">
            {[1, 2, 3, 4].map((stepNumber) => (
              <React.Fragment key={`step-group-${stepNumber}`}>
                <Step
                  key={`step-${stepNumber}`}
                  icon={stepIcons[stepNumber - 1]}
                  stepNumber={stepNumber}
                  isVisible={isVisible}
                  slideDirection={stepNumber % 2 === 0 ? 'right' : 'left'}
                />
                {stepNumber < 4 && (
                  <CurvedArrow 
                    key={`arrow-${stepNumber}`} 
                    index={stepNumber} 
                    isVisible={isVisible}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
