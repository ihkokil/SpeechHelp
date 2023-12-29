
import React from 'react';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import MobileDashboardNav from '@/components/dashboard/MobileDashboardNav';
import { useIsMobile } from '@/hooks/use-mobile';

interface SpeechLabLayoutProps {
  children: React.ReactNode;
}

const SpeechLabLayout: React.FC<SpeechLabLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Mobile Navigation - Only visible on mobile */}
      {isMobile && <MobileDashboardNav />}
      
      {/* Dashboard Sidebar - Hidden on mobile, fixed on desktop */}
      <div className={`${isMobile ? 'hidden' : 'fixed top-0 left-0 h-full z-40 shadow-lg'}`}>
        <DashboardSidebar />
      </div>
      
      {/* Main Content - With margin for desktop, full width for mobile */}
      <div className={`flex-1 min-h-screen overflow-y-auto ${isMobile ? 'w-full pb-6' : 'ml-64'}`}>
        {children}
      </div>
    </div>
  );
};

export default SpeechLabLayout;
