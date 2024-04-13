
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';

interface SpeechLabLayoutProps {
  children: React.ReactNode;
}

const SpeechLabLayout: React.FC<SpeechLabLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  
  // Calculate sidebar offset for main content
  const contentClasses = isMobile 
    ? "w-full pt-16" // Add top padding on mobile to account for the toggle button
    : "ml-64"; // Add margin on desktop to account for the fixed sidebar
  
  return (
    <div className="min-h-screen flex bg-gray-50">
      <DashboardSidebar />
      
      <div className={`flex-1 ${contentClasses} overflow-x-hidden`}>
        <div className="p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export default SpeechLabLayout;
