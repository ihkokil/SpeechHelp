
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { SpeechEvent } from './types';
import { Speech } from '@/types/speech';
import { loadEventsFromStorage, saveEventsToStorage, removeEventFromStorage } from './utils';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/translations';
import { useAuth } from '@/contexts/AuthContext';

export const useUpcomingEvents = (speeches: Speech[] = []) => {
  const [upcomingEvents, setUpcomingEvents] = useState<SpeechEvent[]>([]);
  const navigate = useNavigate();
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation();
  const { user } = useAuth();

  const loadEvents = useCallback(() => {
    if (!user?.id) {
      setUpcomingEvents([]);
      return;
    }
    
    const loadedEvents = loadEventsFromStorage(user.id);
    
    if (loadedEvents && loadedEvents.length > 0) {
      const eventsWithDates = loadedEvents.map(event => ({
        ...event,
        date: event.date instanceof Date ? event.date : new Date(event.date)
      }));
      setUpcomingEvents(eventsWithDates);
    } else {
      // No auto-generation - upcoming events should only be created explicitly
      setUpcomingEvents([]);
    }
  }, [user, speeches]);

  const addEvent = useCallback((title: string, type: string, date: Date) => {
    if (!user?.id) return;
    
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
    saveEventsToStorage(updatedEvents, user.id);
    
    toast.success(t('dashboard.eventAdded', currentLanguage.code));
  }, [upcomingEvents, user, currentLanguage.code, t]);

  const createSpeechFromEvent = useCallback((event: SpeechEvent) => {
    if (!user?.id) return;
    
    const processedEvent = {
      ...event,
      date: event.date instanceof Date 
        ? event.date.toISOString() 
        : new Date(event.date).toISOString()
    };
    
    // Store the event details for the speech lab to pick up
    localStorage.setItem('currentEvent', JSON.stringify(processedEvent));
    
    // Remove the event from upcoming events since it's being converted to a speech
    removeEventFromStorage(event.id, user.id);
    
    // Update local state to reflect the removal
    setUpcomingEvents(prev => prev.filter(e => e.id !== event.id));
    
    // Navigate to speech lab which will initialize with the event data
    navigate('/speech-lab');
  }, [user, navigate]);

  const viewAllEvents = useCallback(() => {
    localStorage.setItem('viewingUpcomingEvents', 'true');
    navigate('/my-speeches?filter=upcoming');
  }, [navigate]);
  
  useEffect(() => {
    if (user?.id) {
      loadEvents();
    } else {
      setUpcomingEvents([]);
    }
  }, [user, speeches, loadEvents]);

  return {
    upcomingEvents,
    loadEvents,
    addEvent,
    createSpeechFromEvent,
    viewAllEvents
  };
};
