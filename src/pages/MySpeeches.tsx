
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

  // Parse URL parameters for filtering
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const filterParam = params.get('filter');

    if (filterParam === 'upcoming') {
      setInitialFilter('upcoming');
    } else {
      setInitialFilter('all');
    }
  }, [location]);

  // Fetch speeches when component mounts
  useEffect(() => {
    if (user) {
      console.log('MySpeeches component mounted, fetching speeches for user:', user.id);
      // Always fetch fresh data when component mounts
      fetchSpeeches();
    }
  }, [user, fetchSpeeches]);

  // Debug log all speeches when they change
  useEffect(() => {
    console.log(`MySpeeches has ${speeches.length} total regular speeches:`, 
      speeches.map(s => ({
        id: s.id,
        title: s.title,
        type: s.speech_type,
        isUpcoming: s.isUpcoming || false
      }))
    );

    // Check for localStorage upcoming events
    try {
      const upcomingEventsJSON = localStorage.getItem('upcomingEvents');
      if (upcomingEventsJSON) {
        const parsedEvents = JSON.parse(upcomingEventsJSON);
        console.log(`Found ${parsedEvents.length} upcoming events in localStorage`);
      }
    } catch (error) {
      console.error('Error checking localStorage events:', error);
    }
  }, [speeches]);

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
    <div className="min-h-screen flex bg-gray-50">
      <DashboardSidebar />

      <div className={`flex-1 ${isMobile ? "pt-16" : "ml-64"}`}>
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
