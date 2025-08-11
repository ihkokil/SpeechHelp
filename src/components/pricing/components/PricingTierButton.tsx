
import React from 'react';
import { Button } from '@/components/ui/button';
import { SubscriptionPlan } from '@/lib/plan_rules';

interface PricingTierButtonProps {
  planType: SubscriptionPlan;
  isCurrentPlan: boolean;
  isPlanDisabled: boolean;
  cannotUseFreeTrialAgain: boolean;
  onClick?: () => void;
}

const PricingTierButton: React.FC<PricingTierButtonProps> = ({
  planType,
  isCurrentPlan,
  isPlanDisabled,
  cannotUseFreeTrialAgain,
  onClick
}) => {
  const getButtonText = () => {
    if (isCurrentPlan) {
      return 'Current Plan';
    }
    if (cannotUseFreeTrialAgain) {
      return 'Already Used';
    }
    if (planType === SubscriptionPlan.FREE_TRIAL) {
      return 'Start Free Trial';
    }
    return 'Choose Plan';
  };

  return (
    <Button
      className={`w-full mt-auto ${
        isCurrentPlan 
          ? 'bg-purple-600 hover:bg-purple-700 cursor-default opacity-75' 
          : isPlanDisabled
          ? 'bg-gray-400 text-gray-600 cursor-not-allowed opacity-60'
          : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700'
      }`}
      onClick={isCurrentPlan || isPlanDisabled ? undefined : onClick}
      disabled={isCurrentPlan || isPlanDisabled}
    >
      {getButtonText()}
    </Button>
  );
};

export default PricingTierButton;
