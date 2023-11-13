
import React from 'react';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';

interface SpeechLabLayoutProps {
  children: React.ReactNode;
}

const SpeechLabLayout: React.FC<SpeechLabLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex">
      {/* Dashboard Sidebar - Fixed position */}
      <div className="fixed top-0 left-0 h-screen">
        <DashboardSidebar />
      </div>
      
      {/* Main Content - With left padding to account for fixed sidebar */}
      <div className="flex-1 ml-64 bg-gray-50 overflow-auto">
        {children}
      </div>
    </div>
  );
};

export default SpeechLabLayout;
