
import React from 'react';
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
          <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-pink-100 text-pink-600 text-lg sm:text-xl font-bold border-2 border-pink-600 z-10 
            transform transition-all duration-500 group-hover:scale-110 group-hover:bg-pink-200">
            {stepNumber}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-pink-600 mb-2 sm:mb-3 group-hover:text-pink-700 transition-colors">
            {t(`howItWorks.step${stepNumber}.title`, currentLanguage.code)}
          </h3>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 group-hover:text-gray-800 transition-colors pr-1">
            {t(`howItWorks.step${stepNumber}.description`, currentLanguage.code)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Step;
