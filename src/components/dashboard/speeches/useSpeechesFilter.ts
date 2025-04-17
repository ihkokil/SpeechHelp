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
    
    // Get upcoming speech IDs from localStorage (if any)
    let upcomingSpeechIds: string[] = [];
    try {
      const upcomingEventsJSON = localStorage.getItem('upcomingEvents');
      if (upcomingEventsJSON) {
        const upcomingEvents = JSON.parse(upcomingEventsJSON);
        upcomingSpeechIds = upcomingEvents.map((event: any) => event.id);
      }
    } catch (error) {
      console.error('Error parsing upcoming events:', error);
    }
    
    // Then, filter by type
    if (filterType === 'all') {
      // For "all", we don't need to filter by type
      // Just keep all speeches as is (already included in 'filtered')
    } else if (filterType === 'upcoming') {
      // For upcoming, only include speeches that are in the upcoming events list
      if (upcomingSpeechIds.length > 0) {
        filtered = filtered.filter(speech => upcomingSpeechIds.includes(speech.id));
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
