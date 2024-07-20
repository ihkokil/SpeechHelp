
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface AuthContainerProps {
  children: React.ReactNode;
}

const AuthContainer = ({ children }: AuthContainerProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-600 to-purple-600 p-4">
      <div className={`bg-white rounded-lg shadow-xl ${isMobile ? 'p-6 w-full max-w-sm mx-auto' : 'p-8 w-full max-w-md'}`}>
        {children}
      </div>
    </div>
  );
};

export default AuthContainer;
