
import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Translate from '@/components/Translate';

interface WelcomeCardProps {
  userName: string;
  firstName?: string;
  lastName?: string;
}

const WelcomeCard = ({ userName, firstName, lastName }: WelcomeCardProps) => {
  const [greeting, setGreeting] = useState('');
  const { currentLanguage } = useLanguage();
  
  useEffect(() => {
    // Set greeting based on time of day
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('dashboard.goodMorning');
    } else if (hour < 18) {
      setGreeting('dashboard.goodAfternoon');
    } else {
      setGreeting('dashboard.goodEvening');
    }
  }, []);
  
  // Get day of week - use the correct language
  const dayOfWeek = new Date().toLocaleDateString(currentLanguage.code, { weekday: 'long' });

  // Display full name if available, otherwise use username
  const displayName = firstName && lastName 
    ? `${firstName} ${lastName}`
    : userName;

  return (
    <div className="bg-white rounded-lg shadow-sm p-8 flex justify-between">
      <div>
        <h1 className="text-3xl font-bold text-purple-600">
          <Translate text={greeting} />, <span className="text-pink-600">{displayName}!</span>
        </h1>
        <p className="text-gray-500 mt-2"><Translate text="dashboard.niceDay" /> {dayOfWeek}.</p>
      </div>
      
      <div className="hidden md:block">
        <img 
          src="/placeholder.svg" 
          alt="Desk Illustration" 
          className="h-32 w-auto"
        />
      </div>
    </div>
  );
};

export default WelcomeCard;
