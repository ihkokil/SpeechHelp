
import React from 'react';
import PricingFeature from '../PricingFeature';
import { Check } from 'lucide-react';
import { SubscriptionPlan } from '@/lib/plan_rules';

interface PricingTierFeaturesProps {
  features: {
    text: string;
    description?: string;
    icon?: React.ReactNode;
  }[];
  isPlanDisabled: boolean;
  planType: SubscriptionPlan;
}

const PricingTierFeatures: React.FC<PricingTierFeaturesProps> = ({
  features,
  isPlanDisabled,
  planType
}) => {
  return (
    <div className="mb-8">
      <ul className="space-y-6 mb-6">
        {(features || []).map((feature, index) => (
          <PricingFeature
            key={index}
            text={feature.text}
            description={feature.description}
            icon={feature.icon}
            disabled={isPlanDisabled}
          />
        ))}
      </ul>
      
      {/* Add credit reset info for paid plans */}
      {planType !== SubscriptionPlan.FREE_TRIAL && (
        <div className="pt-4 border-t border-border/50">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-5 h-5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
              <Check className="w-3 h-3 text-white" />
            </div>
            <div className="flex-1">
              <span className="text-foreground text-sm font-medium">
                Fresh Speech Allowance
              </span>
              <p className="text-muted-foreground text-xs mt-1">
                Your speech counter resets with each purchase, giving you a fresh start
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PricingTierFeatures;
