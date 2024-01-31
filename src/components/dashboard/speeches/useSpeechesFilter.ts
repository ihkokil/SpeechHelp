
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
    // Start with regular speeches
    let regularSpeeches = [...speeches];
    
    // Get upcoming speech events from localStorage (only once)
    let upcomingEvents: any[] = [];
    try {
      const upcomingEventsJSON = localStorage.getItem('upcomingEvents');
      if (upcomingEventsJSON) {
        // Parse the JSON and ensure we get an array
        const parsedEvents = JSON.parse(upcomingEventsJSON);
        upcomingEvents = Array.isArray(parsedEvents) ? parsedEvents : [];
      }
    } catch (error) {
      console.error('Error parsing upcoming events:', error);
      upcomingEvents = [];
    }
    
    // Create speech-like objects for upcoming events
    // Use event.id directly to maintain unique IDs
    const upcomingSpeeches = upcomingEvents.map((event) => ({
      id: event.id,
      user_id: '', 
      title: event.title,
      content: event.notes || '',
      created_at: '', 
      updated_at: '', 
      speech_type: event.category || 'upcoming',
      isUpcoming: true,
      event_date: event.date
    } as Speech)); // Explicitly cast to Speech type
    
    // Initialize full collection of speeches (regular + upcoming)
    // Cast explicitly to ensure all items are treated as Speech type
    let allSpeeches: Speech[] = [...regularSpeeches, ...upcomingSpeeches];
    
    // Filter by search query if provided
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      
      // Apply the filter to all speeches together
      allSpeeches = allSpeeches.filter(
        (speech) => 
          speech.title.toLowerCase().includes(query) || 
          (speech.content && speech.content.toLowerCase().includes(query))
      );
      
      // After filtering, split back into regular and upcoming for filter type logic
      regularSpeeches = allSpeeches.filter(speech => speech.isUpcoming !== true);
      const filteredUpcomingSpeeches = allSpeeches.filter(speech => speech.isUpcoming === true);
      
      // Update the upcomingSpeeches array
      upcomingSpeeches.length = 0;
      upcomingSpeeches.push(...filteredUpcomingSpeeches);
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
        // For upcoming speeches which don't have dates, always sort to the top
        if (a.isUpcoming && !b.isUpcoming) return -1;
        if (!a.isUpcoming && b.isUpcoming) return 1;
        if (a.isUpcoming && b.isUpcoming) return 0;
        
        // For regular speeches, sort by date
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else if (sortBy === 'oldest') {
        // For upcoming speeches which don't have dates, always sort to the bottom
        if (a.isUpcoming && !b.isUpcoming) return 1;
        if (!a.isUpcoming && b.isUpcoming) return -1;
        if (a.isUpcoming && b.isUpcoming) return 0;
        
        // For regular speeches, sort by date
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
