
import React, { useState, useEffect } from 'react';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardSkeleton from '@/components/dashboard/DashboardSkeleton';
import { useAuth } from '@/contexts/AuthContext';

interface SpeechLabLayoutProps {
  children: React.ReactNode;
}

const SpeechLabLayout: React.FC<SpeechLabLayoutProps> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const [isContentReady, setIsContentReady] = useState(false);
  
  // Get user's name from metadata or email
  const metadata = user?.user_metadata || {};
  const firstName = metadata.first_name;
  const lastName = metadata.last_name;
  
  // Display name preference: first name > email username
  const displayName = firstName || (user?.email ? user.email.split('@')[0] : "User");

  // Add a small delay to ensure smooth transition when data is loaded
  useEffect(() => {
    if (!isLoading && user) {
      const timer = setTimeout(() => {
        setIsContentReady(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isLoading, user]);
  
  if (isLoading || !isContentReady) {
    return <DashboardSkeleton />;
  }
  
  return (
    <div className="min-h-screen flex">
      {/* Dashboard Sidebar */}
      <DashboardSidebar />
      
      {/* Main Content */}
      <div className="flex-1 bg-gray-50 overflow-auto">
        {/* User info header */}
        {user && (
          <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
            <h1 className="text-xl font-semibold">Speech Lab</h1>
            <div className="flex items-center">
              <span className="mr-3 text-sm font-medium">{displayName}</span>
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-medium">
                {displayName.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        )}
        
        {children}
      </div>
    </div>
  );
};

export default SpeechLabLayout;
