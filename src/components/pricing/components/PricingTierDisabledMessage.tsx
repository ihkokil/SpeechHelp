
import React from 'react';

interface PricingTierDisabledMessageProps {
  isCurrentPlan: boolean;
  isPlanDisabled: boolean;
  disabledReason: string;
}

const PricingTierDisabledMessage: React.FC<PricingTierDisabledMessageProps> = ({
  isCurrentPlan,
  isPlanDisabled,
  disabledReason
}) => {
  if (!isPlanDisabled || isCurrentPlan) {
    return null;
  }

  return (
    <div className="mb-4 p-3 bg-gray-100 rounded-lg">
      <p className="text-sm text-gray-600 text-center">
        {disabledReason}
      </p>
    </div>
  );
};

export default PricingTierDisabledMessage;
