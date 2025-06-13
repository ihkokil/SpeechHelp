
import React from 'react';
import { Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

interface AuthContainerProps {
  children: React.ReactNode;
}

const AuthContainer = ({ children }: AuthContainerProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-600 via-purple-600 to-indigo-700 px-4 py-8">
      {/* Logo section at the top */}
      <div className="mb-8 text-center">
        <Link 
          to="/" 
          className="inline-block transition-transform duration-200 hover:scale-105"
        >
          <img 
            src="https://yotrueuqjxmgcwlbbyps.supabase.co/storage/v1/object/public/images//SpeechHelp_Logo.svg"
            alt="SpeechHelp Logo" 
            className={`${isMobile ? "h-12" : "h-16"} w-auto drop-shadow-lg`}
          />
        </Link>
        <p className="mt-3 text-white/80 text-sm font-medium">
          AI-Powered Speech Generation Platform
        </p>
      </div>

      {/* Auth form container */}
      <div className={`bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 ${
        isMobile ? 'w-full max-w-sm' : 'w-full max-w-md'
      } p-8 transition-all duration-300 hover:shadow-3xl`}>
        {children}
      </div>

      {/* Footer text */}
      <div className="mt-8 text-center">
        <p className="text-white/60 text-xs">
          Secure authentication powered by Supabase
        </p>
      </div>
    </div>
  );
};

export default AuthContainer;
