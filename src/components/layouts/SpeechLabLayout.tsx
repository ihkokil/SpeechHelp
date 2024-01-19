
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';

interface SpeechLabLayoutProps {
  children: React.ReactNode;
}

const SpeechLabLayout: React.FC<SpeechLabLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Dashboard Sidebar - Conditional positioning based on screen size */}
      <div className={`${isMobile ? 'fixed inset-y-0 left-0 z-40' : 'fixed top-0 left-0 h-full z-40'}`}>
        <DashboardSidebar />
      </div>
      
      {/* Main Content - Responsive margin and padding */}
      <div className={`flex-1 ${isMobile ? 'w-full' : 'ml-64'} min-h-screen overflow-y-auto`}>
        <div className="p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export default SpeechLabLayout;
