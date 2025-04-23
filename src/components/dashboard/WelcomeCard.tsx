
import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/translations';

interface WelcomeCardProps {
  userName: string;
  firstName?: string;
  lastName?: string;
}

const WelcomeCard = ({ userName, firstName, lastName }: WelcomeCardProps) => {
  const [timeOfDay, setTimeOfDay] = useState('');
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation();
  
  useEffect(() => {
    // Set time of day for the secondary message only
    const hour = new Date().getHours();
    if (hour < 12) {
      setTimeOfDay('morning');
    } else if (hour < 18) {
      setTimeOfDay('afternoon');
    } else {
      setTimeOfDay('evening');
    }
  }, []);
  
  // Get day of week - use the correct language
  const dayOfWeek = new Date().toLocaleDateString(currentLanguage.code, { weekday: 'long' });

  // Display full name if available, otherwise use username
  const displayName = firstName && lastName 
    ? `${firstName} ${lastName}`
    : userName;

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">
          <span className="text-purple-600">Hello, </span>
          <span className="text-pink-600">{displayName}!</span>
        </h1>
        <p className="text-gray-500 mt-2 text-sm sm:text-base">It's a beautiful {dayOfWeek} {timeOfDay}, so let's get creative and help you craft a memorable speech!</p>
      </div>
    </div>
  );
};

export default WelcomeCard;
