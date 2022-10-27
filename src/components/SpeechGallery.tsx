import { useEffect, useState, useRef } from 'react';
import { 
  Heart, 
  GraduationCap, 
  Cake, 
  Briefcase,
  Mic, 
  Flame, 
  Flower, 
  Speaker,
  Users,
  Hand,
  BookOpen,
  Megaphone,
  Music,
  Armchair,
  Award,
  CalendarDays
} from 'lucide-react';

interface GalleryItemProps {
  image: string;
  title: string;
  subtitle?: string;
  isVisible: boolean;
  index: number;
  icon: JSX.Element;
}

const GalleryItem = ({ image, title, subtitle, isVisible, index, icon }: GalleryItemProps) => {
  return (
    <div className={`group relative rounded-md overflow-hidden opacity-0 ${isVisible ? `animate-fade-in delay-${index % 5 * 100}` : ''}`}>
      <img src={image} alt={title} className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent opacity-70"></div>
      <div className="absolute top-3 right-3 bg-pink-600 rounded-full p-1.5 text-white">
        {icon}
      </div>
      <div className="absolute bottom-0 left-0 p-3">
        <h3 className="text-white text-sm font-medium">{title}</h3>
        {subtitle && <p className="text-white/70 text-xs mt-1">{subtitle}</p>}
      </div>
    </div>
  );
};

const SpeechGallery = () => {
  const [isVisible, setIsVisible] = useState(false);
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (galleryRef.current) {
      observer.observe(galleryRef.current);
    }

    return () => {
      if (galleryRef.current) {
        observer.unobserve(galleryRef.current);
      }
    };
  }, []);

  const speeches = [
    { 
      image: "/lovable-uploads/33c67c99-8bf4-4acf-8736-21af0686d079.png",
      title: "Wedding Speech",
      subtitle: "Best Man, Maid of Honor, Father/Mother of the Bride, Groom, Bride",
      icon: <Heart className="h-4 w-4" />
    },
    { 
      image: "/lovable-uploads/9be03b29-2155-4883-8cab-d839e223604b.png",
      title: "Graduation Speech",
      subtitle: "Commencement Address, Valedictorian Speech",
      icon: <GraduationCap className="h-4 w-4" />
    },
    { 
      image: "/lovable-uploads/8a6c2e93-6843-4eb9-8b07-e8456c653de8.png",
      title: "Birthday/Anniversary Speech",
      subtitle: "Special Occasion Celebrations",
      icon: <Cake className="h-4 w-4" />
    },
    { 
      image: "/lovable-uploads/77293a90-2a43-4957-8542-0613049ec390.png",
      title: "Business Speech",
      subtitle: "Sales Pitch, Team Meeting, Corporate Training, Product Launch",
      icon: <Briefcase className="h-4 w-4" />
    },
    { 
      image: "/lovable-uploads/e4a82c35-24f4-4a85-bfa6-cdf784a2aeea.png",
      title: "TED Talk",
      subtitle: "Inspirational and Educational Talks",
      icon: <Mic className="h-4 w-4" />
    },
    { 
      image: "/lovable-uploads/fa0501ec-e268-4b60-8823-33cccfc3f9c9.png", 
      title: "Motivational Speech",
      subtitle: "Inspiring and Uplifting Messages",
      icon: <Flame className="h-4 w-4" />
    },
    { 
      image: "/lovable-uploads/6b579e66-022a-4509-a23a-be31636b6aa7.png",
      title: "Funeral/Commemorative Speech",
      subtitle: "Eulogy, Funeral Speech",
      icon: <Flower className="h-4 w-4" />
    },
    { 
      image: "/lovable-uploads/003145b7-6fd4-4884-aff4-22d532ef961f.png",
      title: "Keynote Address",
      subtitle: "Conference and Event Keynotes",
      icon: <Speaker className="h-4 w-4" />
    },
    { 
      image: "/lovable-uploads/792f3ee8-f60a-42c3-8537-923c72ec3992.png",
      title: "Social Speech",
      subtitle: "After-Dinner Speech, Toast, Roast",
      icon: <Users className="h-4 w-4" />
    },
    { 
      image: "/lovable-uploads/c0a526b7-d971-41ab-afd7-3345ffe18a83.png",
      title: "Farewell Speech",
      subtitle: "Goodbye Messages and Tributes",
      icon: <Hand className="h-4 w-4" />
    },
    { 
      image: "/lovable-uploads/aeaae355-f442-4199-9e24-7e5be18d5085.png",
      title: "Informative Speech",
      subtitle: "Informative Speech, Demonstrative Speech",
      icon: <BookOpen className="h-4 w-4" />
    },
    { 
      image: "/lovable-uploads/2bc35e53-2bc5-4af1-9a59-637cecc0e333.png",
      title: "Persuasive Speech",
      subtitle: "Persuasive Speech, Political Campaign Speech",
      icon: <Megaphone className="h-4 w-4" />
    },
    { 
      image: "/lovable-uploads/eb584538-b84a-4ada-82a3-3a65ba072531.png",
      title: "Entertaining Speech",
      subtitle: "Humorous and Engaging Presentations",
      icon: <Music className="h-4 w-4" />
    },
    { 
      image: "/lovable-uploads/2759cdfb-30f5-48e6-bbcc-7076095f6195.png",
      title: "Retirement Speech",
      subtitle: "Career Celebration and Reflections",
      icon: <Armchair className="h-4 w-4" />
    },
    { 
      image: "https://images.unsplash.com/photo-1551818255-e6e10975bc17",
      title: "Award Ceremony Speech",
      subtitle: "Award Presentation Speech, Award Acceptance Speech",
      icon: <Award className="h-4 w-4" />
    },
    { 
      image: "https://images.unsplash.com/photo-1560523159-6b681a1fc069",
      title: "Other Speech/Special Event",
      subtitle: "For Any Unique Occasion",
      icon: <CalendarDays className="h-4 w-4" />
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-6 md:px-12" ref={galleryRef}>
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className={`text-3xl md:text-4xl font-bold mb-6 opacity-0 ${isVisible ? 'animate-fade-in' : ''}`}>
            Speech for <span className="text-pink-600">Every Occasion</span>
          </h2>
          <p className={`text-lg text-gray-600 opacity-0 ${isVisible ? 'animate-fade-in stagger-1' : ''}`}>
            We offer speech templates and assistance for all types of events and occasions
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {speeches.map((speech, index) => (
            <GalleryItem
              key={index}
              image={speech.image}
              title={speech.title}
              subtitle={speech.subtitle}
              isVisible={isVisible}
              index={index}
              icon={speech.icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SpeechGallery;
