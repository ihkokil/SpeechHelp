
import { Calendar, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/translations';
import { Speech } from '@/types/auth';
import { useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

interface SpeechEvent {
  id: string;
  title: string;
  date: Date;
  duration: number; // in minutes
  category: string;
  status: 'upcoming' | 'in-progress' | 'completed';
}

interface UpcomingSpeechesProps {
  speeches?: Speech[];
}

const UpcomingSpeeches = ({ speeches = [] }: UpcomingSpeechesProps) => {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation();
  const navigate = useNavigate();
  // Use ref to store stable mock data
  const mockDataRef = useRef<SpeechEvent[]>([
    {
      id: '1',
      title: 'Company Quarterly Review',
      date: new Date(Date.now() + 86400000 * 2), // 2 days from now
      duration: 15,
      category: 'presentation',
      status: 'upcoming' as const
    },
    {
      id: '2',
      title: 'Job Interview with Tech Co.',
      date: new Date(Date.now() + 86400000 * 5), // 5 days from now
      duration: 30,
      category: 'interview',
      status: 'upcoming' as const
    },
    {
      id: '3',
      title: 'Industry Conference Talk',
      date: new Date(Date.now() + 86400000 * 12), // 12 days from now
      duration: 45,
      category: 'speech',
      status: 'upcoming' as const
    }
  ]);

  // Transform speeches to upcoming speech events
  const upcomingEvents = useMemo(() => {
    if (speeches.length) {
      // Create a stable seed for random values based on speech IDs
      return speeches
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 3)
        .map((speech, index) => {
          // Use deterministic date calculations based on speech ID
          // This ensures the same speech always gets the same upcoming date
          const upcomingDate = new Date();
          // Use the hash of the speech ID to generate a consistent day offset
          const hashCode = speech.id.split('').reduce((acc, char) => {
            return char.charCodeAt(0) + ((acc << 5) - acc);
          }, 0);
          const daysToAdd = Math.abs(hashCode % 14) + 1; // 1-14 days
          upcomingDate.setDate(upcomingDate.getDate() + daysToAdd);
          
          // Similarly use a deterministic approach for duration
          const duration = Math.abs((hashCode >> 4) % 30) + 15; // 15-45 minutes
          
          return {
            id: speech.id,
            title: speech.title,
            date: upcomingDate,
            duration: duration,
            category: speech.speech_type,
            status: 'upcoming' as const
          };
        });
    }
    
    // Return the stable mock data if no speeches
    return mockDataRef.current;
  }, [speeches]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(currentLanguage.code, { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getCategoryColor = (category: string) => {
    const categories: Record<string, string> = {
      'presentation': 'bg-blue-100 text-blue-700',
      'meeting': 'bg-green-100 text-green-700',
      'interview': 'bg-purple-100 text-purple-700',
      'speech': 'bg-amber-100 text-amber-700',
      'wedding': 'bg-pink-100 text-pink-700',
      'birthday': 'bg-yellow-100 text-yellow-700',
      'graduation': 'bg-indigo-100 text-indigo-700',
      'retirement': 'bg-orange-100 text-orange-700',
      'award': 'bg-emerald-100 text-emerald-700',
      'funeral': 'bg-slate-100 text-slate-700',
      'social': 'bg-rose-100 text-rose-700',
      'business': 'bg-sky-100 text-sky-700',
      'entertaining': 'bg-violet-100 text-violet-700',
      'persuasive': 'bg-teal-100 text-teal-700',
      'motivational': 'bg-lime-100 text-lime-700',
      'informative': 'bg-cyan-100 text-cyan-700',
      'TED': 'bg-red-100 text-red-700',
      'keynote': 'bg-blue-100 text-blue-700',
      'other': 'bg-gray-100 text-gray-700'
    };
    
    return categories[category.toLowerCase()] || 'bg-gray-100 text-gray-700';
  };

  const handleCreateNewSpeech = () => {
    navigate('/speech-lab');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="border-b p-4">
        <h2 className="text-lg font-semibold text-gray-800">{t('dashboard.upcomingSpeeches', currentLanguage.code)}</h2>
      </div>
      {upcomingEvents.length > 0 ? (
        <div className="divide-y">
          {upcomingEvents.map((speech) => (
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
      ) : (
        <div className="p-8 text-center">
          <p className="text-gray-500 mb-4">{t('dashboard.noUpcomingSpeeches', currentLanguage.code)}</p>
          <Button 
            variant="outline" 
            onClick={handleCreateNewSpeech}
          >
            {t('dashboard.createSpeech', currentLanguage.code)}
          </Button>
        </div>
      )}
      <div className="border-t p-4 text-center">
        <Button variant="link" className="text-pink-600 hover:text-pink-800 text-sm">
          {t('dashboard.viewAll', currentLanguage.code)}
        </Button>
      </div>
    </div>
  );
};

export default UpcomingSpeeches;
