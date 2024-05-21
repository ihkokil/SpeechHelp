
import React from 'react';

interface AuthContainerProps {
  children: React.ReactNode;
}

const AuthContainer = ({ children }: AuthContainerProps) => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-r from-pink-600 to-purple-600 px-4 py-8">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md mx-auto">
        {children}
      </div>
    </div>
  );
};

export default AuthContainer;
