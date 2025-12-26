
import React from 'react';
import { Button } from '@/components/ui/button';
import { SubscriptionPlan } from '@/lib/plan_rules';

interface PricingTierButtonProps {
  planType: SubscriptionPlan;
  isCurrentPlan: boolean;
  isPlanDisabled: boolean;
  cannotUseFreeTrialAgain: boolean;
  isRenewal?: boolean;
  isUpgrade?: boolean;
  isSwitch?: boolean;
  onClick?: () => void;
}

const PricingTierButton: React.FC<PricingTierButtonProps> = ({
  planType,
  isCurrentPlan,
  isPlanDisabled,
  cannotUseFreeTrialAgain,
  isRenewal = false,
  isUpgrade = false,
  isSwitch = false,
  onClick
}) => {
  const getButtonText = () => {
    if (isCurrentPlan && !isRenewal) {
      return 'Current Plan';
    }
    if (isRenewal) {
      return 'Renew Plan';
    }
    if (isUpgrade) {
      return 'Purchase';
    }
    if (isSwitch) {
      return 'Switch Plan';
    }
    if (cannotUseFreeTrialAgain) {
      return 'Already Used';
    }
    if (planType === SubscriptionPlan.FREE_TRIAL) {
      return 'Start Free Trial';
    }
    return 'Choose Plan';
  };

  const shouldBeDisabled = isPlanDisabled || (isCurrentPlan && !isRenewal);

  return (
    <Button
      className={`w-full mt-auto ${
        (isCurrentPlan && !isRenewal) 
          ? 'bg-purple-600 hover:bg-purple-700 cursor-default opacity-75' 
          : shouldBeDisabled
          ? 'bg-gray-400 text-gray-600 cursor-not-allowed opacity-60'
          : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white hover:text-white'
      }`}
      onClick={shouldBeDisabled ? undefined : onClick}
      disabled={shouldBeDisabled}
    >
      {getButtonText()}
    </Button>
  );
};

export default PricingTierButton;
