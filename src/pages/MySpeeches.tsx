
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import SpeechesManager from '@/components/dashboard/speeches/SpeechesManager';
import { toast } from 'sonner';

const MySpeeches = () => {
  const location = useLocation();
  const [initialFilter, setInitialFilter] = useState('all');
  const [speeches, setSpeeches] = useState([]);
  const isMobile = useIsMobile();

  // Parse URL parameters for filtering
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const filterParam = params.get('filter');
    setInitialFilter(filterParam === 'upcoming' ? 'upcoming' : 'all');
  }, [location]);

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
