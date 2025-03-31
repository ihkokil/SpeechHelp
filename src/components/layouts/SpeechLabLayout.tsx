
import React from 'react';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';

interface SpeechLabLayoutProps {
  children: React.ReactNode;
}

const SpeechLabLayout: React.FC<SpeechLabLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Dashboard Sidebar - Fixed position with full visibility */}
      <div className="fixed top-0 left-0 h-full z-40 shadow-lg">
        <DashboardSidebar />
      </div>
      
      {/* Main Content - With left margin to account for fixed sidebar */}
      <div className="flex-1 ml-64 min-h-screen overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

export default SpeechLabLayout;
