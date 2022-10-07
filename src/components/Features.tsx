
import { useEffect, useState, useRef } from 'react';
import { Wand2Icon, FileTextIcon, UsersIcon, ClockIcon, CalendarIcon, CreditCardIcon } from 'lucide-react';

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
      icon: <Wand2Icon className="h-6 w-6" />,
      title: "AI-Powered Magic",
      description: "At Speech Help, we don't just write speeches – we help you create memorable moments! Our AI-powered system, SpeechHelp.ai, is like a personal speech wizard, crafting customized prompts that turn your ideas into a speech that will leave everyone talking."
    },
    {
      icon: <FileTextIcon className="h-6 w-6" />,
      title: "No More Writer's Block",
      description: "Goodbye, blank page! Say farewell to staring at an empty screen, wondering where to start. With Speech Help, you're never at a loss for words. Our AI is always ready to spark your creativity and guide you past writer's block, one prompt at a time."
    },
    {
      icon: <UsersIcon className="h-6 w-6" />,
      title: "Tailored Just For You",
      description: "Whether you're making a toast, delivering a tribute, or crafting a speech for an important event, our prompts are custom-tailored to fit your needs, occasion, and mood. Humor? Sentimentality? We've got you covered."
    },
    {
      icon: <ClockIcon className="h-6 w-6" />,
      title: "Create Speeches in No Time",
      description: "Why stress over speeches for days when you can create impactful speeches in minutes? Our intuitive interface lets you generate, edit, and personalize your speech without hassle. Whether you're a pro or a first-time speaker, we make the process easy and fast."
    },
    {
      icon: <CalendarIcon className="h-6 w-6" />,
      title: "For Every Occasion",
      description: "From weddings to corporate events to personal speeches, Speech Help adapts to all occasions. We're ready to help you prepare speeches that range from heartfelt to hilarious, and everything in between."
    },
    {
      icon: <CreditCardIcon className="h-6 w-6" />,
      title: "No Subscription Hassles",
      description: "Get started without a commitment. Try Speech Help with no pressure to buy. We believe in letting you see the value before making any decisions."
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
            Ever stared at a blank page and felt it judging you? Whether you're giving a wedding toast, rallying a team, or delivering a conference keynote, Speech Help is here to rescue you from idea paralysis and blank-page syndrome.
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
