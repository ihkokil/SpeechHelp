
import React from 'react';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { useIsMobile } from '@/hooks/use-mobile';

interface SpeechLabLayoutProps {
  children: React.ReactNode;
}

const SpeechLabLayout: React.FC<SpeechLabLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Dashboard Sidebar - hidden on mobile */}
      <div className={`${isMobile ? 'hidden' : 'block'} md:w-64 lg:w-72 flex-shrink-0`}>
        <DashboardSidebar />
      </div>
      
      {/* Main Content - full width on mobile */}
      <div className="flex-1 bg-gray-50 overflow-x-hidden">
        {children}
      </div>
    </div>
  );
};

export default SpeechLabLayout;
