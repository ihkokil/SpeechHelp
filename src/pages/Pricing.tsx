
import { useState, useEffect } from 'react';
import Footer from '@/components/Footer';
import PricingHeader from '@/components/pricing/PricingHeader';
import PricingPeriodToggle from '@/components/pricing/PricingPeriodToggle';
import PricingTiers from '@/components/pricing/PricingTiers';
import ContactSalesSection from '@/components/pricing/ContactSalesSection';

type PricingPeriod = 'monthly' | 'yearly';

const Pricing = () => {
  const [pricingPeriod, setPricingPeriod] = useState<PricingPeriod>('monthly');
  
  useEffect(() => {
    // Immediately scroll to top when the component mounts, with no delay
    window.scrollTo({
      top: 0,
      behavior: 'instant' // Using 'instant' instead of 'smooth' for immediate effect
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {/* Added additional padding at the top to prevent header from being cut off */}
        <section className="container mx-auto px-4 md:px-6 pt-24 pb-16 md:pb-24">
          <PricingHeader />
          <PricingPeriodToggle 
            pricingPeriod={pricingPeriod} 
            setPricingPeriod={setPricingPeriod} 
          />
          <PricingTiers pricingPeriod={pricingPeriod} />
          <ContactSalesSection />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Pricing;
