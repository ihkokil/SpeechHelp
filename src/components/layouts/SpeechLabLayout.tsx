
import React from 'react';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { SidebarTrigger, SidebarProvider } from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';

interface SpeechLabLayoutProps {
  children: React.ReactNode;
}

const SpeechLabLayout: React.FC<SpeechLabLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  
  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="flex min-h-screen">
        <DashboardSidebar />
        
        <main className="flex-1 bg-gray-50 overflow-auto">
          {isMobile && (
            <div className="p-4">
              <SidebarTrigger />
            </div>
          )}
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default SpeechLabLayout;
