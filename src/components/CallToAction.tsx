
import { useEffect, useState } from 'react';
import { ArrowRight, CheckIcon } from 'lucide-react';
import { ButtonCustom } from './ui/button-custom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/translations';
import Translate from '@/components/Translate';

const CallToAction = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation();

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
    "cta.benefit1",
    "cta.benefit2",
    "cta.benefit3",
    "cta.benefit4"
  ];

  const proFeatures = [
    "cta.proFeature1",
    "cta.proFeature2",
    "cta.proFeature3",
    "cta.proFeature4"
  ];

  return (
    <section id="pricing" className="py-20 md:py-32 relative">
      <div id="cta-section" className="container mx-auto px-6 md:px-12">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl overflow-hidden shadow-xl">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-3/5 p-8 md:p-12 text-white">
              <h2 className={`text-3xl md:text-4xl font-bold mb-6 opacity-0 ${isVisible ? 'animate-fade-in' : ''}`}>
                <Translate text="headers.readyTransform" />
              </h2>
              <p className={`text-blue-100 text-lg mb-8 opacity-0 ${isVisible ? 'animate-fade-in stagger-1' : ''}`}>
                <Translate text="cta.subtitle" />
              </p>
              
              <div className={`space-y-3 mb-8 opacity-0 ${isVisible ? 'animate-fade-in stagger-2' : ''}`}>
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center">
                    <CheckIcon className="h-5 w-5 text-blue-200 mr-2 flex-shrink-0" />
                    <span><Translate text={benefit} /></span>
                  </div>
                ))}
              </div>
              
              <ButtonCustom 
                variant="minimal" 
                size="xl" 
                className={`group opacity-0 ${isVisible ? 'animate-fade-in stagger-3' : ''}`}
              >
                <span><Translate text="cta.trialButton" /></span>
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </ButtonCustom>
            </div>
            
            <div className="md:w-2/5 bg-white p-8 md:p-12">
              <div className={`bg-blue-50 p-6 rounded-xl border border-blue-100 mb-6 opacity-0 ${isVisible ? 'animate-scale-in stagger-1' : ''}`}>
                <h3 className="text-xl font-bold text-gray-900 mb-4"><Translate text="cta.proTitle" /></h3>
                <div className="flex items-end mb-6">
                  <span className="text-4xl font-bold text-gray-900"><Translate text="cta.proPrice" /></span>
                  <span className="text-gray-500 ml-2"><Translate text="cta.proPeriod" /></span>
                </div>
                <ul className="space-y-3 mb-6">
                  {proFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckIcon className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                      <span className="text-gray-600"><Translate text={feature} /></span>
                    </li>
                  ))}
                </ul>
                <ButtonCustom variant="premium" size="lg" className="w-full">
                  <Translate text="cta.proButton" />
                </ButtonCustom>
              </div>
              
              <p className={`text-sm text-gray-500 text-center opacity-0 ${isVisible ? 'animate-fade-in stagger-2' : ''}`}>
                <Translate text="cta.enterprise" />
                <a href="#" className="text-blue-600 hover:text-blue-700 ml-1">
                  <Translate text="cta.contactUs" />
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
