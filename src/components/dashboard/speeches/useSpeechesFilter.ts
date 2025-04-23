
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
    // Log the original speeches to see what we're working with
    console.log('Original speeches array count:', speeches.length);
    
    // Make a copy of the original speeches array and ensure each speech has isUpcoming property
    const allSpeeches = Array.isArray(speeches) ? speeches.map(speech => ({
      ...speech,
      isUpcoming: false // Regular speeches are not upcoming
    })) : [];
    
    console.log('Regular speeches after mapping:', allSpeeches.length);
    
    // Get upcoming speech events from localStorage
    let upcomingEvents: any[] = [];
    try {
      const upcomingEventsJSON = localStorage.getItem('upcomingEvents');
      if (upcomingEventsJSON) {
        const parsedEvents = JSON.parse(upcomingEventsJSON);
        upcomingEvents = Array.isArray(parsedEvents) ? parsedEvents : [];
        console.log('Found upcoming events in localStorage:', upcomingEvents.length);
      } else {
        console.log('No upcoming events found in localStorage');
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
      isUpcoming: true, // Explicitly mark as upcoming
      event_date: event.date
    } as Speech));

    console.log('Created upcoming speeches objects:', upcomingSpeeches.length);

    // Combine regular and upcoming speeches for initial filtering
    const combinedSpeeches = [...allSpeeches, ...upcomingSpeeches];
    
    console.log('Combined speeches before filtering:', combinedSpeeches.length);
    
    // Apply search filter if provided
    let searchFiltered = combinedSpeeches;
    if (searchQuery && searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      searchFiltered = combinedSpeeches.filter(
        (speech) => 
          (speech.title && speech.title.toLowerCase().includes(query)) || 
          (speech.content && speech.content.toLowerCase().includes(query))
      );
      console.log('After search filtering, speeches count:', searchFiltered.length);
    }
    
    // Apply type filter
    let filtered: Speech[] = [];
    if (filterType === 'all') {
      // Show all speeches - both regular and upcoming
      filtered = searchFiltered; 
      console.log('All filter applied, speeches count:', filtered.length);
    } else if (filterType === 'upcoming') {
      // Only show upcoming speeches 
      filtered = searchFiltered.filter(speech => speech.isUpcoming === true);
      console.log('Upcoming filter applied, speeches count:', filtered.length);
    } else {
      // Filter by specific speech type and exclude upcoming speeches
      filtered = searchFiltered.filter(speech => speech.speech_type === filterType && speech.isUpcoming === false);
      console.log('Speech type filter applied:', filterType, 'speeches count:', filtered.length);
    }
    
    // Log info about speeches with isUpcoming flag for debugging
    console.log('Speeches with isUpcoming = true:', 
      filtered.filter(speech => speech.isUpcoming === true).length);
    console.log('Speeches with isUpcoming = false:', 
      filtered.filter(speech => speech.isUpcoming === false).length);
    
    // Ensure uniqueness of speeches by ID
    const uniqueFilteredSpeeches = Array.from(
      new Map(filtered.map(speech => [speech.id, speech])).values()
    );
    
    console.log('Final unique filtered speeches count:', uniqueFilteredSpeeches.length);
    
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
