
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

  console.log("MySpeeches component - speeches:", speeches);

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
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Sidebar for desktop */}
      {!isMobile && <DashboardSidebar />}
      
      {/* Main Content */}
      <div className="flex-1 bg-gray-50 overflow-auto">
        {/* Mobile navigation header */}
        {isMobile && (
          <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-2">
            <MobileNav />
          </div>
        )}
        
        <main className="p-4 md:p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">My Speeches</h1>
            <p className="text-gray-600">Manage, edit and organize your speeches</p>
          </div>
          
          <SpeechesManager speeches={speeches} />
        </main>
      </div>
    </div>
  );
};

export default MySpeeches;
