
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface AuthContainerProps {
  children: React.ReactNode;
}

const AuthContainer = ({ children }: AuthContainerProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-600 to-purple-600">
      <div className={`bg-white rounded-lg shadow-xl ${isMobile ? 'w-full max-w-sm mx-4' : 'max-w-md mx-8'} p-8`}>
        {children}
      </div>
    </div>
  );
};

export default AuthContainer;
