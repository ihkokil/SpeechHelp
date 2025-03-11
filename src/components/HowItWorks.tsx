
import { useEffect, useState, useRef } from 'react';
import { PencilIcon, SparklesIcon, MicIcon, CheckIcon } from 'lucide-react';

interface StepProps {
  icon: JSX.Element;
  title: string;
  description: string;
  number: number;
  isVisible: boolean;
  imageUrl?: string;
}

const Step = ({ icon, title, description, number, isVisible, imageUrl }: StepProps) => {
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
          
          {imageUrl && (
            <div className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm mt-6 max-w-2xl">
              <img 
                src={imageUrl} 
                alt={`Step ${number} visualization`} 
                className="w-full h-auto rounded-md"
              />
            </div>
          )}
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
      title: "Tell about your occasion",
      description: "Start by selecting the type of speech and providing key details about your audience, topic, and goals.",
      imageUrl: "/lovable-uploads/af189d4e-060b-49b0-9ebd-2b9fb8e15c52.png"
    },
    {
      icon: <SparklesIcon className="h-5 w-5 text-pink-600" />,
      title: "Choose Your Style",
      description: "Our advanced AI analyzes your inputs and creates a tailored speech draft that matches your specific needs.",
      imageUrl: "/lovable-uploads/af189d4e-060b-49b0-9ebd-2b9fb8e15c52.png"
    },
    {
      icon: <PencilIcon className="h-5 w-5 text-pink-600" />,
      title: "Customize Perfect Speech",
      description: "Customize the generated speech with our intuitive editor, adding personal touches and refining content.",
      imageUrl: "/lovable-uploads/af189d4e-060b-49b0-9ebd-2b9fb8e15c52.png"
    },
    {
      icon: <MicIcon className="h-5 w-5 text-pink-600" />,
      title: "Edit and Practice",
      description: "Use our delivery tools to practice your speech, receive feedback, and deliver with confidence.",
      imageUrl: "/lovable-uploads/af189d4e-060b-49b0-9ebd-2b9fb8e15c52.png"
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
              imageUrl={step.imageUrl}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
