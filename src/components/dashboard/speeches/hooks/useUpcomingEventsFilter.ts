
import { useMemo } from 'react';
import { Speech } from '@/types/speech';
import { useAuth } from '@/contexts/AuthContext';

export const useUpcomingEventsFilter = () => {
  const { user } = useAuth();
  
  const upcomingSpeeches = useMemo(() => {
    if (!user?.id) return [];
    
    try {
      const storageKey = `upcomingEvents_${user.id}`;
      const upcomingEventsJSON = localStorage.getItem(storageKey);
      
      if (!upcomingEventsJSON) return [];
      
      const upcomingEvents = JSON.parse(upcomingEventsJSON);
      
      return upcomingEvents.map((event: any) => ({
        id: event.id,
        user_id: user.id,
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
  }, [user?.id]);
  
  return { upcomingSpeeches };
};
