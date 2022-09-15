
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
      className={`bg-white rounded-md p-6 border border-gray-100 transition-all duration-300 opacity-0 group hover:border-pink-200 ${
        isVisible ? 'animate-scale-in' : ''
      }`}
    >
      <div className="p-2 rounded-full bg-pink-100 w-fit mb-4 text-pink-600">{icon}</div>
      <h3 className="text-lg font-semibold mb-2 text-gray-800 group-hover:text-pink-600 transition-colors">{title}</h3>
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
      icon: <SparklesIcon className="h-6 w-6" />,
      title: "AI-Powered Speech Magic",
      description: "Our advanced AI analyzes your topic and audience to generate personalized speech suggestions."
    },
    {
      icon: <BookOpenIcon className="h-6 w-6" />,
      title: "The Perfect Speech Library",
      description: "Choose from professionally crafted templates for any occasion or purpose."
    },
    {
      icon: <MicIcon className="h-6 w-6" />,
      title: "Practice Makes Perfect",
      description: "Receive coaching on tone, pace, and emphasis to deliver with confidence."
    },
    {
      icon: <ClockIcon className="h-6 w-6" />,
      title: "Create Speeches On Time",
      description: "Create compelling speeches in minutes instead of hours with our intuitive AI."
    },
    {
      icon: <GlobeIcon className="h-6 w-6" />,
      title: "The Perfect Structure",
      description: "Generate and edit speeches in multiple languages to connect with diverse audiences."
    },
    {
      icon: <HeartIcon className="h-6 w-6" />,
      title: "The Emotional Connection",
      description: "Our AI understands emotional context, helping craft speeches that genuinely resonate."
    }
  ];

  return (
    <section id="features" className="py-16 md:py-24 bg-white relative">
      <div className="container mx-auto px-6 md:px-12">
        <div className="max-w-3xl mx-auto text-center mb-12" ref={sectionRef}>
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 opacity-0 ${isVisible ? 'animate-fade-in' : ''}`}>
            Welcome to <span className="text-pink-600">Speech Help!</span>
          </h2>
          <p className={`text-lg text-gray-600 mb-6 opacity-0 ${isVisible ? 'animate-fade-in stagger-1' : ''}`}>
            Our award-winning tool makes speech creation simple and stress-free. With cutting-edge AI technology, we're transforming public speaking help, making it accessible to everyone.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
