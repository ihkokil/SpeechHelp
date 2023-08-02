
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import SpeechesManager from '@/components/dashboard/speeches/SpeechesManager';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileNav from '@/components/navigation/MobileNav';

const MySpeeches = () => {
  const { user, isLoading, speeches, fetchSpeeches } = useAuth();
  const isMobile = useIsMobile();
  
  // Fetch speeches when component mounts
  useEffect(() => {
    if (user) {
      console.log("Fetching speeches for MySpeeches page");
      fetchSpeeches();
    }
  }, [user, fetchSpeeches]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-600 to-purple-600">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
          <p className="mt-4 text-white text-lg font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {isMobile ? (
        <MobileNav />
      ) : (
        <div className="flex flex-1 min-h-0">
          <DashboardSidebar />
          
          <div className="flex-1 bg-gray-50 overflow-auto">
            <main className="p-6">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">My Speeches</h1>
                <p className="text-gray-600">Manage, edit and organize your speeches</p>
              </div>
              
              <SpeechesManager speeches={speeches} />
            </main>
          </div>
        </div>
      )}
      
      {isMobile && (
        <div className="flex-1 bg-gray-50 overflow-auto">
          <main className="p-4">
            <div className="mb-4">
              <h1 className="text-xl font-bold text-gray-900">My Speeches</h1>
              <p className="text-sm text-gray-600">Manage, edit and organize your speeches</p>
            </div>
            
            <SpeechesManager speeches={speeches} />
          </main>
        </div>
      )}
    </div>
  );
};

export default MySpeeches;
