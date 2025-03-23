
import React, { useState, useEffect } from 'react';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { useAuth } from '@/contexts/AuthContext';

interface SpeechLabLayoutProps {
  children: React.ReactNode;
}

const SpeechLabLayout: React.FC<SpeechLabLayoutProps> = ({ children }) => {
  const { isLoading, user } = useAuth();
  const [isStabilized, setIsStabilized] = useState(false);
  
  useEffect(() => {
    // Add a stabilization delay to prevent flashing
    if (!isLoading && user) {
      const timer = setTimeout(() => {
        setIsStabilized(true);
      }, 500); // Increased from 300ms to 500ms for more stability
      
      return () => clearTimeout(timer);
    }
  }, [isLoading, user]);

  if (isLoading || !isStabilized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-purple-300 border-t-purple-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Dashboard Sidebar */}
      <DashboardSidebar />
      
      {/* Main Content */}
      <div className="flex-1 bg-gray-50 overflow-auto">
        {children}
      </div>
    </div>
  );
};

export default SpeechLabLayout;
