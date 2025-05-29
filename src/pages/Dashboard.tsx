
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import WelcomeCard from '@/components/dashboard/WelcomeCard';
import QuickActions from '@/components/dashboard/QuickActions';
import SpeechStatsCard from '@/components/dashboard/speeches/SpeechStatsCard';
import UpcomingSpeeches from '@/components/dashboard/UpcomingSpeeches';
import PreviousSpeeches from '@/components/dashboard/PreviousSpeeches';
import { toast } from 'sonner';

const Dashboard = () => {
  const { user, isLoading, speeches, fetchSpeeches } = useAuth();
  const isMobile = useIsMobile();

  // Fetch speeches when component mounts and user is available
  useEffect(() => {
    if (user && !isLoading) {
      fetchSpeeches().catch(error => {
        console.error('Error fetching speeches:', error);
        toast.error('Failed to load speeches. Please try again.');
      });
    }
  }, [user, isLoading, fetchSpeeches]);

  // Show loading state while auth is being determined
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-600 to-purple-600">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
          <p className="mt-4 text-white text-lg font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <DashboardSidebar />

      <div className={`flex-1 overflow-x-hidden ${isMobile ? "pt-16" : "ml-64"}`}>
        <main className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-7xl mx-auto">
            {/* Welcome Section */}
            <WelcomeCard 
              userName={user?.email || 'User'}
              firstName={user?.user_metadata?.first_name}
              lastName={user?.user_metadata?.last_name}
            />
            
            {/* Quick Actions */}
            <div className="mb-6">
              <QuickActions />
            </div>
            
            {/* Speech Statistics */}
            {speeches && speeches.length > 0 && (
              <SpeechStatsCard speeches={speeches} />
            )}
            
            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Upcoming Speeches */}
              <div className="space-y-6">
                <UpcomingSpeeches speeches={speeches} />
              </div>
              
              {/* Previous Speeches */}
              <div className="space-y-6">
                <PreviousSpeeches />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
