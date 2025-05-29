
import { useMemo } from 'react';
import { Speech } from '@/types/speech';

export const useUpcomingEventsFilter = () => {
  const upcomingSpeeches = useMemo(() => {
    try {
      const storageKey = 'upcomingEvents_guest';
      const upcomingEventsJSON = localStorage.getItem(storageKey);
      
      if (!upcomingEventsJSON) return [];
      
      const upcomingEvents = JSON.parse(upcomingEventsJSON);
      
      return upcomingEvents.map((event: any) => ({
        id: event.id,
        user_id: 'guest',
        title: event.title || 'Untitled Event',
        content: event.notes || '',
        created_at: event.date || '',
        updated_at: event.date || '',
        speech_type: event.category || 'upcoming',
        isUpcoming: true,
        event_date: event.date
      })) as Speech[];
    } catch (error) {
      console.error('Error loading upcoming events:', error);
      return [];
    }
  }, []);
  
  return { upcomingSpeeches };
};
