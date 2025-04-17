
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
    // First get all regular speeches
    let regularSpeeches = [...speeches];
    
    // Get upcoming speech events from localStorage
    let upcomingEvents: any[] = [];
    try {
      const upcomingEventsJSON = localStorage.getItem('upcomingEvents');
      if (upcomingEventsJSON) {
        upcomingEvents = JSON.parse(upcomingEventsJSON);
      }
    } catch (error) {
      console.error('Error parsing upcoming events:', error);
      upcomingEvents = [];
    }
    
    // Create speech-like objects for upcoming events
    const upcomingSpeeches = upcomingEvents.map((event) => ({
      id: event.id,
      user_id: '', 
      title: event.title,
      content: event.notes || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      speech_type: event.type || '',
      isUpcoming: true // Mark as upcoming for identification
    }));
    
    // Filter by search query if provided
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      regularSpeeches = regularSpeeches.filter(
        (speech) => 
          speech.title.toLowerCase().includes(query) || 
          speech.content.toLowerCase().includes(query)
      );
      
      // Also filter upcoming speeches by search query
      upcomingSpeeches.filter(
        (speech) => 
          speech.title.toLowerCase().includes(query) || 
          speech.content.toLowerCase().includes(query)
      );
    }
    
    // Apply filter based on selected type
    let filtered: Speech[] = [];
    
    if (filterType === 'all') {
      // For "all", include both regular and upcoming speeches
      filtered = [...regularSpeeches, ...upcomingSpeeches];
    } else if (filterType === 'upcoming') {
      // For "upcoming", only show upcoming events
      filtered = [...upcomingSpeeches];
    } else {
      // Filter regular speeches by speech type
      filtered = regularSpeeches.filter((speech) => speech.speech_type === filterType);
    }
    
    // Finally, sort the filtered speeches
    return filtered.sort((a, b) => {
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
