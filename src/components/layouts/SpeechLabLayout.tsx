
import React from 'react';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import MobileNav from '@/components/navigation/MobileNav';
import { useIsMobile } from '@/hooks/use-mobile';

interface SpeechLabLayoutProps {
  children: React.ReactNode;
}

const SpeechLabLayout: React.FC<SpeechLabLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Mobile Navigation - only shown on mobile */}
      {isMobile && <MobileNav />}
      
      {/* Main Content Area with Sidebar */}
      <div className="flex flex-1 min-h-0">
        {/* Desktop Sidebar - hidden on mobile */}
        {!isMobile && <DashboardSidebar />}
        
        {/* Main Content */}
        <div className="flex-1 bg-gray-50 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default SpeechLabLayout;
