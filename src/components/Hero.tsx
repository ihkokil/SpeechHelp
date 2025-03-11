
import { useEffect, useState } from 'react';
import { PlayCircle } from 'lucide-react';
import { ButtonCustom } from './ui/button-custom';

const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className="hero-bg text-white pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      <div className="container relative z-10 mx-auto px-6 md:px-12">
        <div className="max-w-5xl mx-auto text-center">
          {/* Add a semi-transparent background to text content for better readability */}
          <div className="bg-black/30 backdrop-blur-sm p-6 rounded-xl inline-block w-full md:w-auto">
            {/* Main Headline */}
            <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold leading-tight md:leading-tight lg:leading-tight mb-4 opacity-0 ${isLoaded ? 'animate-fade-in' : ''}`}>
              <span className="font-phenix">Need a</span> <span className="text-pink-400">creative speech?</span>
            </h1>
            
            {/* Subheadline */}
            <p className={`text-lg md:text-2xl text-white/80 max-w-3xl mx-auto mb-8 opacity-0 ${isLoaded ? 'animate-fade-in stagger-1' : ''}`}>
              We can help!
            </p>
            
            {/* Play button */}
            <div className={`flex justify-center items-center mb-10 opacity-0 ${isLoaded ? 'animate-fade-in stagger-2' : ''}`}>
              <div className="relative inline-block">
                <div className="absolute inset-0 rounded-full bg-pink-500/30 animate-ping"></div>
                <PlayCircle className="h-16 w-16 text-pink-500 relative z-10 cursor-pointer hover:text-pink-400 transition-colors" />
              </div>
            </div>
            
            {/* CTA Button */}
            <div className={`flex justify-center mb-12 opacity-0 ${isLoaded ? 'animate-fade-in stagger-3' : ''}`}>
              <ButtonCustom variant="magenta" size="lg" className="group">
                <span>Try it Now</span>
              </ButtonCustom>
            </div>
            
            {/* Features/Benefits Icons */}
            <div className={`grid grid-cols-3 gap-4 md:gap-8 max-w-3xl mx-auto mt-8 opacity-0 ${isLoaded ? 'animate-fade-in stagger-4' : ''}`}>
              <div className="text-center">
                <div className="rounded-full bg-pink-600 h-10 w-10 flex items-center justify-center mx-auto mb-2">
                  <span className="text-base font-bold">AI</span>
                </div>
                <p className="text-gray-300 text-sm">Smart Analysis</p>
              </div>
              <div className="text-center">
                <div className="rounded-full bg-pink-600 h-10 w-10 flex items-center justify-center mx-auto mb-2">
                  <span className="text-base font-bold">⌛</span>
                </div>
                <p className="text-gray-300 text-sm">Quick Results</p>
              </div>
              <div className="text-center">
                <div className="rounded-full bg-pink-600 h-10 w-10 flex items-center justify-center mx-auto mb-2">
                  <span className="text-base font-bold">★</span>
                </div>
                <p className="text-gray-300 text-sm">Premium Quality</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
