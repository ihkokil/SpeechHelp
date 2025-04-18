
import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-pink-600 border-t-transparent"></div>
    </div>
  );
};

export default LoadingSpinner;
