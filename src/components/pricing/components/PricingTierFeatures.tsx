
import React from 'react';
import PricingFeature from '../PricingFeature';

interface PricingTierFeaturesProps {
  features: {
    text: string;
    description?: string;
    icon?: React.ReactNode;
  }[];
  isPlanDisabled: boolean;
}

const PricingTierFeatures: React.FC<PricingTierFeaturesProps> = ({
  features,
  isPlanDisabled
}) => {
  return (
    <ul className="space-y-6 mb-8">
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
  );
};

export default PricingTierFeatures;
