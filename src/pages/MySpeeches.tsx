
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import SpeechesManager from '@/components/dashboard/speeches/SpeechesManager';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { SidebarTrigger } from '@/components/ui/sidebar';

const MySpeeches = () => {
  const { user, isLoading, speeches, fetchSpeeches } = useAuth();
  const isMobile = useIsMobile();
  
  // Fetch speeches when component mounts
  useEffect(() => {
    if (user) {
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
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="min-h-screen flex flex-col md:flex-row w-full">
        <DashboardSidebar />
        
        <main className="flex-1 bg-gray-50 overflow-auto w-full">
          <header className="flex justify-between items-center p-4 md:p-6 sticky top-0 bg-gray-50 z-10">
            {isMobile && (
              <div className="p-4">
                <SidebarTrigger />
              </div>
            )}
          </header>
          
          <div className="p-6 w-full">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">My Speeches</h1>
              <p className="text-gray-600">Manage, edit and organize your speeches</p>
            </div>
            
            <SpeechesManager speeches={speeches} />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default MySpeeches;
