
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SubscriptionPlan } from '@/lib/plan_rules';

interface PricingTierCardProps {
  isCurrentPlan: boolean;
  isPlanDisabled: boolean;
  children: React.ReactNode;
}

const PricingTierCard: React.FC<PricingTierCardProps> = ({
  isCurrentPlan,
  isPlanDisabled,
  children
}) => {
  return (
    <Card className={`border rounded-xl h-full overflow-hidden transition-all duration-300 ${
      isCurrentPlan 
        ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 shadow-xl ring-2 ring-purple-200' 
        : isPlanDisabled
        ? 'border-gray-200 bg-gray-50 opacity-60'
        : 'border-gray-200 hover:border-purple-300 hover:shadow-lg'
    }`}>
      <div className="p-6 md:p-8 h-full flex flex-col relative">
        {isCurrentPlan && (
          <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center py-2 text-sm font-medium">
            Your Current Plan
          </div>
        )}
        {children}
      </div>
    </Card>
  );
};

export default PricingTierCard;
