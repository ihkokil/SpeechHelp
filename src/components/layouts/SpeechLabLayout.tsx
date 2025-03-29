
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
      <div className={`${isMobile ? 'hidden' : 'block'}`}>
        <DashboardSidebar />
      </div>
      
      {/* Main Content - full width on mobile */}
      <div className="flex-1 bg-gray-50 overflow-auto">
        {children}
      </div>
    </div>
  );
};

export default SpeechLabLayout;
