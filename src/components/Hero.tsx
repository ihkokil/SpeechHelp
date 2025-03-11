
import { useEffect, useState } from 'react';
import { PlayCircle } from 'lucide-react';
import { ButtonCustom } from './ui/button-custom';

const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className="hero-bg text-white pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      <div className="container relative z-10 mx-auto px-6 md:px-12">
        <div className="max-w-5xl mx-auto text-center">
          {/* Main Headline */}
          <h1 className={`text-4xl md:text-6xl lg:text-7xl font-bold leading-tight md:leading-tight lg:leading-tight mb-6 opacity-0 ${isLoaded ? 'animate-fade-in' : ''}`}>
            Need a <span className="text-pink-500">creative speech?</span>
          </h1>
          
          {/* Subheadline */}
          <p className={`text-lg md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8 opacity-0 ${isLoaded ? 'animate-fade-in stagger-1' : ''}`}>
            We can help!
          </p>
          
          {/* CTA Button */}
          <div className={`flex justify-center mb-16 opacity-0 ${isLoaded ? 'animate-fade-in stagger-2' : ''}`}>
            <ButtonCustom variant="pink" size="xl" className="group">
              <PlayCircle className="mr-2 h-5 w-5" />
              <span>See How It Works</span>
            </ButtonCustom>
          </div>
          
          {/* Icons/Benefits */}
          <div className={`grid grid-cols-3 gap-8 max-w-3xl mx-auto mt-16 opacity-0 ${isLoaded ? 'animate-fade-in stagger-3' : ''}`}>
            <div className="text-center">
              <div className="rounded-full bg-pink-600 h-12 w-12 flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold">1</span>
              </div>
              <p className="text-gray-300">Unique Formats</p>
            </div>
            <div className="text-center">
              <div className="rounded-full bg-pink-600 h-12 w-12 flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold">2</span>
              </div>
              <p className="text-gray-300">Smart Templates</p>
            </div>
            <div className="text-center">
              <div className="rounded-full bg-pink-600 h-12 w-12 flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold">3</span>
              </div>
              <p className="text-gray-300">AI-Powered</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
