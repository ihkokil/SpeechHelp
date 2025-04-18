
import { useEffect, useState, useRef } from 'react';
import { Star, Quote } from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/translations';
import Translate from '@/components/Translate';

interface TestimonialProps {
  quoteKey: string;
  authorKey: string;
  roleKey: string;
  avatar: string;
  isVisible: boolean;
}

const Testimonial = ({ quoteKey, authorKey, roleKey, avatar, isVisible }: TestimonialProps) => {
  return (
    <div 
      className={`bg-white rounded-lg p-6 shadow-sm border border-gray-100 flex flex-col opacity-0 ${
        isVisible ? 'animate-scale-in' : ''
      }`}
    >
      <div className="flex items-center mb-4">
        <img src={avatar} alt="User avatar" className="w-12 h-12 rounded-full mr-4 object-cover border-2 border-pink-100" />
        <div>
          <p className="font-medium text-gray-900"><Translate text={authorKey} /></p>
          <p className="text-sm text-gray-500"><Translate text={roleKey} /></p>
        </div>
      </div>
      <div className="mb-4">
        <Quote className="h-5 w-5 text-pink-300 mb-2" />
        <p className="text-gray-700 italic"><Translate text={quoteKey} /></p>
      </div>
      <div className="flex mt-auto pt-4 border-t border-gray-100">
        <div className="flex">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className="h-4 w-4 text-pink-500 fill-pink-500"
            />
          ))}
        </div>
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
      quoteKey: 'testimonials.quote1',
      authorKey: 'testimonials.author1',
      roleKey: 'testimonials.role1',
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    }
  ];

  return (
    <section id="testimonials" className="py-16 md:py-24 relative">
      <div className="container mx-auto px-6 md:px-12">
        <div className="max-w-3xl mx-auto text-center mb-12" ref={sectionRef}>
          <h2 className={`text-3xl md:text-4xl font-bold mb-6 opacity-0 ${isVisible ? 'animate-fade-in' : ''}`}>
            <Translate text="headers.whatClientsAboutUs" />
          </h2>
        </div>

        <div className="max-w-3xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Testimonial
              key={index}
              quoteKey={testimonial.quoteKey}
              authorKey={testimonial.authorKey}
              roleKey={testimonial.roleKey}
              avatar={testimonial.avatar}
              isVisible={isVisible}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
