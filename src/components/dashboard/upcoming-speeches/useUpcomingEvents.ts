
import { useState, useEffect } from 'react';
import { SpeechEvent } from './types';
import { Speech } from '@/types/speech';
import { loadEventsFromStorage, saveEventsToStorage } from './utils';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/translations';
import { useNavigate } from 'react-router-dom';

export const useUpcomingEvents = (speeches: Speech[] = []) => {
  const [upcomingEvents, setUpcomingEvents] = useState<SpeechEvent[]>([]);
  const navigate = useNavigate();
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation();

  // Load events from localStorage
  const loadEvents = () => {
    const loadedEvents = loadEventsFromStorage();
    if (loadedEvents.length > 0) {
      setUpcomingEvents(loadedEvents);
    } else if (speeches.length && !localStorage.getItem('upcomingEvents')) {
      // If no saved events but we have speeches, create example events (legacy behavior)
      const exampleEvents = speeches
        .slice(0, 3)
        .map((speech, index) => {
          const upcomingDate = new Date();
          upcomingDate.setDate(upcomingDate.getDate() + (index + 1) * 3);
          
          const durationBase = parseInt(speech.id.substring(0, 8), 16);
          const duration = (durationBase % 20) + 15;
          
          return {
            id: speech.id,
            title: speech.title,
            date: upcomingDate,
            duration: duration,
            category: speech.speech_type,
            status: 'upcoming' as const
          };
        });
      setUpcomingEvents(exampleEvents);
      saveEventsToStorage(exampleEvents);
    }
  };

  // Add a new event
  const addEvent = (title: string, type: string, date: Date) => {
    const eventTitle = title || `Upcoming ${type.charAt(0).toUpperCase() + type.slice(1)} Speech`;
    
    const newEvent: SpeechEvent = {
      id: crypto.randomUUID(),
      title: eventTitle,
      date: date,
      duration: 15,
      category: type,
      status: 'upcoming'
    };
    
    const updatedEvents = [...upcomingEvents, newEvent];
    setUpcomingEvents(updatedEvents);
    
    // Save to localStorage
    saveEventsToStorage(updatedEvents);
    
    toast.success(t('dashboard.eventAdded', currentLanguage.code));
  };

  // Handle creating a speech from an event
  const createSpeechFromEvent = (event: SpeechEvent) => {
    // Store event details for use in Speech Lab
    localStorage.setItem('currentEvent', JSON.stringify(event));
    navigate('/speech-lab');
  };

  // View all upcoming speeches
  const viewAllEvents = () => {
    localStorage.setItem('viewingUpcomingEvents', 'true');
    navigate('/my-speeches?filter=upcoming');
  };
  
  // Load events on initial render
  useEffect(() => {
    loadEvents();
  }, [speeches]);

  return {
    upcomingEvents,
    loadEvents,
    addEvent,
    createSpeechFromEvent,
    viewAllEvents
  };
};
