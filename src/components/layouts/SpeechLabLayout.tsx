
import React from 'react';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileNav from '@/components/navigation/MobileNav';

interface SpeechLabLayoutProps {
  children: React.ReactNode;
}

const SpeechLabLayout: React.FC<SpeechLabLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Sidebar for desktop */}
      {!isMobile && <DashboardSidebar />}
      
      {/* Main Content */}
      <div className="flex-1 bg-gray-50 overflow-auto">
        {/* Mobile navigation header */}
        {isMobile && (
          <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-2">
            <MobileNav />
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

export default SpeechLabLayout;
