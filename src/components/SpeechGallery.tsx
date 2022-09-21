
import { useEffect, useState, useRef } from 'react';

interface GalleryItemProps {
  image: string;
  title: string;
  isVisible: boolean;
  index: number;
}

const GalleryItem = ({ image, title, isVisible, index }: GalleryItemProps) => {
  return (
    <div className={`group relative rounded-md overflow-hidden opacity-0 ${isVisible ? `animate-fade-in delay-${index % 5 * 100}` : ''}`}>
      <img src={`${image}?auto=format&fit=crop&w=500&q=80`} alt={title} className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent opacity-70"></div>
      <div className="absolute bottom-0 left-0 p-3">
        <h3 className="text-white text-sm font-medium">{title}</h3>
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
    { image: "https://images.unsplash.com/photo-1475721027785-f74ec9c7180a", title: "Wedding Toast" },
    { image: "https://images.unsplash.com/photo-1560523159-6b681a1fc069", title: "Business Pitch" },
    { image: "https://images.unsplash.com/photo-1511578314322-379afb476865", title: "Graduation" },
    { image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0", title: "Corporate Meeting" },
    { image: "https://images.unsplash.com/photo-1561489413-985b06da5bee", title: "TEDx Talk" },
    { image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a", title: "Commencement" },
    { image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205", title: "Conference" },
    { image: "https://images.unsplash.com/photo-1551818255-e6e10975bc17", title: "Keynote" },
    { image: "https://images.unsplash.com/photo-1569779213435-ba3167ecfcbe", title: "Award Ceremony" },
    { image: "https://images.unsplash.com/photo-1528605248644-14dd04022da1", title: "Campaign Rally" },
    { image: "https://images.unsplash.com/photo-1507608158173-1dcec673a2e5", title: "Retirement Party" },
    { image: "https://images.unsplash.com/photo-1535979014625-7d3476ff3f8b", title: "Award Acceptance" },
    { image: "https://images.unsplash.com/photo-1557804506-669a67965ba0", title: "Public Debate" },
    { image: "https://images.unsplash.com/photo-1559223607-a43c990c692c", title: "Birthday Party" },
    { image: "https://images.unsplash.com/photo-1530023367847-a683933f4172", title: "Memorial Service" },
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

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {speeches.map((speech, index) => (
            <GalleryItem
              key={index}
              image={speech.image}
              title={speech.title}
              isVisible={isVisible}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SpeechGallery;
