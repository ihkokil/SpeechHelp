
import { CircleCheckBig, MicIcon, FileTextIcon, Clock } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { es, fr } from 'date-fns/locale';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/translations';
import { Speech } from '@/types/speech';
import { useMemo } from 'react';

type ActivityType = 'practice' | 'feedback' | 'completion';

type Activity = {
  id: string;
  type: ActivityType;
  title: string;
  timestamp: Date;
  details?: string;
};

interface RecentActivitiesProps {
  speeches?: Speech[];
}

const RecentActivities = ({ speeches = [] }: RecentActivitiesProps) => {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation();

  // Generate activities from real speeches, if available
  const activities = useMemo(() => {
    if (speeches.length) {
      // Get the 3 most recent speeches
      const recentSpeeches = [...speeches]
        .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
        .slice(0, 3);
        
      return recentSpeeches.map(speech => ({
        id: speech.id,
        type: 'completion' as ActivityType,
        title: `Completed "${speech.title}"`,
        timestamp: new Date(speech.updated_at),
        details: `${speech.speech_type} speech`
      }));
    }
    
    // Fallback to mock data
    return [
      {
        id: '1',
        type: 'practice' as ActivityType,
        title: 'Practiced "Marketing Pitch"',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        details: '15 minutes practice session'
      },
      {
        id: '2',
        type: 'feedback' as ActivityType,
        title: 'Received Feedback',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        details: 'On "Team Update" speech'
      },
      {
        id: '3',
        type: 'completion' as ActivityType,
        title: 'Completed "Introduction to AI" preparation',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
      }
    ];
  }, [speeches]);

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'practice':
        return <MicIcon className="h-6 w-6 text-pink-500" />;
      case 'feedback':
        return <FileTextIcon className="h-6 w-6 text-purple-500" />;
      case 'completion':
        return <CircleCheckBig className="h-6 w-6 text-green-500" />;
      default:
        return <Clock className="h-6 w-6 text-gray-500" />;
    }
  };

  const getTimeAgo = (date: Date) => {
    // Get appropriate locale for date-fns
    let locale;
    switch(currentLanguage.code) {
      case 'es':
        locale = es;
        break;
      case 'fr':
        locale = fr;
        break;
      default:
        locale = undefined; // Default to English
    }
    
    return formatDistanceToNow(date, { 
      addSuffix: true,
      locale
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="border-b p-4">
        <h2 className="text-lg font-semibold text-gray-800">{t('dashboard.recentActivities', currentLanguage.code)}</h2>
      </div>
      <div className="p-4">
        <ul className="space-y-4">
          {activities.map((activity) => (
            <li key={activity.id} className="flex">
              <div className="flex-shrink-0 mr-3">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                {activity.details && (
                  <p className="text-sm text-gray-500">{activity.details}</p>
                )}
                <p className="text-xs text-gray-400 mt-1">{getTimeAgo(activity.timestamp)}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="border-t p-4 text-center">
        <button className="text-pink-600 hover:text-pink-800 text-sm font-medium">
          {t('dashboard.viewAll', currentLanguage.code)}
        </button>
      </div>
    </div>
  );
};

export default RecentActivities;
