
import { useEffect, useState, useRef } from 'react';
import { MicIcon, SparklesIcon, BookOpenIcon, ClockIcon, GlobeIcon, HeartIcon } from 'lucide-react';

interface FeatureProps {
  icon: JSX.Element;
  title: string;
  description: string;
  delay: number;
}

const Feature = ({ icon, title, description, delay }: FeatureProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const featureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
        }
      },
      { threshold: 0.1 }
    );

    if (featureRef.current) {
      observer.observe(featureRef.current);
    }

    return () => {
      if (featureRef.current) {
        observer.unobserve(featureRef.current);
      }
    };
  }, [delay]);

  return (
    <div
      ref={featureRef}
      className={`bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 opacity-0 ${
        isVisible ? 'animate-scale-in' : ''
      }`}
    >
      <div className="p-3 rounded-lg bg-blue-50 w-fit mb-4">{icon}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

const Features = () => {
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

  const features = [
    {
      icon: <SparklesIcon className="h-6 w-6 text-blue-600" />,
      title: "AI-Powered Suggestions",
      description: "Our advanced AI analyzes your topic, audience, and goals to generate personalized speech suggestions."
    },
    {
      icon: <BookOpenIcon className="h-6 w-6 text-blue-600" />,
      title: "Comprehensive Templates",
      description: "Choose from a wide range of professionally crafted templates for any occasion or purpose."
    },
    {
      icon: <MicIcon className="h-6 w-6 text-blue-600" />,
      title: "Voice Delivery Training",
      description: "Receive coaching on tone, pace, and emphasis to deliver your speech with confidence and impact."
    },
    {
      icon: <ClockIcon className="h-6 w-6 text-blue-600" />,
      title: "Time-Saving Tools",
      description: "Create compelling speeches in minutes instead of hours with our intuitive AI assistant."
    },
    {
      icon: <GlobeIcon className="h-6 w-6 text-blue-600" />,
      title: "Multi-Language Support",
      description: "Generate and edit speeches in multiple languages to connect with diverse audiences."
    },
    {
      icon: <HeartIcon className="h-6 w-6 text-blue-600" />,
      title: "Emotional Intelligence",
      description: "Our AI understands emotional context, helping craft speeches that genuinely resonate with listeners."
    }
  ];

  return (
    <section id="features" className="py-20 md:py-32 bg-gray-50 relative">
      <div className="container mx-auto px-6 md:px-12">
        <div className="max-w-3xl mx-auto text-center mb-16" ref={sectionRef}>
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100 mb-4 opacity-0 ${isVisible ? 'animate-fade-in' : ''}`}>
            Features
          </span>
          <h2 className={`text-3xl md:text-4xl font-bold mb-6 opacity-0 ${isVisible ? 'animate-fade-in stagger-1' : ''}`}>
            Everything You Need for <span className="text-gradient">Perfect Speeches</span>
          </h2>
          <p className={`text-lg text-gray-600 opacity-0 ${isVisible ? 'animate-fade-in stagger-2' : ''}`}>
            Our comprehensive toolset is designed to help you create, refine, and deliver speeches that leave a lasting impression.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Feature
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={index * 100}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
