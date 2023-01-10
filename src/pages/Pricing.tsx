
import { useState } from 'react';
import { Check } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

type PricingPeriod = 'monthly' | 'yearly';

type PricingTier = {
  name: string;
  price: {
    monthly: string;
    yearly: string;
  };
  description: string;
  features: string[];
};

const pricingTiers: PricingTier[] = [
  {
    name: 'Basic',
    price: {
      monthly: '$9.99',
      yearly: '$99.99',
    },
    description: 'Perfect for individuals starting their speaking journey',
    features: [
      'Unlimited AI Prompts',
      'Explore Speech Tips',
      'Save Speech',
      'Basic Templates',
      'Email Support'
    ],
  },
  {
    name: 'Premium',
    price: {
      monthly: '$19.99',
      yearly: '$199.99',
    },
    description: 'For serious speakers who need more power',
    features: [
      'Unlimited AI Prompts',
      'Explore Speech Tips',
      'Save Speech',
      'Premium Templates',
      'Priority Support',
      'Speech Analytics',
      'Delivery Practice Tools'
    ],
  },
  {
    name: 'Pro',
    price: {
      monthly: '$29.99',
      yearly: '$299.99',
    },
    description: 'Full-featured plan for professional speakers',
    features: [
      'Unlimited AI Prompts',
      'Explore Speech Tips',
      'Save Speech',
      'All Templates',
      '24/7 Support',
      'Advanced Analytics',
      'AI Speech Coach',
      'Audience Engagement Tools',
      'Team Collaboration'
    ],
  },
];

const Pricing = () => {
  const [pricingPeriod, setPricingPeriod] = useState<PricingPeriod>('monthly');

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <section className="container mx-auto px-4 md:px-6 py-12 md:py-24">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600">
              Affordable Plans for Everyone
            </h1>
            <p className="text-lg text-gray-600">
              Find the perfect plan that suits your needs.
            </p>
          </div>

          {/* Pricing Toggle */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setPricingPeriod('monthly')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  pricingPeriod === 'monthly'
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                    : 'text-gray-700 hover:text-purple-600'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setPricingPeriod('yearly')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  pricingPeriod === 'yearly'
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                    : 'text-gray-700 hover:text-purple-600'
                }`}
              >
                Yearly
              </button>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingTiers.map((tier) => (
              <Card key={tier.name} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6 md:p-8">
                  <h3 className="text-2xl font-bold text-center text-gray-900 mb-2">{tier.name}</h3>
                  <div className="flex items-end justify-center mb-6">
                    <span className="text-4xl font-bold text-purple-600">
                      {pricingPeriod === 'monthly' ? tier.price.monthly : tier.price.yearly}
                    </span>
                    <span className="text-gray-500 ml-2">
                      /{pricingPeriod === 'monthly' ? 'month' : 'year'}
                    </span>
                  </div>
                  <p className="text-center text-gray-600 mb-6">{tier.description}</p>
                  
                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start">
                        <Check className="h-5 w-5 text-pink-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full ${
                      tier.name === 'Premium' 
                        ? 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700' 
                        : 'bg-purple-600 hover:bg-purple-700'
                    }`}
                  >
                    Choose Plan
                  </Button>
                  
                  <p className="text-xs text-center text-gray-500 mt-4">
                    Trial ends on November 29, 2024
                  </p>
                </div>
              </Card>
            ))}
          </div>

          {/* Additional Info */}
          <div className="mt-16 max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Need a Custom Solution?</h2>
            <p className="text-gray-600 mb-6">
              We offer custom enterprise plans for teams and organizations.
              Contact us to discuss your specific needs.
            </p>
            <Button variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50">
              Contact Sales
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Pricing;
