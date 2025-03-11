
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import WelcomeCard from '@/components/dashboard/WelcomeCard';
import SpeechSummaryCard from '@/components/dashboard/SpeechSummaryCard';
import LanguageSelector from '@/components/dashboard/LanguageSelector';
import { CalendarIcon, FileTextIcon, ShieldIcon } from 'lucide-react';
import { format } from 'date-fns';

const Dashboard = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  
  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth');
    }
  }, [user, isLoading, navigate]);
  
  // Set user name from email (or fetch from profile in future)
  useEffect(() => {
    if (user?.email) {
      // Extract first part of email as username
      const nameFromEmail = user.email.split('@')[0];
      // Capitalize first letter and clean up
      const formattedName = nameFromEmail
        .split(/[._-]/)
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
      setUserName(formattedName);
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-600 to-purple-600">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
          <p className="mt-4 text-white text-lg font-medium">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <DashboardSidebar />
      
      {/* Main Content */}
      <div className="flex-1 bg-gray-50">
        {/* Header with date and language selector */}
        <header className="flex justify-between items-center p-6">
          <div className="flex items-center">
            <div className="bg-purple-600 text-white px-4 py-2 rounded-md flex items-center">
              <CalendarIcon className="mr-2 h-5 w-5" />
              <span>{format(new Date(), 'MMM dd, yyyy')}</span>
            </div>
          </div>
          <LanguageSelector />
        </header>

        {/* Main dashboard content */}
        <main className="px-8 pb-8">
          {/* Welcome card */}
          <WelcomeCard userName={userName} />
          
          {/* Speech Summary Section */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Speech Summary</h2>
            
            <div className="grid grid-cols-1 gap-4">
              {/* Total Speeches Card */}
              <SpeechSummaryCard 
                icon={<FileTextIcon className="h-6 w-6 text-gray-600" />}
                count={8}
                label="Total Speeches"
                period="This month"
                bgColor="bg-gray-100"
              />
              
              {/* Speeches in Progress Card */}
              <SpeechSummaryCard 
                icon={<ShieldIcon className="h-6 w-6 text-gray-600" />}
                count={2}
                label="Speeches in Progress"
                period="This month"
                bgColor="bg-red-50"
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
