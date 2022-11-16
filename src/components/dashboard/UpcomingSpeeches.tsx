
import { Calendar, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/translations';

interface SpeechEvent {
  id: string;
  title: string;
  date: Date;
  duration: number; // in minutes
  category: 'presentation' | 'meeting' | 'interview' | 'speech';
  status: 'upcoming' | 'in-progress' | 'completed';
}

const MOCK_SPEECHES: SpeechEvent[] = [
  {
    id: '1',
    title: 'Company Quarterly Review',
    date: new Date(Date.now() + 86400000 * 2), // 2 days from now
    duration: 15,
    category: 'presentation',
    status: 'upcoming'
  },
  {
    id: '2',
    title: 'Job Interview with Tech Co.',
    date: new Date(Date.now() + 86400000 * 5), // 5 days from now
    duration: 30,
    category: 'interview',
    status: 'upcoming'
  },
  {
    id: '3',
    title: 'Industry Conference Talk',
    date: new Date(Date.now() + 86400000 * 12), // 12 days from now
    duration: 45,
    category: 'speech',
    status: 'upcoming'
  }
];

const UpcomingSpeeches = () => {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation();

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(currentLanguage.code, { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getCategoryColor = (category: SpeechEvent['category']) => {
    switch (category) {
      case 'presentation':
        return 'bg-blue-100 text-blue-700';
      case 'meeting':
        return 'bg-green-100 text-green-700';
      case 'interview':
        return 'bg-purple-100 text-purple-700';
      case 'speech':
        return 'bg-amber-100 text-amber-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="border-b p-4">
        <h2 className="text-lg font-semibold text-gray-800">{t('dashboard.upcomingSpeeches', currentLanguage.code)}</h2>
      </div>
      <div className="divide-y">
        {MOCK_SPEECHES.map((speech) => (
          <div key={speech.id} className="p-4 flex items-center justify-between">
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">{speech.title}</h3>
              <div className="mt-1 flex items-center text-sm text-gray-500 space-x-4">
                <div className="flex items-center">
                  <Calendar className="mr-1 h-4 w-4" />
                  <span>{formatDate(speech.date)}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="mr-1 h-4 w-4" />
                  <span>{speech.duration} min</span>
                </div>
              </div>
            </div>
            <div className="ml-4 flex flex-col items-end space-y-2">
              <Badge className={`${getCategoryColor(speech.category)}`}>
                {speech.category.charAt(0).toUpperCase() + speech.category.slice(1)}
              </Badge>
              <Button variant="outline" size="sm" className="text-xs">
                {t('dashboard.prepare', currentLanguage.code)}
              </Button>
            </div>
          </div>
        ))}
      </div>
      <div className="border-t p-4 text-center">
        <Button variant="link" className="text-pink-600 hover:text-pink-800 text-sm">
          {t('dashboard.viewAll', currentLanguage.code)}
        </Button>
      </div>
    </div>
  );
};

export default UpcomingSpeeches;
