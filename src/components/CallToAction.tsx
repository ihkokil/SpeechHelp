
import { useEffect, useState } from 'react';
import { ArrowRight, CheckIcon } from 'lucide-react';
import { ButtonCustom } from './ui/button-custom';

const CallToAction = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById('cta-section');
    if (section) {
      observer.observe(section);
    }

    return () => {
      if (section) {
        observer.unobserve(section);
      }
    };
  }, []);

  const benefits = [
    "Free trial with full access to all features",
    "No credit card required to start",
    "Cancel anytime, no commitments",
    "24/7 support from our team"
  ];

  return (
    <section id="pricing" className="py-20 md:py-32 relative">
      <div 
        id="cta-section"
        className="container mx-auto px-6 md:px-12">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl overflow-hidden shadow-xl">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-3/5 p-8 md:p-12 text-white">
              <h2 className={`text-3xl md:text-4xl font-bold mb-6 opacity-0 ${isVisible ? 'animate-fade-in' : ''}`}>
                Ready to Transform Your Public Speaking?
              </h2>
              <p className={`text-blue-100 text-lg mb-8 opacity-0 ${isVisible ? 'animate-fade-in stagger-1' : ''}`}>
                Join thousands of professionals who use SpeechHelp to create and deliver impactful presentations. Start your journey today.
              </p>
              
              <div className={`space-y-3 mb-8 opacity-0 ${isVisible ? 'animate-fade-in stagger-2' : ''}`}>
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center">
                    <CheckIcon className="h-5 w-5 text-blue-200 mr-2 flex-shrink-0" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
              
              <ButtonCustom 
                variant="minimal" 
                size="xl" 
                className={`group opacity-0 ${isVisible ? 'animate-fade-in stagger-3' : ''}`}
              >
                <span>Start Free Trial</span>
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </ButtonCustom>
            </div>
            
            <div className="md:w-2/5 bg-white p-8 md:p-12">
              <div className={`bg-blue-50 p-6 rounded-xl border border-blue-100 mb-6 opacity-0 ${isVisible ? 'animate-scale-in stagger-1' : ''}`}>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Pro Plan</h3>
                <div className="flex items-end mb-6">
                  <span className="text-4xl font-bold text-gray-900">$19</span>
                  <span className="text-gray-500 ml-2">/month</span>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                    <span className="text-gray-600">Unlimited AI speech generation</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                    <span className="text-gray-600">Advanced templates library</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                    <span className="text-gray-600">Delivery coaching tools</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                    <span className="text-gray-600">Export in multiple formats</span>
                  </li>
                </ul>
                <ButtonCustom variant="premium" size="lg" className="w-full">
                  Choose Pro Plan
                </ButtonCustom>
              </div>
              
              <p className={`text-sm text-gray-500 text-center opacity-0 ${isVisible ? 'animate-fade-in stagger-2' : ''}`}>
                We also offer Enterprise plans for teams.
                <a href="#" className="text-blue-600 hover:text-blue-700 ml-1">
                  Contact us
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
