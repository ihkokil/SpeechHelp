
import React from 'react';
import { CalendarIcon, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { SpeechEvent } from './types';
import { getCategoryColor, formatDate, getDaysRemaining } from './utils';
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
      <div className="p-8 text-center">
        <p className="text-gray-500 mb-4">No upcoming speeches scheduled</p>
        <p className="text-gray-500 text-sm mb-4">Add your first upcoming speech event above</p>
      </div>
    );
  }
  
  // Ensure dates are properly handled before sorting
  const sortedEvents = [...events]
    .map(event => ({
      ...event,
      date: event.date instanceof Date ? event.date : new Date(event.date)
    }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());
  
  return (
    <div className="divide-y max-h-80 overflow-y-auto">
      {sortedEvents.map((speech) => (
        <div key={speech.id} className="p-4 flex items-center justify-between">
          <div className="flex-1">
            <h3 className="font-medium text-gray-900">{speech.title}</h3>
            <div className="mt-1 flex items-center text-sm text-gray-500 space-x-4">
              <div className="flex items-center">
                <CalendarIcon className="mr-1 h-4 w-4" />
                <span>{formatDate(speech.date, currentLanguage.code)}</span>
              </div>
              <div className="flex items-center">
                <Clock className="mr-1 h-4 w-4" />
                <span>{getDaysRemaining(speech.date)} Days Remaining</span>
              </div>
            </div>
          </div>
          <div className="ml-4 flex flex-col items-end space-y-2">
            <Badge className={`${getCategoryColor(speech.category)} w-24 justify-center text-center`}>
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
