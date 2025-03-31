
import React from 'react';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { useIsMobile } from '@/hooks/use-mobile';

interface SpeechLabLayoutProps {
  children: React.ReactNode;
}

const SpeechLabLayout: React.FC<SpeechLabLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Dashboard Sidebar */}
      <div className={`${isMobile ? 'hidden' : 'fixed'} top-0 left-0 h-full z-40 shadow-lg`}>
        <DashboardSidebar />
      </div>
      
      {/* Mobile Sidebar */}
      {isMobile && (
        <div className="relative z-40">
          <DashboardSidebar />
        </div>
      )}
      
      {/* Main Content - With left margin to account for fixed sidebar */}
      <div className={`flex-1 min-h-screen overflow-y-auto ${!isMobile ? 'ml-64' : 'ml-0'}`}>
        {children}
      </div>
    </div>
  );
};

export default SpeechLabLayout;
