
import React from 'react';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import MobileNav from '@/components/navigation/MobileNav';
import { useIsMobile } from '@/hooks/use-mobile';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SpeechLabLayoutProps {
  children: React.ReactNode;
}

const SpeechLabLayout: React.FC<SpeechLabLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Show Mobile Navigation on mobile devices */}
      {isMobile && <MobileNav />}
      
      <div className="flex flex-1 overflow-hidden">
        {/* Show Dashboard Sidebar on non-mobile devices */}
        {!isMobile && <DashboardSidebar />}
        
        {/* Main Content - with ScrollArea to prevent horizontal scrolling */}
        <ScrollArea className="flex-1 h-screen">
          <div className="bg-gray-50 p-4">
            {children}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default SpeechLabLayout;
