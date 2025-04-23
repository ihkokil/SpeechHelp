
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import SpeechesManager from '@/components/dashboard/speeches/SpeechesManager';
import { useLocation, useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

const MySpeeches = () => {
  const { user, isLoading, speeches, fetchSpeeches } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [initialFilter, setInitialFilter] = useState('all');
  const isMobile = useIsMobile();

  useEffect(() => {
    // Check for filter parameter in URL
    const params = new URLSearchParams(location.search);
    const filterParam = params.get('filter');

    if (filterParam === 'upcoming') {
      setInitialFilter('upcoming');
    } else {
      setInitialFilter('all');
    }
  }, [location]);

  useEffect(() => {
    if (user) {
      console.log('MySpeeches component mounted, fetching speeches for user:', user.id);
      // Always fetch fresh data when component mounts
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

  // Calculate sidebar offset for main content
  const contentClasses = isMobile 
    ? "w-full pt-16" // Add top padding on mobile to account for the toggle button
    : "ml-64"; // Add margin on desktop to account for the fixed sidebar

  return (
    <div className="min-h-screen flex bg-gray-50">
      <DashboardSidebar />

      <div className={`flex-1 overflow-auto ${contentClasses}`}>
        <main className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {initialFilter === 'upcoming' ? 'Upcoming Speeches' : 'My Speeches'}
            </h1>
            <p className="text-gray-600">
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
