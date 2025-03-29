
import React from 'react';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';

interface SpeechLabLayoutProps {
  children: React.ReactNode;
}

const SpeechLabLayout: React.FC<SpeechLabLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <div className="h-full">
        <DashboardSidebar />
      </div>
      
      <div className="flex-1 overflow-auto bg-gray-50">
        {isMobile && (
          <div className="p-4">
            <SidebarTrigger />
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

export default SpeechLabLayout;
