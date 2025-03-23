
import React, { useEffect, useState } from 'react';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';

interface SpeechLabLayoutProps {
  children: React.ReactNode;
}

const SpeechLabLayout: React.FC<SpeechLabLayoutProps> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const [isLocalLoading, setIsLocalLoading] = useState(true);
  
  // Get user's name from metadata or email
  const metadata = user?.user_metadata || {};
  const firstName = metadata.first_name;
  const lastName = metadata.last_name;
  
  // Display name preference: first name > email username
  const displayName = firstName || (user?.email ? user.email.split('@')[0] : "User");

  // Introduce a small delay to prevent flash of loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLocalLoading(false);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Show skeleton during initial load
  if (isLoading || isLocalLoading) {
    return (
      <div className="min-h-screen flex">
        <DashboardSidebar />
        <div className="flex-1 bg-gray-50 overflow-auto">
          <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
            <Skeleton className="h-8 w-32" />
            <div className="flex items-center">
              <Skeleton className="h-4 w-24 mr-3" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </div>
          <div className="p-6">
            <Skeleton className="h-12 w-full mb-6" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
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
