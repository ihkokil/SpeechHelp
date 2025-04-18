
import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-3">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-pink-600 border-t-transparent"></div>
      <p className="text-lg font-medium text-pink-600">Loading admin panel...</p>
    </div>
  );
};

export default LoadingSpinner;
