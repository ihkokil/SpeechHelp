
import { useEffect, useState } from 'react';
import { MicIcon, SparklesIcon } from 'lucide-react';
import { ButtonCustom } from './ui/button-custom';

const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className="relative pt-36 pb-20 md:pt-44 md:pb-32 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-20 left-1/2 w-[500px] h-[500px] bg-blue-100 rounded-full blur-3xl opacity-30 transform -translate-x-1/2"></div>
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-indigo-100 rounded-full blur-3xl opacity-20"></div>
      </div>
      
      <div className="container relative z-10 mx-auto px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          {/* Pill Badge */}
          <div className={`inline-block mb-6 opacity-0 ${isLoaded ? 'animate-fade-in' : ''}`}>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
              <SparklesIcon className="mr-1 h-3 w-3" />
              <span>AI-Powered Speech Assistant</span>
            </span>
          </div>
          
          {/* Main Headline */}
          <h1 className={`text-4xl md:text-6xl lg:text-7xl font-bold leading-tight md:leading-tight lg:leading-tight mb-6 opacity-0 ${isLoaded ? 'animate-fade-in stagger-1' : ''}`}>
            Craft <span className="text-gradient">Powerful Speeches</span> With Intelligence & Precision
          </h1>
          
          {/* Subheadline */}
          <p className={`text-lg md:text-xl text-gray-600 max-w-3xl mb-8 opacity-0 ${isLoaded ? 'animate-fade-in stagger-2' : ''}`}>
            Empower your voice with our AI-driven web app, creating unforgettable speeches for every occasion with ease and precision. From weddings to business presentations, we help you make a lasting impression.
          </p>
          
          {/* CTA Buttons */}
          <div className={`flex flex-col sm:flex-row gap-4 mb-16 opacity-0 ${isLoaded ? 'animate-fade-in stagger-3' : ''}`}>
            <ButtonCustom variant="premium" size="xl" className="group">
              <span>Get Started for Free</span>
              <span className="absolute inset-0 w-full h-full rounded-md overflow-hidden">
                <span className="absolute -inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-600/20 animate-pulse-subtle transform -translate-y-full group-hover:translate-y-0 transition-transform duration-500"></span>
              </span>
            </ButtonCustom>
            <ButtonCustom variant="minimal" size="xl" className="hover-lift">
              <MicIcon className="mr-2 h-5 w-5" />
              <span>See How It Works</span>
            </ButtonCustom>
          </div>
          
          {/* Mockup/Preview */}
          <div className={`relative max-w-4xl mx-auto rounded-xl shadow-2xl opacity-0 overflow-hidden ${isLoaded ? 'animate-fade-in stagger-4' : ''}`}>
            <div className="aspect-video rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
              <div className="w-full h-full bg-white p-6">
                <div className="flex items-center mb-4 space-x-2">
                  <div className="h-3 w-3 rounded-full bg-red-400"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                  <div className="h-3 w-3 rounded-full bg-green-400"></div>
                  <div className="ml-4 text-xs text-gray-400">SpeechHelp — Crafting the perfect speech</div>
                </div>
                <div className="flex h-[calc(100%-24px)]">
                  <div className="w-1/3 border-r border-gray-100 p-4">
                    <div className="h-8 w-4/5 bg-gray-100 rounded-md mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-6 w-full bg-blue-50 rounded-md"></div>
                      <div className="h-6 w-full bg-gray-50 rounded-md"></div>
                      <div className="h-6 w-full bg-gray-50 rounded-md"></div>
                      <div className="h-6 w-full bg-gray-50 rounded-md"></div>
                    </div>
                  </div>
                  <div className="w-2/3 p-4">
                    <div className="h-8 w-3/5 bg-gray-100 rounded-md mb-8"></div>
                    <div className="space-y-2">
                      <div className="h-3 w-full bg-gray-100 rounded-md"></div>
                      <div className="h-3 w-full bg-gray-100 rounded-md"></div>
                      <div className="h-3 w-full bg-gray-100 rounded-md"></div>
                      <div className="h-3 w-11/12 bg-gray-100 rounded-md"></div>
                      <div className="h-3 w-full bg-gray-100 rounded-md"></div>
                      <div className="h-3 w-full bg-gray-100 rounded-md"></div>
                      <div className="h-3 w-4/5 bg-gray-100 rounded-md"></div>
                    </div>
                    <div className="mt-6 h-40 w-full bg-blue-50 rounded-md border border-blue-100 p-3">
                      <div className="flex items-center mb-2">
                        <div className="h-5 w-5 rounded-full bg-blue-500 mr-2"></div>
                        <div className="h-3 w-1/3 bg-blue-200 rounded-md"></div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-2 w-full bg-blue-200/50 rounded-md"></div>
                        <div className="h-2 w-full bg-blue-200/50 rounded-md"></div>
                        <div className="h-2 w-11/12 bg-blue-200/50 rounded-md"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
