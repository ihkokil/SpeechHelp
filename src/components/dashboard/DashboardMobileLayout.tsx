
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import WelcomeCard from './WelcomeCard';
import QuickActions from './QuickActions';
import SpeechStatsCard from './speeches/SpeechStatsCard';
import UpcomingSpeeches from './UpcomingSpeeches';
import PreviousSpeeches from './PreviousSpeeches';

interface DashboardMobileLayoutProps {
  speeches: any[];
}

const DashboardMobileLayout: React.FC<DashboardMobileLayoutProps> = ({ speeches }) => {
  const { user } = useAuth();

  return (
    <div className="space-y-4">
      {/* Welcome Section */}
      <WelcomeCard 
        userName={user?.email || 'User'}
        firstName={user?.user_metadata?.first_name}
        lastName={user?.user_metadata?.last_name}
      />
      
      {/* Quick Actions */}
      <QuickActions />
      
      {/* Speech Statistics */}
      {speeches && speeches.length > 0 && (
        <SpeechStatsCard speeches={speeches} />
      )}
      
      {/* Mobile Stack Layout */}
      <div className="space-y-4">
        {/* Upcoming Speeches */}
        <UpcomingSpeeches speeches={speeches} />
        
        {/* Previous Speeches */}
        <PreviousSpeeches />
      </div>
    </div>
  );
};

export default DashboardMobileLayout;
