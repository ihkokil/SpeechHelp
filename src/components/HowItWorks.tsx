
import React, { useEffect, useState, useRef } from 'react';
import { PencilIcon, SparklesIcon, MicIcon } from 'lucide-react';
import Step from '@/components/Step';
import Translate from '@/components/Translate';

const HowItWorks = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

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
    <section className="bg-gray-50 relative overflow-hidden">
      {/* Place the anchor at the very top with no padding */}
      <div id="how-it-works" className="absolute top-0"></div>
      
      {/* Add padding to push content below navbar */}
      <div className="pt-16 pb-8 sm:pb-12 md:pb-16 lg:pb-24">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <div className="text-center max-w-full sm:max-w-3xl mx-auto mb-8 sm:mb-12 lg:mb-16" ref={sectionRef}>
            <h2 className={`text-3xl sm:text-4xl md:text-4xl lg:text-4xl font-bold mb-3 sm:mb-4 lg:mb-6 transform transition-all duration-700 opacity-0 translate-y-8 ${
              isVisible ? 'opacity-100 translate-y-0' : ''
            }`}>
              <Translate text="headers.howItWorks" /> <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent"><Translate text="headers.works" /></span>
            </h2>
            <p className={`text-base sm:text-lg md:text-xl text-gray-600 transform transition-all duration-700 delay-200 opacity-0 translate-y-8 ${
              isVisible ? 'opacity-100 translate-y-0' : ''
            } px-2`}>
              <Translate text="howItWorks.subtitle" />
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
      </div>
    </section>
  );
};

export default HowItWorks;
