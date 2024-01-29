
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
      created_at: '', // Empty string instead of current date
      updated_at: '', // Empty string instead of current date
      speech_type: event.category || 'upcoming',
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
      const filteredUpcomingSpeeches = upcomingSpeeches.filter(
        (speech) => 
          speech.title.toLowerCase().includes(query)
      );
      
      upcomingSpeeches.length = 0; // Clear the array
      upcomingSpeeches.push(...filteredUpcomingSpeeches); // Add filtered results
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
      // Handle empty dates for upcoming speeches
      const dateA = a.created_at ? new Date(a.created_at).getTime() : Date.now();
      const dateB = b.created_at ? new Date(b.created_at).getTime() : Date.now();
      
      if (sortBy === 'newest') {
        return dateB - dateA;
      } else if (sortBy === 'oldest') {
        return dateA - dateB;
      } else if (sortBy === 'title-asc') {
        return a.title.localeCompare(b.title);
      } else {
        return b.title.localeCompare(a.title);
      }
    });
  }, [speeches, searchQuery, filterType, sortBy]);
  
  return { filteredSpeeches };
};
