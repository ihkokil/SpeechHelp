
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
    <div className={`flex items-start gap-6 opacity-0 ${isVisible ? `animate-slide-in stagger-${number}` : ''}`}>
      <div className="relative">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 font-bold">
          {number}
        </div>
        {number < 4 && (
          <div className="absolute top-12 left-1/2 w-0.5 h-16 bg-gray-200 transform -translate-x-1/2 hidden md:block"></div>
        )}
      </div>
      <div className="flex-1 pt-1">
        <div className="flex items-center mb-2">
          <div className="p-2 rounded-md bg-blue-50 mr-3">
            {icon}
          </div>
          <h3 className="text-xl font-semibold">{title}</h3>
        </div>
        <p className="text-gray-600">{description}</p>
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
      icon: <PencilIcon className="h-5 w-5 text-blue-600" />,
      title: "Define Your Speech",
      description: "Start by selecting the type of speech and providing key details about your audience, topic, and goals."
    },
    {
      icon: <SparklesIcon className="h-5 w-5 text-blue-600" />,
      title: "AI Generates Content",
      description: "Our advanced AI analyzes your inputs and creates a tailored speech draft that matches your specific needs."
    },
    {
      icon: <PencilIcon className="h-5 w-5 text-blue-600" />,
      title: "Edit and Refine",
      description: "Customize the generated speech with our intuitive editor, adding personal touches and refining content."
    },
    {
      icon: <MicIcon className="h-5 w-5 text-blue-600" />,
      title: "Practice and Deliver",
      description: "Use our delivery tools to practice your speech, receive feedback, and deliver with confidence."
    }
  ];

  return (
    <section id="how-it-works" className="py-20 md:py-32 relative">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row gap-12 lg:gap-20">
          <div className="md:w-2/5" ref={sectionRef}>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100 mb-4 opacity-0 ${isVisible ? 'animate-fade-in' : ''}`}>
              How It Works
            </span>
            <h2 className={`text-3xl md:text-4xl font-bold mb-6 opacity-0 ${isVisible ? 'animate-fade-in stagger-1' : ''}`}>
              Create Impactful Speeches <span className="text-gradient">in Minutes</span>
            </h2>
            <p className={`text-lg text-gray-600 mb-8 opacity-0 ${isVisible ? 'animate-fade-in stagger-2' : ''}`}>
              Our streamlined process makes it easy to create, refine, and deliver speeches that captivate your audience and achieve your goals.
            </p>

            <div className={`p-6 rounded-xl border border-blue-100 bg-blue-50 shadow-sm mt-8 opacity-0 ${isVisible ? 'animate-fade-in stagger-3' : ''}`}>
              <h3 className="flex items-center text-lg font-medium mb-2">
                <CheckIcon className="h-5 w-5 text-blue-600 mr-2" />
                Ready to Get Started?
              </h3>
              <p className="text-gray-700 mb-0">
                No credit card required. Start creating powerful speeches today with our free trial.
              </p>
            </div>
          </div>

          <div className="md:w-3/5">
            <div className="space-y-12 md:space-y-8 py-4">
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
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
