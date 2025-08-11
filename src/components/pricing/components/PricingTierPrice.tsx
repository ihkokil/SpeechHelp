
import React from 'react';
import { SubscriptionPlan } from '@/lib/plan_rules';

type PricingPeriod = 'monthly' | 'yearly';

interface PricingTierPriceProps {
  price: {
    monthly: { price: string; productId: string };
    yearly: { price: string; productId: string };
  };
  pricingPeriod: PricingPeriod;
  planType: SubscriptionPlan;
  isCurrentPlan: boolean;
  isPlanDisabled: boolean;
}

const PricingTierPrice: React.FC<PricingTierPriceProps> = ({
  price,
  pricingPeriod,
  planType,
  isCurrentPlan,
  isPlanDisabled
}) => {
  return (
    <div className="flex items-end justify-center mb-6">
      <span className={`text-4xl font-bold ${
        isCurrentPlan ? 'text-purple-700' : 
        isPlanDisabled ? 'text-gray-500' : 'text-purple-600'
      }`}>
        {pricingPeriod === 'monthly' ? price.monthly.price : price.yearly.price}
      </span>
      {pricingPeriod === 'monthly' && planType !== SubscriptionPlan.FREE_TRIAL && (
        <span className={`ml-2 ${isPlanDisabled ? 'text-gray-400' : 'text-gray-500'}`}>
          /month
        </span>
      )}
      {pricingPeriod === 'yearly' && planType !== SubscriptionPlan.FREE_TRIAL && (
        <span className={`ml-2 ${isPlanDisabled ? 'text-gray-400' : 'text-gray-500'}`}>
          /year
        </span>
      )}
    </div>
  );
};

export default PricingTierPrice;
