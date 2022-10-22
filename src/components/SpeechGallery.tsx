
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
      image: "https://images.unsplash.com/photo-1627556592933-ffe99c1cd9eb",
      title: "Graduation Speech",
      subtitle: "Commencement Address, Valedictorian Speech",
      icon: <GraduationCap className="h-4 w-4" />
    },
    { 
      image: "https://images.unsplash.com/photo-1559223607-a43c990c692c",
      title: "Birthday/Anniversary Speech",
      subtitle: "Special Occasion Celebrations",
      icon: <Cake className="h-4 w-4" />
    },
    { 
      image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0",
      title: "Business Speech",
      subtitle: "Sales Pitch, Team Meeting, Corporate Training, Product Launch",
      icon: <Briefcase className="h-4 w-4" />
    },
    { 
      image: "https://images.unsplash.com/photo-1561489413-985b06da5bee",
      title: "TED Talk",
      subtitle: "Inspirational and Educational Talks",
      icon: <Mic className="h-4 w-4" />
    },
    { 
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b", 
      title: "Motivational Speech",
      subtitle: "Inspiring and Uplifting Messages",
      icon: <Flame className="h-4 w-4" />
    },
    { 
      image: "https://images.unsplash.com/photo-1530023367847-a683933f4172",
      title: "Funeral/Commemorative Speech",
      subtitle: "Eulogy, Funeral Speech",
      icon: <Flower className="h-4 w-4" />
    },
    { 
      image: "https://images.unsplash.com/photo-1557804506-669a67965ba0",
      title: "Keynote Address",
      subtitle: "Conference and Event Keynotes",
      icon: <Speaker className="h-4 w-4" />
    },
    { 
      image: "https://images.unsplash.com/photo-1507608158173-1dcec673a2e5",
      title: "Social Speech",
      subtitle: "After-Dinner Speech, Toast, Roast",
      icon: <Users className="h-4 w-4" />
    },
    { 
      image: "https://images.unsplash.com/photo-1528605248644-14dd04022da1",
      title: "Farewell Speech",
      subtitle: "Goodbye Messages and Tributes",
      icon: <Hand className="h-4 w-4" />
    },
    { 
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
      title: "Informative Speech",
      subtitle: "Informative Speech, Demonstrative Speech",
      icon: <BookOpen className="h-4 w-4" />
    },
    { 
      image: "https://images.unsplash.com/photo-1569779213435-ba3167ecfcbe",
      title: "Persuasive Speech",
      subtitle: "Persuasive Speech, Political Campaign Speech",
      icon: <Megaphone className="h-4 w-4" />
    },
    { 
      image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a",
      title: "Entertaining Speech",
      subtitle: "Humorous and Engaging Presentations",
      icon: <Music className="h-4 w-4" />
    },
    { 
      image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205",
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
