
import { useEffect, useState, useRef } from 'react';
import { PencilIcon, SparklesIcon, MicIcon, CheckIcon } from 'lucide-react';
import Translate from '@/components/Translate';

interface StepProps {
  icon: JSX.Element;
  stepNumber: number;
  isVisible: boolean;
}

const Step = ({ icon, stepNumber, isVisible }: StepProps) => {
  return (
    <div className={`mb-16 relative opacity-0 ${isVisible ? `animate-slide-in stagger-${stepNumber}` : ''}`}>
      <div className="flex items-start">
        <div className="relative mr-6">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-pink-100 text-pink-600 font-bold border-2 border-pink-600 z-10">
            {stepNumber}
          </div>
          {stepNumber < 4 && (
            <div className="absolute top-12 left-1/2 w-1 h-24 bg-pink-300 transform -translate-x-1/2 hidden md:block"></div>
          )}
        </div>
        <div className="flex-1 pt-1">
          <h3 className="text-xl font-semibold text-pink-600 mb-2">
            <Translate text={`howItWorks.step${stepNumber}.title`} />
          </h3>
          <p className="text-gray-600 mb-6 max-w-md">
            <Translate text={`howItWorks.step${stepNumber}.description`} />
          </p>
        </div>
      </div>
    </div>
  );
};

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
    <section id="how-it-works" className="py-16 md:py-24 bg-gray-50 relative">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center max-w-3xl mx-auto mb-16" ref={sectionRef}>
          <h2 className={`text-3xl md:text-4xl font-bold mb-6 opacity-0 ${isVisible ? 'animate-fade-in' : ''}`}>
            <Translate text="howItWorks.title" /> <span className="text-pink-600">Works</span>
          </h2>
          <p className={`text-lg text-gray-600 opacity-0 ${isVisible ? 'animate-fade-in stagger-1' : ''}`}>
            <Translate text="howItWorks.subtitle" />
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {stepIcons.map((icon, index) => (
            <Step
              key={index}
              icon={icon}
              stepNumber={index + 1}
              isVisible={isVisible}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
