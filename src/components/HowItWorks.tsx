
import { useEffect, useState, useRef } from 'react';
import { PencilIcon, SparklesIcon, MicIcon, CheckIcon } from 'lucide-react';

interface StepProps {
  icon: JSX.Element;
  title: string;
  description: string;
  number: number;
  isVisible: boolean;
}

const Step = ({ icon, title, description, number, isVisible }: StepProps) => {
  return (
    <div className={`mb-16 relative opacity-0 ${isVisible ? `animate-slide-in stagger-${number}` : ''}`}>
      <div className="flex items-start">
        <div className="relative mr-6">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-pink-100 text-pink-600 font-bold border-2 border-pink-600 z-10">
            {number}
          </div>
          {number < 4 && (
            <div className="absolute top-12 left-1/2 w-1 h-24 bg-pink-300 transform -translate-x-1/2 hidden md:block"></div>
          )}
        </div>
        <div className="flex-1 pt-1">
          <h3 className="text-xl font-semibold text-pink-600 mb-2">{title}</h3>
          <p className="text-gray-600 mb-6 max-w-md">{description}</p>
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

  const steps = [
    {
      icon: <PencilIcon className="h-5 w-5 text-pink-600" />,
      title: "Tell Us About the Occasion or Event",
      description: "Our wizard isn't nosy, but it thrives on details. The more information you share (by simply answering our prompt questionnaire), the better our system can understand your needs and enhance the results you're aiming for."
    },
    {
      icon: <SparklesIcon className="h-5 w-5 text-pink-600" />,
      title: "Start with a Template or Upload What You Have",
      description: "Our system is designed to accommodate your needs, whether you're starting from scratch or refining an existing speech. Choose from one of our templates or upload your current draft."
    },
    {
      icon: <PencilIcon className="h-5 w-5 text-pink-600" />,
      title: "Percolate to Perfection",
      description: "Enter the Speech Lab and experience our user-friendly wizard, crafted to distill the essential details needed to create a remarkable and unforgettable speech."
    },
    {
      icon: <MicIcon className="h-5 w-5 text-pink-600" />,
      title: "Edit and Personalize",
      description: "After our system crafts your speech, you can easily fine-tune it using our intuitive tools. Unlike a friend or family member, our wizard welcomes your adjustments."
    }
  ];

  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-gray-50 relative">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center max-w-3xl mx-auto mb-16" ref={sectionRef}>
          <h2 className={`text-3xl md:text-4xl font-bold mb-6 opacity-0 ${isVisible ? 'animate-fade-in' : ''}`}>
            How It <span className="text-pink-600">Works</span>
          </h2>
          <p className={`text-lg text-gray-600 opacity-0 ${isVisible ? 'animate-fade-in stagger-1' : ''}`}>
            Our streamlined process makes it easy to create powerful speeches
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <Step
              key={index}
              icon={step.icon}
              title={step.title}
              description={step.description}
              number={index + 1}
              isVisible={isVisible}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
