
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import PricingFeature from './PricingFeature';

type PricingPeriod = 'monthly' | 'yearly';

interface PricingTierProps {
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
  pricingPeriod: PricingPeriod;
}

const PricingTier: React.FC<PricingTierProps> = ({
  name,
  price,
  description,
  features,
  pricingPeriod,
}) => {
  return (
    <Card className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6 md:p-8">
        <h3 className="text-2xl font-bold text-center text-gray-900 mb-2">{name}</h3>
        <div className="flex items-end justify-center mb-6">
          <span className="text-4xl font-bold text-purple-600">
            {pricingPeriod === 'monthly' ? price.monthly : price.yearly}
          </span>
          {pricingPeriod === 'monthly' && name !== 'Basic / Free Trial' && (
            <span className="text-gray-500 ml-2">/month</span>
          )}
          {pricingPeriod === 'yearly' && name !== 'Basic / Free Trial' && (
            <span className="text-gray-500 ml-2">/year</span>
          )}
        </div>
        <p className="text-center text-gray-600 mb-6">{description}</p>
        
        <ul className="space-y-4 mb-8">
          {features.map((feature, index) => (
            <PricingFeature 
              key={index} 
              text={feature.text} 
              description={feature.description} 
              icon={feature.icon} 
            />
          ))}
        </ul>
        
        {name === 'Basic / Free Trial' ? (
          <Link to="/auth?signup=true">
            <Button 
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
            >
              Start Free Trial
            </Button>
          </Link>
        ) : (
          <Button 
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
          >
            Choose Plan
          </Button>
        )}
        
        <p className="text-xs text-center text-gray-500 mt-4">
          {name === 'Basic / Free Trial' ? 'No credit card required' : ''}
        </p>
      </div>
    </Card>
  );
};

export default PricingTier;
