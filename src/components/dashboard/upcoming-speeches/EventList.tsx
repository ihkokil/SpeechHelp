
import React from 'react';
import { CalendarIcon, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { SpeechEvent } from './types';
import { getCategoryColor, formatDate } from './utils';
import UpcomingEventActions from './UpcomingEventActions';
import { useLanguage } from '@/contexts/LanguageContext';

interface EventListProps {
  events: SpeechEvent[];
  onCreateSpeech: (event: SpeechEvent) => void;
  refreshEvents: () => void;
}

const EventList: React.FC<EventListProps> = ({ events, onCreateSpeech, refreshEvents }) => {
  const { currentLanguage } = useLanguage();
  
  if (events.length === 0) {
    return (
      <div className="p-4 sm:p-8 text-center">
        <p className="text-gray-500 mb-3 sm:mb-4">No upcoming speeches scheduled</p>
        <p className="text-gray-500 text-sm mb-2 sm:mb-4">Add your first upcoming speech event above</p>
      </div>
    );
  }
  
  return (
    <div className="divide-y max-h-60 sm:max-h-80 overflow-y-auto">
      {events
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .map((speech) => (
        <div key={speech.id} className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
          <div className="flex-1">
            <h3 className="font-medium text-gray-900 truncate">{speech.title}</h3>
            <div className="mt-1 flex flex-wrap items-center text-xs sm:text-sm text-gray-500 gap-2 sm:gap-4">
              <div className="flex items-center">
                <CalendarIcon className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                <span>{formatDate(new Date(speech.date), currentLanguage.code)}</span>
              </div>
              <div className="flex items-center">
                <Clock className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                <span>{speech.duration} min</span>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center sm:flex-col sm:items-end mt-2 sm:mt-0 sm:space-y-2">
            <Badge className={`${getCategoryColor(speech.category)} text-xs`}>
              {speech.category.charAt(0).toUpperCase() + speech.category.slice(1)}
            </Badge>
            <UpcomingEventActions 
              event={speech}
              onCreateSpeech={onCreateSpeech}
              refreshEvents={refreshEvents}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventList;
