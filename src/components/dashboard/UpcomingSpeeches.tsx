
import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/translations';
import { Speech } from '@/types/auth';
import EventForm from './upcoming-speeches/EventForm';
import EventList from './upcoming-speeches/EventList';
import { useUpcomingEvents } from './upcoming-speeches/useUpcomingEvents';

interface UpcomingSpeechesProps {
  speeches?: Speech[];
}

const UpcomingSpeeches = ({ speeches = [] }: UpcomingSpeechesProps) => {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation();
  const { 
    upcomingEvents, 
    addEvent, 
    createSpeechFromEvent, 
    viewAllEvents,
    loadEvents
  } = useUpcomingEvents(speeches);

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="border-b p-4">
        <h2 className="text-lg font-semibold text-gray-800">{t('dashboard.upcomingSpeeches', currentLanguage.code)}</h2>
      </div>
      
      {/* Add new event form */}
      <EventForm onAddEvent={addEvent} />
      
      {/* List of upcoming events */}
      <EventList 
        events={upcomingEvents}
        onCreateSpeech={createSpeechFromEvent}
        refreshEvents={loadEvents}
      />
      
      <div className="border-t p-4 text-center">
        <Button 
          variant="link" 
          className="text-pink-600 hover:text-pink-800 text-sm"
          onClick={viewAllEvents}
        >
          {t('dashboard.viewAll', currentLanguage.code)}
        </Button>
      </div>
    </div>
  );
};

export default UpcomingSpeeches;
