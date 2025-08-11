
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface PricingTierHeaderProps {
  name: string;
  isCurrentPlan: boolean;
  isPlanDisabled: boolean;
}

const PricingTierHeader: React.FC<PricingTierHeaderProps> = ({
  name,
  isCurrentPlan,
  isPlanDisabled
}) => {
  return (
    <div className={`text-center mb-2 ${isCurrentPlan ? 'mt-8' : ''}`}>
      <h3 className={`text-2xl font-bold mb-2 ${isPlanDisabled ? 'text-gray-500' : 'text-gray-900'}`}>
        {name}
      </h3>
      {isCurrentPlan && (
        <div className="flex justify-center">
          <Badge className="bg-purple-600 text-white">
            Active
          </Badge>
        </div>
      )}
    </div>
  );
};

export default PricingTierHeader;
