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
import { SubscriptionDebug } from '@/components/debug/SubscriptionDebug';
import { SubscriptionSyncAlert } from '@/components/subscription/SubscriptionSyncAlert';
import { useSubscriptionPolling } from '@/hooks/useSubscriptionPolling';
import { CalendarIcon, FileTextIcon, ClockIcon, TrendingUpIcon } from 'lucide-react';
import { format } from 'date-fns';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/translations';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase } from '@/integrations/supabase/client';
const Dashboard = () => {
  const {
    user,
    isLoading,
    speeches,
    fetchSpeeches
  } = useAuth();
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [allSpeeches, setAllSpeeches] = useState<any[]>([]);
  const {
    currentLanguage
  } = useLanguage();
  const {
    t
  } = useTranslation();
  const isMobile = useIsMobile();

  // Enable subscription polling to automatically detect admin changes
  useSubscriptionPolling({
    intervalMs: 2 * 60 * 1000,
    // Check every 2 minutes
    enabled: true,
    aggressiveOnSpeechPages: true
  });

  // Debug logging
  useEffect(() => {
    console.log('Dashboard - User authenticated:', !!user);
    console.log('Dashboard - Speeches count:', speeches?.length || 0);
  }, [user, speeches]);

  // Fetch all speeches including deleted ones
  const fetchAllSpeeches = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('speeches')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching all speeches:', error);
        return;
      }

      console.log('Fetched all speeches (including deleted):', data?.length || 0);
      setAllSpeeches(data || []);
    } catch (error) {
      console.error('Error in fetchAllSpeeches:', error);
    }
  };

  // Fetch speeches when component mounts
  useEffect(() => {
    if (user) {
      console.log('Dashboard - Fetching speeches for user:', user.id);
      fetchSpeeches().catch(error => {
        console.error('Error fetching speeches:', error);
        toast.error(t('errors.fetchSpeeches', currentLanguage.code));
      });
      fetchAllSpeeches();
    }
  }, [user, fetchSpeeches, t, currentLanguage.code]);
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
        const formattedName = nameFromEmail.split(/[._-]/).map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
        setUserName(formattedName);
      } else {
        setUserName(`${firstNameFromMeta} ${lastNameFromMeta}`);
      }
    }
  }, [user]);
  const dashboardMetrics = useMemo(() => {
    // Total speeches including deleted ones
    const totalSpeeches = allSpeeches?.length || 0;
    
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    // Speeches in last 30 days including deleted ones
    const last30DaysSpeeches = allSpeeches?.filter(speech => {
      if (!speech?.created_at) return false;
      const speechDate = new Date(speech.created_at);
      return speechDate >= thirtyDaysAgo;
    }) || [];
    
    // Speeches in last 7 days including deleted ones
    const last7DaysSpeeches = allSpeeches?.filter(speech => {
      if (!speech?.created_at) return false;
      const speechDate = new Date(speech.created_at);
      return speechDate >= sevenDaysAgo;
    }) || [];

    const speechTypeDistribution = (speeches || []).reduce((acc, speech) => {
      if (speech?.speech_type) {
        acc[speech.speech_type] = (acc[speech.speech_type] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
    
    return {
      totalSpeeches,
      last30DaysCount: last30DaysSpeeches.length,
      last7DaysCount: last7DaysSpeeches.length,
      speechTypeDistribution
    };
  }, [allSpeeches, speeches]);
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-600 to-purple-600">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
          <p className="mt-4 text-white text-lg font-medium">{t('loading', currentLanguage.code)}...</p>
        </div>
      </div>;
  }
  return <div className="min-h-screen flex bg-gray-50">
      <DashboardSidebar />
      
      <div className={`flex-1 overflow-x-hidden ${isMobile ? "pt-16" : "ml-64"}`}>
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 sm:p-6 sticky top-0 bg-gray-50 z-10 gap-2">
          <div className="flex items-center">
            <div className="bg-purple-600 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-md flex items-center text-sm sm:text-base">
              <CalendarIcon className="mr-2 h-4 w-4" />
              <span>{format(new Date(), 'MMM dd, yyyy')}</span>
            </div>
          </div>
          <LanguageSelector />
        </header>

        <main className="px-4 sm:px-6 pb-12 max-w-full">
          <WelcomeCard userName={userName} firstName={firstName} lastName={lastName} />
          
          {/* Subscription Sync Alert - Shows when there are sync issues */}
          <div className="mt-4">
            <SubscriptionSyncAlert />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8">
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-3 sm:mb-4">{t('dashboard.summary', currentLanguage.code)}</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <SpeechSummaryCard 
                    icon={<FileTextIcon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />} 
                    count={dashboardMetrics.totalSpeeches} 
                    label="Total Speeches" 
                    period="All Time" 
                    bgColor="bg-gray-100" 
                    showExpand={false}
                  />
                  
                  <SpeechSummaryCard 
                    icon={<ClockIcon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />} 
                    count={dashboardMetrics.last30DaysCount} 
                    label="Last 30 Days" 
                    period="Including Deleted" 
                    bgColor="bg-blue-50" 
                    showExpand={false}
                  />
                  
                  <SpeechSummaryCard 
                    icon={<TrendingUpIcon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />} 
                    count={dashboardMetrics.last7DaysCount} 
                    label="Last 7 Days" 
                    period="Including Deleted" 
                    bgColor="bg-green-50" 
                    showExpand={false}
                  />
                </div>
              </div>
              
              <div className="overflow-hidden">
                <PreviousSpeeches />
              </div>
              
              <div className="overflow-hidden">
                <PerformanceMetrics speechData={dashboardMetrics.speechTypeDistribution} />
              </div>
            </div>
            
            <div className="space-y-4 sm:space-y-6">
              <div className="overflow-hidden">
                <UpcomingSpeeches speeches={speeches || []} />
              </div>
              
              <div className="overflow-hidden">
                <RecentActivities speeches={speeches || []} />
              </div>
            </div>
          </div>

          {/* Subscription Debug Panel - Only show for development/troubleshooting */}
          {process.env.NODE_ENV === 'development'}
        </main>
      </div>
    </div>;
};
export default Dashboard;