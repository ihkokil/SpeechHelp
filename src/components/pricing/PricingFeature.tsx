
import React from 'react';

interface PricingFeatureProps {
  text: string;
  description?: string;
  icon?: React.ReactNode;
}

const PricingFeature: React.FC<PricingFeatureProps> = ({ 
  text,
  description,
  icon
}) => {
  return (
    <li className="flex flex-col">
      <div className="flex items-start">
        {icon}
        <span className="text-gray-700 font-medium">{text}</span>
      </div>
      {description && (
        <p className="text-sm text-gray-500 ml-7 mt-1">{description}</p>
      )}
    </li>
  );
};

export default PricingFeature;
