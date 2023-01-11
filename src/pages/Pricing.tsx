
import { useState } from 'react';
import { Check, Sparkle, Unlock, Clock, Mail, Edit, MessageCircle, Star } from 'lucide-react';
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
  features: {
    text: string;
    description?: string;
    icon?: React.ReactNode;
  }[];
};

const pricingTiers: PricingTier[] = [
  {
    name: 'Basic / Free Trial',
    price: {
      monthly: '$0.00',
      yearly: 'Free Trial',
    },
    description: 'Perfect for individuals starting their speaking journey',
    features: [
      {
        text: 'One-Time Wonder: Craft a Single Speech for Any Occasion',
        description: 'Perfect for those special moments that need the perfect words.',
        icon: <Sparkle className="h-5 w-5 text-pink-500 mr-2 mt-0.5 flex-shrink-0" />
      },
      {
        text: 'Unlock Expert Tips: Explore Our Speech Writing Secrets',
        description: 'Access valuable insights to enhance your speech-writing skills.',
        icon: <Unlock className="h-5 w-5 text-pink-500 mr-2 mt-0.5 flex-shrink-0" />
      },
      {
        text: '7-Day Access: Revisit and Refine Your Speech Anytime',
        description: 'Enjoy a full week to access your speech file and our robust system.',
        icon: <Clock className="h-5 w-5 text-pink-500 mr-2 mt-0.5 flex-shrink-0" />
      }
    ],
  },
  {
    name: 'Premium Plan',
    price: {
      monthly: '$9.99',
      yearly: '$99.99',
    },
    description: 'For serious speakers who need more power',
    features: [
      {
        text: 'Craft Up to 3 Speeches per Month: Speak with Confidence',
        description: 'Enjoy the freedom to create up to 3 speeches for any occasion each month.',
        icon: <Star className="h-5 w-5 text-pink-500 mr-2 mt-0.5 flex-shrink-0" />
      },
      {
        text: 'Advanced Speech Writing Insights: Elevate Your Skills',
        description: 'Dive deeper with advanced tips and techniques to enhance your speech-writing prowess.',
        icon: <Edit className="h-5 w-5 text-pink-500 mr-2 mt-0.5 flex-shrink-0" />
      },
      {
        text: 'Continuous Access: Manage and Modify Speeches Anytime',
        description: 'Keep your speeches handy with ongoing access, allowing you to update and refine whenever needed (as long as your subscription is active).',
        icon: <Clock className="h-5 w-5 text-pink-500 mr-2 mt-0.5 flex-shrink-0" />
      },
      {
        text: 'Personalized Feedback: Expert Guidance at Your Fingertips',
        description: 'Receive tailored feedback from our AI to ensure your speeches are impactful and engaging.',
        icon: <MessageCircle className="h-5 w-5 text-pink-500 mr-2 mt-0.5 flex-shrink-0" />
      },
      {
        text: 'Priority Email Support: Get Help When You Need It',
        description: 'Access our dedicated support team for quick assistance and guidance.',
        icon: <Mail className="h-5 w-5 text-pink-500 mr-2 mt-0.5 flex-shrink-0" />
      }
    ],
  },
  {
    name: 'Pro Plan',
    price: {
      monthly: '$29.99',
      yearly: '$299.99',
    },
    description: 'Full-featured plan for professional speakers',
    features: [
      {
        text: 'Unlimited Speech Creations: Master Every Occasion',
        description: 'Create an unlimited number of speeches for any event, ensuring you\'re always prepared.',
        icon: <Star className="h-5 w-5 text-pink-500 mr-2 mt-0.5 flex-shrink-0" />
      },
      {
        text: 'Comprehensive Speech Toolkit: Elevate Your Craft',
        description: 'Access an extensive library of resources and templates tailored for various speech types.',
        icon: <Edit className="h-5 w-5 text-pink-500 mr-2 mt-0.5 flex-shrink-0" />
      },
      {
        text: 'Ongoing Access: Your Speech Vault',
        description: 'Maintain continuous access to all your speeches and materials, allowing for updates and refinements anytime.',
        icon: <Clock className="h-5 w-5 text-pink-500 mr-2 mt-0.5 flex-shrink-0" />
      },
      {
        text: 'Enhanced Personalized Feedback: Expert Guidance at Your Fingertips',
        description: 'Benefit from advanced, tailored feedback from our AI to maximize the impact of your speeches.',
        icon: <MessageCircle className="h-5 w-5 text-pink-500 mr-2 mt-0.5 flex-shrink-0" />
      },
      {
        text: 'Fast-Track Support: Direct Assistance, Anytime',
        description: 'Experience expedited support for immediate assistance and a seamless experience.',
        icon: <Mail className="h-5 w-5 text-pink-500 mr-2 mt-0.5 flex-shrink-0" />
      }
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

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingTiers.map((tier) => (
              <Card key={tier.name} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6 md:p-8">
                  <h3 className="text-2xl font-bold text-center text-gray-900 mb-2">{tier.name}</h3>
                  <div className="flex items-end justify-center mb-6">
                    <span className="text-4xl font-bold text-purple-600">
                      {pricingPeriod === 'monthly' ? tier.price.monthly : tier.price.yearly}
                    </span>
                    {pricingPeriod === 'monthly' && tier.name !== 'Basic / Free Trial' && (
                      <span className="text-gray-500 ml-2">/month</span>
                    )}
                    {pricingPeriod === 'yearly' && tier.name !== 'Basic / Free Trial' && (
                      <span className="text-gray-500 ml-2">/year</span>
                    )}
                  </div>
                  <p className="text-center text-gray-600 mb-6">{tier.description}</p>
                  
                  <ul className="space-y-4 mb-8">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex flex-col">
                        <div className="flex items-start">
                          {feature.icon}
                          <span className="text-gray-700 font-medium">{feature.text}</span>
                        </div>
                        {feature.description && (
                          <p className="text-sm text-gray-500 ml-7 mt-1">{feature.description}</p>
                        )}
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full ${
                      tier.name === 'Premium Plan' 
                        ? 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700' 
                        : 'bg-purple-600 hover:bg-purple-700'
                    }`}
                  >
                    {tier.name === 'Basic / Free Trial' ? 'Start Free Trial' : 'Choose Plan'}
                  </Button>
                  
                  <p className="text-xs text-center text-gray-500 mt-4">
                    {tier.name === 'Basic / Free Trial' 
                      ? 'No credit card required' 
                      : 'Trial ends on November 29, 2024'}
                  </p>
                </div>
              </Card>
            ))}
          </div>

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
