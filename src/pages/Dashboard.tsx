
import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import WelcomeCard from '@/components/dashboard/WelcomeCard';
import SpeechSummaryCard from '@/components/dashboard/SpeechSummaryCard';
import UpcomingSpeeches from '@/components/dashboard/UpcomingSpeeches';
import RecentActivities from '@/components/dashboard/RecentActivities';
import PerformanceMetrics from '@/components/dashboard/PerformanceMetrics';
import LanguageSelector from '@/components/common/LanguageSelector';
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
  
  useEffect(() => {
    if (user) {
      fetchSpeeches();
    }
  }, [user, fetchSpeeches]);
  
  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth');
    }
  }, [user, isLoading, navigate]);
  
  useEffect(() => {
    if (user) {
      const metadata = user.user_metadata;
      const firstNameFromMeta = metadata?.first_name || '';
      const lastNameFromMeta = metadata?.last_name || '';
      
      setFirstName(firstNameFromMeta);
      setLastName(lastNameFromMeta);
      
      if (!firstNameFromMeta && !lastNameFromMeta && user.email) {
        const nameFromEmail = user.email.split('@')[0];
        const formattedName = nameFromEmail
          .split(/[._-]/)
          .map(part => part.charAt(0).toUpperCase() + part.slice(1))
          .join(' ');
        setUserName(formattedName);
      } else {
        setUserName(`${firstNameFromMeta} ${lastNameFromMeta}`);
      }
    }
  }, [user]);

  // Calculate relevant metrics from speeches
  const dashboardMetrics = useMemo(() => {
    // Total number of speeches
    const totalSpeeches = speeches.length;
    
    // Current month speeches (in progress)
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    const thisMonthSpeeches = speeches.filter(speech => {
      const speechDate = new Date(speech.created_at);
      return speechDate.getMonth() === currentMonth && 
             speechDate.getFullYear() === currentYear;
    });
    
    // Speeches in last 30 days (to measure improvement)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const last30DaysSpeeches = speeches.filter(speech => {
      const speechDate = new Date(speech.created_at);
      return speechDate >= thirtyDaysAgo;
    });
    
    return {
      totalSpeeches,
      inProgressCount: thisMonthSpeeches.length,
      recentImprovementCount: last30DaysSpeeches.length
    };
  }, [speeches]);

  if (isLoading) {
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
      <DashboardSidebar />
      
      <div className="flex-1 bg-gray-50 overflow-auto">
        <header className="flex justify-between items-center p-6 sticky top-0 bg-gray-50 z-10">
          <div className="flex items-center">
            <div className="bg-purple-600 text-white px-4 py-2 rounded-md flex items-center">
              <CalendarIcon className="mr-2 h-5 w-5" />
              <span>{format(new Date(), 'MMM dd, yyyy')}</span>
            </div>
          </div>
          <LanguageSelector />
        </header>

        <main className="px-6 pb-12">
          <WelcomeCard 
            userName={userName} 
            firstName={firstName} 
            lastName={lastName}
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">{t('dashboard.summary', currentLanguage.code)}</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <SpeechSummaryCard 
                    icon={<FileTextIcon className="h-6 w-6 text-gray-600" />}
                    count={dashboardMetrics.totalSpeeches}
                    label="dashboard.totalSpeeches"
                    period="dashboard.allTime"
                    bgColor="bg-gray-100"
                  />
                  
                  <SpeechSummaryCard 
                    icon={<ShieldIcon className="h-6 w-6 text-gray-600" />}
                    count={dashboardMetrics.inProgressCount}
                    label="dashboard.inProgress"
                    period="dashboard.thisMonth"
                    bgColor="bg-red-50"
                  />
                  
                  <SpeechSummaryCard 
                    icon={<TrendingUpIcon className="h-6 w-6 text-gray-600" />}
                    count={dashboardMetrics.recentImprovementCount}
                    label="dashboard.improvement"
                    period="dashboard.last30Days"
                    bgColor="bg-green-50"
                  />
                </div>
              </div>
              
              <PreviousSpeeches />
              
              <PerformanceMetrics />
            </div>
            
            <div className="space-y-6">
              <UpcomingSpeeches />
              
              <RecentActivities />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
