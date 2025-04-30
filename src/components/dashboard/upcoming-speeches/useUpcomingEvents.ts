
import { useState, useEffect, useCallback } from 'react';
import { SpeechEvent } from './types';
import { Speech } from '@/types/speech';
import { loadEventsFromStorage, saveEventsToStorage } from './utils';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/translations';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export const useUpcomingEvents = (speeches: Speech[] = []) => {
  const [upcomingEvents, setUpcomingEvents] = useState<SpeechEvent[]>([]);
  const navigate = useNavigate();
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation();
  const { user } = useAuth(); // Get the current user

  // Load events from localStorage - now with user ID scoping
  const loadEvents = useCallback(() => {
    // Make sure we have a user before loading events
    if (!user?.id) {
      console.log('No user ID available, not loading events');
      setUpcomingEvents([]);
      return;
    }
    
    const userId = user.id;
    console.log(`Loading upcoming events for user: ${userId}`);
    
    // Load events from localStorage with user ID as part of the key
    const storageKey = `upcomingEvents_${userId}`;
    const eventsJson = localStorage.getItem(storageKey);
    
    if (eventsJson) {
      try {
        const loadedEvents = JSON.parse(eventsJson);
        console.log(`Loaded ${loadedEvents.length} events for user ${userId}`);
        setUpcomingEvents(loadedEvents);
      } catch (error) {
        console.error('Error parsing events from storage:', error);
        setUpcomingEvents([]);
      }
    } else if (speeches.length && !localStorage.getItem(storageKey)) {
      // If no saved events but we have speeches, create example events (legacy behavior)
      console.log(`Creating example events for user ${userId} based on speeches`);
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
      saveEventsForUser(exampleEvents, userId);
    } else {
      console.log(`No events found for user ${userId}`);
      setUpcomingEvents([]);
    }
  }, [user, speeches]);

  // Save events with user ID scoping
  const saveEventsForUser = useCallback((events: SpeechEvent[], userId: string) => {
    if (!userId) {
      console.error('Cannot save events: No user ID provided');
      return;
    }
    
    const storageKey = `upcomingEvents_${userId}`;
    localStorage.setItem(storageKey, JSON.stringify(events));
    console.log(`Saved ${events.length} events for user ${userId}`);
  }, []);

  // Add a new event
  const addEvent = useCallback((title: string, type: string, date: Date) => {
    if (!user?.id) {
      console.error('Cannot add event: No user ID available');
      return;
    }
    
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
    
    // Save to localStorage with user ID
    saveEventsForUser(updatedEvents, user.id);
    
    toast.success(t('dashboard.eventAdded', currentLanguage.code));
  }, [upcomingEvents, user, saveEventsForUser, currentLanguage.code, t]);

  // Handle creating a speech from an event
  const createSpeechFromEvent = useCallback((event: SpeechEvent) => {
    if (!user?.id) {
      console.error('Cannot create speech: No user ID available');
      return;
    }
    
    // Store event details for use in Speech Lab
    localStorage.setItem('currentEvent', JSON.stringify(event));
    navigate('/speech-lab');
  }, [user, navigate]);

  // View all upcoming speeches
  const viewAllEvents = useCallback(() => {
    localStorage.setItem('viewingUpcomingEvents', 'true');
    navigate('/my-speeches?filter=upcoming');
  }, [navigate]);
  
  // Load events whenever user or speeches change
  useEffect(() => {
    if (user?.id) {
      loadEvents();
    } else {
      // Clear events when no user is logged in
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
