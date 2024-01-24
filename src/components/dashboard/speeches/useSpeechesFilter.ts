
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
    
    // Then, filter by type
    if (filterType !== 'all') {
      if (filterType === 'upcoming') {
        // For upcoming, we need to check the localStorage for scheduled upcoming speeches
        try {
          const upcomingEventsJSON = localStorage.getItem('upcomingEvents');
          if (upcomingEventsJSON) {
            const upcomingEvents = JSON.parse(upcomingEventsJSON);
            const upcomingSpeechIds = upcomingEvents.map((event: any) => event.id);
            
            // Only include speeches that are in the upcoming events list
            filtered = filtered.filter(speech => upcomingSpeechIds.includes(speech.id));
          } else {
            // If no upcoming events are stored, return an empty array
            filtered = [];
          }
        } catch (error) {
          console.error('Error parsing upcoming events:', error);
          filtered = [];
        }
      } else {
        // Filter by regular speech type
        filtered = filtered.filter((speech) => speech.speech_type === filterType);
      }
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
