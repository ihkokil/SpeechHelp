import { useMemo } from 'react';
import { Speech } from '@/types/speech';
import { FilterOption, SortOption } from './FilterBar';

export const useSpeechesFilter = (
  speeches: Speech[],
  searchQuery: string,
  filterType: FilterOption,
  sortBy: SortOption
) => {
  const filteredSpeeches = useMemo(() => {
    // First, filter by search query
    let filtered = speeches;
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (speech) => 
          speech.title.toLowerCase().includes(query) || 
          speech.content.toLowerCase().includes(query)
      );
    }
    
    // Get upcoming speech IDs from localStorage
    let upcomingSpeeches: Speech[] = [];
    let upcomingSpeechIds: string[] = [];
    
    try {
      const upcomingEventsJSON = localStorage.getItem('upcomingEvents');
      if (upcomingEventsJSON) {
        const upcomingEvents = JSON.parse(upcomingEventsJSON);
        
        // Extract IDs from upcoming events
        upcomingSpeechIds = upcomingEvents.map((event: any) => event.id);
        
        // Create "speech objects" for upcoming events that don't exist in the speeches array
        upcomingSpeeches = upcomingEvents.map((event: any) => {
          // Find if this event already exists as a speech
          const existingSpeech = speeches.find(speech => speech.id === event.id);
          
          if (existingSpeech) {
            return existingSpeech;
          }
          
          // Otherwise, create a speech object for this upcoming event
          return {
            id: event.id,
            user_id: '', // Will be filled by the system when converted to a real speech
            title: event.title,
            content: event.notes || '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            speech_type: event.type || ''
          };
        });
      }
    } catch (error) {
      console.error('Error parsing upcoming events:', error);
    }
    
    // Then, filter by type
    if (filterType === 'all') {
      // For "all", combine regular speeches with upcoming speeches
      // First, remove any speeches that are already in the upcoming list to avoid duplicates
      const regularSpeeches = filtered.filter(speech => !upcomingSpeechIds.includes(speech.id));
      
      // Then merge unique upcoming speeches with regular speeches
      const uniqueUpcomingSpeeches = upcomingSpeeches.filter(
        upcoming => !speeches.some(speech => speech.id === upcoming.id)
      );
      
      filtered = [...regularSpeeches, ...uniqueUpcomingSpeeches];
      
    } else if (filterType === 'upcoming') {
      // For upcoming, only show speeches that are in the upcoming events list
      if (upcomingSpeeches.length > 0) {
        filtered = upcomingSpeeches;
      } else {
        filtered = []; // If no upcoming events, return empty array
      }
    } else {
      // Filter by regular speech type
      filtered = filtered.filter((speech) => speech.speech_type === filterType);
    }
    
    // Finally, sort the filtered speeches
    return [...filtered].sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else if (sortBy === 'oldest') {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      } else if (sortBy === 'title-asc') {
        return a.title.localeCompare(b.title);
      } else {
        return b.title.localeCompare(a.title);
      }
    });
  }, [speeches, searchQuery, filterType, sortBy]);
  
  return { filteredSpeeches };
};
