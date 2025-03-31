
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import SpeechesManager from '@/components/dashboard/speeches/SpeechesManager';
import { useLocation, useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileDashboardNav from '@/components/dashboard/MobileDashboardNav';

const MySpeeches = () => {
  const { user, isLoading, speeches, fetchSpeeches } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [initialFilter, setInitialFilter] = useState('all');
  const isMobile = useIsMobile();
  
  // Check for filter query param
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const filterParam = params.get('filter');
    
    if (filterParam === 'upcoming') {
      setInitialFilter('upcoming');
      // Clear the localStorage flag
      localStorage.removeItem('viewingUpcomingEvents');
    }
  }, [location]);
  
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
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Mobile Navigation - Only visible on mobile */}
      {isMobile && <MobileDashboardNav />}
      
      {/* Sidebar - Hidden on mobile */}
      <div className="hidden md:block">
        <DashboardSidebar />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 bg-gray-50 overflow-auto">
        <main className="p-4 md:p-6">
          <div className="mb-4 md:mb-6">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">
              {initialFilter === 'upcoming' ? 'Upcoming Speeches' : 'My Speeches'}
            </h1>
            <p className="text-sm md:text-base text-gray-600">
              {initialFilter === 'upcoming' 
                ? 'View and manage your scheduled upcoming speeches' 
                : 'Manage, edit and organize your speeches'}
            </p>
          </div>
          
          <SpeechesManager speeches={speeches} initialFilter={initialFilter} />
        </main>
      </div>
    </div>
  );
};

export default MySpeeches;
