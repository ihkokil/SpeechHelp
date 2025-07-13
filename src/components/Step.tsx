
import React from 'react';
import Translate from '@/components/Translate';

interface StepProps {
  icon: JSX.Element;
  stepNumber: number;
  isVisible: boolean;
  slideDirection: 'left' | 'right';
}

const Step = ({ icon, stepNumber, isVisible, slideDirection }: StepProps) => {
  const animationClass = slideDirection === 'left' 
    ? 'translate-x-[-30px] sm:translate-x-[-50px]' 
    : 'translate-x-[30px] sm:translate-x-[50px]';
  
  return (
    <div 
      className={`transform transition-all duration-700 ease-out opacity-0 ${animationClass} ${
        isVisible ? 'opacity-100 translate-x-0' : ''
      } rounded-lg p-3 sm:p-4 md:p-6 border border-gray-200 w-full`}
    >
      <div className="flex items-start gap-2 sm:gap-4">
        <div className="relative flex-shrink-0">
          <div className="flex items-center justify-center w-8 h-8 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-pink-100 text-pink-600 text-sm sm:text-base font-bold border-2 border-pink-600 z-10">
            {stepNumber}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg md:text-xl font-semibold text-pink-600 mb-1 sm:mb-2">
            <Translate text={`howItWorks.step${stepNumber}.title`} />
          </h3>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 pr-1">
            <Translate text={`howItWorks.step${stepNumber}.description`} />
          </p>
        </div>
      </div>
    </div>
  );
};

export default Step;
