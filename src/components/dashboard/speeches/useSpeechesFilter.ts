
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
    console.log('Original speeches:', speeches);
    
    // Make a copy of the original speeches array to avoid mutation issues
    // Also ensure we have an array even if speeches is undefined or null
    const allSpeeches = Array.isArray(speeches) ? [...speeches] : [];
    
    // Separate regular speeches and upcoming speeches from the array
    let regularSpeeches = allSpeeches.filter(speech => !speech.isUpcoming);
    console.log('Regular speeches count:', regularSpeeches.length);
    
    // Get upcoming speech events from localStorage
    let upcomingEvents: any[] = [];
    try {
      const upcomingEventsJSON = localStorage.getItem('upcomingEvents');
      if (upcomingEventsJSON) {
        // Parse the JSON and ensure we get an array
        const parsedEvents = JSON.parse(upcomingEventsJSON);
        upcomingEvents = Array.isArray(parsedEvents) ? parsedEvents : [];
        
        // Deduplicate upcoming events based on id
        upcomingEvents = Array.from(
          new Map(upcomingEvents.map(event => [event.id, event])).values()
        );
      }
    } catch (error) {
      console.error('Error parsing upcoming events:', error);
      upcomingEvents = [];
    }
    
    console.log('Upcoming events count:', upcomingEvents.length);
    
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
    
    console.log('Transformed upcoming speeches count:', upcomingSpeeches.length);
    
    // Filter by search query if provided
    let filteredRegularSpeeches = [...regularSpeeches];
    let filteredUpcomingSpeeches = [...upcomingSpeeches];
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      
      // Apply the search filter separately to regular and upcoming speeches
      filteredRegularSpeeches = filteredRegularSpeeches.filter(
        (speech) => 
          (speech.title && speech.title.toLowerCase().includes(query)) || 
          (speech.content && speech.content.toLowerCase().includes(query))
      );
      
      filteredUpcomingSpeeches = filteredUpcomingSpeeches.filter(
        (speech) => 
          (speech.title && speech.title.toLowerCase().includes(query)) || 
          (speech.content && speech.content.toLowerCase().includes(query))
      );
    }
    
    console.log('After search filter - Regular speeches:', filteredRegularSpeeches.length);
    console.log('After search filter - Upcoming speeches:', filteredUpcomingSpeeches.length);
    
    // Apply filter based on selected type
    let filtered: Speech[] = [];
    
    if (filterType === 'all') {
      // For "all", include both regular and upcoming speeches
      filtered = [...filteredRegularSpeeches, ...filteredUpcomingSpeeches];
      console.log('All filtered speeches count (all):', filtered.length);
    } else if (filterType === 'upcoming') {
      // For "upcoming", only show upcoming events
      filtered = [...filteredUpcomingSpeeches];
      console.log('All filtered speeches count (upcoming):', filtered.length);
    } else {
      // Filter regular speeches by speech type
      filtered = filteredRegularSpeeches.filter((speech) => speech.speech_type === filterType);
      console.log('All filtered speeches count (specific type):', filtered.length);
    }
    
    // Ensure uniqueness of speeches by ID
    const uniqueFilteredSpeeches = Array.from(
      new Map(filtered.map(speech => [speech.id, speech])).values()
    );
    
    console.log('After deduplication - Final filtered count:', uniqueFilteredSpeeches.length);
    console.log('Final filtered speeches:', uniqueFilteredSpeeches);
    
    // Finally, sort the filtered speeches
    return uniqueFilteredSpeeches.sort((a, b) => {
      if (sortBy === 'newest') {
        // For upcoming speeches with event dates, sort by event date
        if (a.isUpcoming && b.isUpcoming) {
          if (a.event_date && b.event_date) {
            return new Date(b.event_date).getTime() - new Date(a.event_date).getTime();
          }
          return 0;
        }
        
        // Upcoming speeches should appear before regular speeches
        if (a.isUpcoming && !b.isUpcoming) return -1;
        if (!a.isUpcoming && b.isUpcoming) return 1;
        
        // For regular speeches, sort by created_at date, with a fallback for speeches without dates
        const aDate = a.created_at ? new Date(a.created_at).getTime() : 0;
        const bDate = b.created_at ? new Date(b.created_at).getTime() : 0;
        return bDate - aDate;
      } else if (sortBy === 'oldest') {
        // For upcoming speeches with event dates, sort by event date
        if (a.isUpcoming && b.isUpcoming) {
          if (a.event_date && b.event_date) {
            return new Date(a.event_date).getTime() - new Date(b.event_date).getTime();
          }
          return 0;
        }
        
        // Regular speeches should appear before upcoming speeches
        if (a.isUpcoming && !b.isUpcoming) return 1;
        if (!a.isUpcoming && b.isUpcoming) return -1;
        
        // For regular speeches, sort by created_at date, with a fallback for speeches without dates
        const aDate = a.created_at ? new Date(a.created_at).getTime() : 0;
        const bDate = b.created_at ? new Date(b.created_at).getTime() : 0;
        return aDate - bDate;
      } else if (sortBy === 'title-asc') {
        return (a.title || '').localeCompare(b.title || '');
      } else {
        return (b.title || '').localeCompare(a.title || '');
      }
    });
  }, [speeches, searchQuery, filterType, sortBy]);
  
  return { filteredSpeeches };
};
