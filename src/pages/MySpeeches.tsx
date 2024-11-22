
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import SpeechesManager from '@/components/dashboard/speeches/SpeechesManager';
import { useLocation, useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';

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
      console.log('URL parameter detected: Setting filter to upcoming');
      setInitialFilter('upcoming');
    } else {
      console.log('No URL parameter or different value: Setting filter to all');
      setInitialFilter('all');
    }
  }, [location]);

  // Debug logging
  useEffect(() => {
    console.log('MySpeeches - Initial filter set to:', initialFilter);
  }, [initialFilter]);

  // Fetch speeches when component mounts
  useEffect(() => {
    if (user) {
      console.log('MySpeeches component mounted, fetching speeches for user:', user.id);
      // Always fetch fresh data when component mounts
      fetchSpeeches().catch(error => {
        console.error('Error fetching speeches:', error);
        toast.error('Failed to load speeches. Please try again.');
      });
    }
  }, [user, fetchSpeeches]);

  // Enhanced debug log all speeches when they change
  useEffect(() => {
    console.log(`MySpeeches has ${speeches.length} total speeches from database`);
    
    // Log regular speeches from the backend
    const savedSpeeches = speeches.filter(s => !s.isUpcoming);
    
    console.log(`Regular speeches from database: ${savedSpeeches.length}`);

    // Check for localStorage upcoming events for the current user
    if (user?.id) {
      try {
        const storageKey = `upcomingEvents_${user.id}`;
        const upcomingEventsJSON = localStorage.getItem(storageKey);
        if (upcomingEventsJSON) {
          const parsedEvents = JSON.parse(upcomingEventsJSON);
          console.log(`Found ${parsedEvents.length} upcoming events in localStorage for user ${user.id}`);
        } else {
          console.log(`No upcoming events found in localStorage for user ${user.id}`);
        }
      } catch (error) {
        console.error('Error checking localStorage events:', error);
      }
    }
  }, [speeches, user]);

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

      <div className={`flex-1 overflow-x-hidden ${isMobile ? "pt-16" : "ml-64"}`}>
        <main className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {initialFilter === 'upcoming' ? 'Upcoming Speeches' : 'My Speeches'}
            </h1>
            <p className="text-gray-600 mt-1">
              {initialFilter === 'upcoming'
                ? 'View and manage your scheduled upcoming speeches'
                : 'Manage, edit and organize your speeches'}
            </p>
          </div>

          <div className="overflow-hidden">
            <SpeechesManager speeches={speeches} initialFilter={initialFilter} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MySpeeches;
