
import React from 'react';

const PricingHeader: React.FC = () => {
  return (
    <div className="text-center max-w-3xl mx-auto mb-8">
      <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600">
        Affordable Plans for Everyone
      </h1>
      <p className="text-lg text-gray-600">
        Find the perfect plan that suits your needs.
      </p>
    </div>
  );
};

export default PricingHeader;
