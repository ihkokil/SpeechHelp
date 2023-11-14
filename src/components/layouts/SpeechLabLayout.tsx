
import React from 'react';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';

interface SpeechLabLayoutProps {
  children: React.ReactNode;
}

const SpeechLabLayout: React.FC<SpeechLabLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex">
      {/* Dashboard Sidebar - Fixed position with full visibility */}
      <div className="fixed top-0 left-0 h-screen z-40 overflow-y-auto">
        <DashboardSidebar />
      </div>
      
      {/* Main Content - With left margin to account for fixed sidebar */}
      <div className="flex-1 ml-64 bg-gray-50 min-h-screen overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

export default SpeechLabLayout;
