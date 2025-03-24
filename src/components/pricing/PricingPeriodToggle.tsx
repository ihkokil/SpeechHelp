
import React from 'react';

type PricingPeriod = 'monthly' | 'yearly';

interface PricingPeriodToggleProps {
  pricingPeriod: PricingPeriod;
  setPricingPeriod: (period: PricingPeriod) => void;
}

const PricingPeriodToggle: React.FC<PricingPeriodToggleProps> = ({
  pricingPeriod,
  setPricingPeriod,
}) => {
  return (
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
  );
};

export default PricingPeriodToggle;
