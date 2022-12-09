
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import WelcomeCard from '@/components/dashboard/WelcomeCard';
import SpeechSummaryCard from '@/components/dashboard/SpeechSummaryCard';
import UpcomingSpeeches from '@/components/dashboard/UpcomingSpeeches';
import RecentActivities from '@/components/dashboard/RecentActivities';
import PerformanceMetrics from '@/components/dashboard/PerformanceMetrics';
import LanguageSelector from '@/components/dashboard/LanguageSelector';
import PreviousSpeeches from '@/components/dashboard/PreviousSpeeches';
import { CalendarIcon, FileTextIcon, ShieldIcon, TrendingUpIcon } from 'lucide-react';
import { format } from 'date-fns';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/translations';

const Dashboard = () => {
  const { user, isLoading, speeches, fetchSpeeches } = useAuth();
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation();
  const [isProcessingUser, setIsProcessingUser] = useState(true);
  
  // Fetch speeches when component mounts and auth state changes
  useEffect(() => {
    if (user && !isLoading) {
      fetchSpeeches();
    }
  }, [user, isLoading, fetchSpeeches]);
  
  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth');
    }
  }, [user, isLoading, navigate]);
  
  // Set user information from metadata
  useEffect(() => {
    if (user) {
      // Get first and last name from user metadata if available
      const metadata = user.user_metadata;
      const firstNameFromMeta = metadata?.first_name || '';
      const lastNameFromMeta = metadata?.last_name || '';
      
      setFirstName(firstNameFromMeta);
      setLastName(lastNameFromMeta);
      
      // Fallback to email if no names are available
      if (!firstNameFromMeta && !lastNameFromMeta && user.email) {
        // Extract first part of email as username
        const nameFromEmail = user.email.split('@')[0];
        // Capitalize first letter and clean up
        const formattedName = nameFromEmail
          .split(/[._-]/)
          .map(part => part.charAt(0).toUpperCase() + part.slice(1))
          .join(' ');
        setUserName(formattedName);
      } else {
        setUserName(`${firstNameFromMeta} ${lastNameFromMeta}`);
      }
      
      // Mark user processing as complete
      setIsProcessingUser(false);
    }
  }, [user]);

  // Combined loading state to prevent flickering
  const showLoading = isLoading || isProcessingUser;

  if (showLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-600 to-purple-600">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
          <p className="mt-4 text-white text-lg font-medium">{t('loading', currentLanguage.code)}...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <DashboardSidebar />
      
      {/* Main Content */}
      <div className="flex-1 bg-gray-50 overflow-auto">
        {/* Header with date and language selector */}
        <header className="flex justify-between items-center p-6 sticky top-0 bg-gray-50 z-10">
          <div className="flex items-center">
            <div className="bg-purple-600 text-white px-4 py-2 rounded-md flex items-center">
              <CalendarIcon className="mr-2 h-5 w-5" />
              <span>{format(new Date(), 'MMM dd, yyyy')}</span>
            </div>
          </div>
          <LanguageSelector />
        </header>

        {/* Main dashboard content */}
        <main className="px-6 pb-12">
          {/* Welcome card */}
          <WelcomeCard 
            userName={userName} 
            firstName={firstName} 
            lastName={lastName}
          />
          
          {/* Dashboard Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Speech Summary Section */}
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">{t('dashboard.summary', currentLanguage.code)}</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Total Speeches Card */}
                  <SpeechSummaryCard 
                    icon={<FileTextIcon className="h-6 w-6 text-gray-600" />}
                    count={speeches.length}
                    label="dashboard.totalSpeeches"
                    period="dashboard.allTime"
                    bgColor="bg-gray-100"
                  />
                  
                  {/* Speeches in Progress Card */}
                  <SpeechSummaryCard 
                    icon={<ShieldIcon className="h-6 w-6 text-gray-600" />}
                    count={2}
                    label="dashboard.inProgress"
                    period="dashboard.thisMonth"
                    bgColor="bg-red-50"
                  />
                  
                  {/* Improvement Score Card */}
                  <SpeechSummaryCard 
                    icon={<TrendingUpIcon className="h-6 w-6 text-gray-600" />}
                    count={15}
                    label="dashboard.improvement"
                    period="dashboard.last30Days"
                    bgColor="bg-green-50"
                  />
                </div>
              </div>
              
              {/* Previous Speeches */}
              <PreviousSpeeches />
              
              {/* Performance Metrics */}
              <PerformanceMetrics />
            </div>
            
            {/* Right Column */}
            <div className="space-y-6">
              {/* Upcoming Speeches */}
              <UpcomingSpeeches />
              
              {/* Recent Activities */}
              <RecentActivities />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
