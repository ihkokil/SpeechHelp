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
    // Make a copy of the original speeches array
    const allSpeeches = Array.isArray(speeches) ? [...speeches] : [];
    
    // Get upcoming speech events from localStorage
    let upcomingEvents: any[] = [];
    try {
      const upcomingEventsJSON = localStorage.getItem('upcomingEvents');
      if (upcomingEventsJSON) {
        const parsedEvents = JSON.parse(upcomingEventsJSON);
        upcomingEvents = Array.isArray(parsedEvents) ? parsedEvents : [];
      }
    } catch (error) {
      console.error('Error parsing upcoming events:', error);
      upcomingEvents = [];
    }
    
    // Create speech-like objects for upcoming events
    const upcomingSpeeches = upcomingEvents.map((event) => ({
      id: event.id || `upcoming-${Date.now()}-${Math.random()}`,
      user_id: '', 
      title: event.title || 'Untitled Event',
      content: event.notes || '',
      created_at: '', 
      updated_at: '', 
      speech_type: event.category || 'upcoming',
      isUpcoming: true,
      event_date: event.date
    } as Speech));

    // Combine regular and upcoming speeches for initial filtering
    let combinedSpeeches = [...allSpeeches, ...upcomingSpeeches];
    
    // Apply search filter if provided
    if (searchQuery && searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      combinedSpeeches = combinedSpeeches.filter(
        (speech) => 
          (speech.title && speech.title.toLowerCase().includes(query)) || 
          (speech.content && speech.content.toLowerCase().includes(query))
      );
    }
    
    // Apply type filter
    let filtered: Speech[] = [];
    if (filterType === 'all') {
      filtered = combinedSpeeches; // Show all speeches for 'all' filter
    } else if (filterType === 'upcoming') {
      filtered = combinedSpeeches.filter(speech => speech.isUpcoming);
    } else {
      filtered = combinedSpeeches.filter(speech => speech.speech_type === filterType && !speech.isUpcoming);
    }
    
    // Ensure uniqueness of speeches by ID
    const uniqueFilteredSpeeches = Array.from(
      new Map(filtered.map(speech => [speech.id, speech])).values()
    );
    
    // Sort the filtered speeches
    return uniqueFilteredSpeeches.sort((a, b) => {
      if (sortBy === 'newest') {
        if (a.isUpcoming && b.isUpcoming) {
          return new Date(b.event_date || '').getTime() - new Date(a.event_date || '').getTime();
        }
        if (a.isUpcoming) return -1;
        if (b.isUpcoming) return 1;
        return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
      } else if (sortBy === 'oldest') {
        if (a.isUpcoming && b.isUpcoming) {
          return new Date(a.event_date || '').getTime() - new Date(b.event_date || '').getTime();
        }
        if (a.isUpcoming) return 1;
        if (b.isUpcoming) return -1;
        return new Date(a.created_at || '').getTime() - new Date(b.created_at || '').getTime();
      } else if (sortBy === 'title-asc') {
        return (a.title || '').localeCompare(b.title || '');
      } else {
        return (b.title || '').localeCompare(a.title || '');
      }
    });
  }, [speeches, searchQuery, filterType, sortBy]);
  
  return { filteredSpeeches };
};
