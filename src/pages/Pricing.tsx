
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PricingHeader from '@/components/pricing/PricingHeader';
import PricingPeriodToggle from '@/components/pricing/PricingPeriodToggle';
import PricingTiers from '@/components/pricing/PricingTiers';
import ContactSalesSection from '@/components/pricing/ContactSalesSection';

type PricingPeriod = 'monthly' | 'yearly';

const Pricing = () => {
  const [pricingPeriod, setPricingPeriod] = useState<PricingPeriod>('monthly');
  
  useEffect(() => {
    // Immediately scroll to top when the component mounts
    window.scrollTo({
      top: 0,
      behavior: 'instant'
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
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
