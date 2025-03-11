
import { useEffect, useState, useRef } from "react";
import { Star, Quote } from "lucide-react";

interface TestimonialProps {
  quote: string;
  author: string;
  role: string;
  rating: number;
  index: number;
  isVisible: boolean;
}

const Testimonial = ({ quote, author, role, rating, index, isVisible }: TestimonialProps) => {
  return (
    <div 
      className={`bg-white rounded-xl p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col h-full transform hover:-translate-y-1 transition-transform duration-300 opacity-0 ${
        isVisible ? `animate-scale-in stagger-${index + 1}` : ''
      }`}
    >
      <div className="flex mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
          />
        ))}
      </div>
      <div className="mb-4 flex-grow">
        <Quote className="h-6 w-6 text-blue-200 mb-2" />
        <p className="text-gray-700">{quote}</p>
      </div>
      <div className="pt-4 border-t border-gray-100">
        <p className="font-medium">{author}</p>
        <p className="text-sm text-gray-500">{role}</p>
      </div>
    </div>
  );
};

const Testimonials = () => {
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

  const testimonials = [
    {
      quote: "SpeechHelp transformed my wedding toast from nervous rambling into a heartfelt message that brought tears and laughter. I couldn't be more grateful.",
      author: "Emily Johnson",
      role: "Wedding Speaker",
      rating: 5,
    },
    {
      quote: "As a business executive who regularly presents to stakeholders, this tool has cut my speech preparation time in half while improving quality tremendously.",
      author: "Michael Chen",
      role: "Marketing Director",
      rating: 5,
    },
    {
      quote: "My graduation speech needed to be perfect. SpeechHelp helped me create something truly memorable that reflected my journey and inspired my classmates.",
      author: "Sophia Rodriguez",
      role: "Valedictorian",
      rating: 5,
    },
    {
      quote: "I was terrified of public speaking until I found this app. Now I have the confidence to deliver powerful presentations that engage my audience.",
      author: "David Park",
      role: "Sales Manager",
      rating: 4,
    },
    {
      quote: "Our nonprofit uses SpeechHelp for all our fundraising events. The speeches it helps us create have significantly increased donor engagement and contributions.",
      author: "Sarah Williams",
      role: "Nonprofit Director",
      rating: 5,
    },
    {
      quote: "As someone who speaks at industry conferences, this tool has become indispensable. It helps me craft precise, authoritative content every time.",
      author: "James Taylor",
      role: "Tech Consultant",
      rating: 4,
    },
  ];

  return (
    <section id="testimonials" className="py-20 md:py-32 bg-gray-50 relative">
      <div className="container mx-auto px-6 md:px-12">
        <div className="max-w-3xl mx-auto text-center mb-16" ref={sectionRef}>
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100 mb-4 opacity-0 ${isVisible ? 'animate-fade-in' : ''}`}>
            Testimonials
          </span>
          <h2 className={`text-3xl md:text-4xl font-bold mb-6 opacity-0 ${isVisible ? 'animate-fade-in stagger-1' : ''}`}>
            Success Stories from <span className="text-gradient">Our Users</span>
          </h2>
          <p className={`text-lg text-gray-600 opacity-0 ${isVisible ? 'animate-fade-in stagger-2' : ''}`}>
            See how SpeechHelp has transformed the way people create and deliver impactful presentations across various contexts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Testimonial
              key={index}
              quote={testimonial.quote}
              author={testimonial.author}
              role={testimonial.role}
              rating={testimonial.rating}
              index={index}
              isVisible={isVisible}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
