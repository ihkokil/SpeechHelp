
import { useMemo } from 'react';
import { Speech } from '@/types/speech';
import { FilterOption, SortOption } from './FilterBar';
import { useAuth } from '@/contexts/AuthContext';
import { loadEventsFromStorage } from '../upcoming-speeches/utils';

export const useSpeechesFilter = (
  speeches: Speech[],
  searchQuery: string,
  filterType: FilterOption,
  sortBy: SortOption
) => {
  const { user } = useAuth();
  
  const filteredSpeeches = useMemo(() => {
    // Log input speeches for debugging
    console.log('Original speeches array count:', speeches.length);
    console.log('Original speeches:', speeches.map(s => ({ 
      id: s.id, 
      title: s.title, 
      type: s.speech_type,
      isUpcoming: s.isUpcoming 
    })));
    
    // Ensure each regular speech has correct isUpcoming flag
    let allSpeeches = speeches.map(speech => ({
      ...speech,
      isUpcoming: speech.isUpcoming || false // Default to false for regular speeches
    }));
    
    console.log('Regular speeches after mapping:', allSpeeches.length);
    
    // Get upcoming events from localStorage using user-specific key
    let upcomingEvents: any[] = [];
    if (user && user.id) {
      try {
        upcomingEvents = loadEventsFromStorage(user.id);
        console.log(`Found ${upcomingEvents.length} upcoming events for user ${user.id}:`, upcomingEvents);
      } catch (error) {
        console.error('Error parsing upcoming events:', error);
        upcomingEvents = [];
      }
    }
    
    // Create speech objects for upcoming events
    const upcomingSpeeches = upcomingEvents.map((event) => ({
      id: event.id,
      user_id: user?.id || '', 
      title: event.title || 'Untitled Event',
      content: event.notes || '',
      created_at: event.date || '', // Use event date for sorting
      updated_at: event.date || '',
      speech_type: event.category || 'upcoming',
      isUpcoming: true,
      event_date: event.date
    }));

    console.log(`Created ${upcomingSpeeches.length} upcoming speech objects`);

    // Apply search filter if provided
    let searchFiltered = [...allSpeeches, ...upcomingSpeeches];
    if (searchQuery) {
      const query = searchQuery.toLowerCase().trim();
      searchFiltered = searchFiltered.filter(speech => 
        speech.title?.toLowerCase().includes(query) || 
        speech.content?.toLowerCase().includes(query)
      );
    }
    
    // Apply type filter
    let filtered: Speech[] = [];
    if (filterType === 'all') {
      filtered = searchFiltered; // Show all speeches without filtering by type
    } else if (filterType === 'upcoming') {
      filtered = searchFiltered.filter(speech => speech.isUpcoming === true);
    } else {
      filtered = searchFiltered.filter(speech => speech.speech_type === filterType);
    }
    
    // Log filtering results for debugging
    console.log(`Filtered speeches (${filterType}):`, filtered.length);
    console.log('Regular speeches:', filtered.filter(s => !s.isUpcoming).length);
    console.log('Upcoming speeches:', filtered.filter(s => s.isUpcoming).length);
    
    // Remove duplicates based on ID
    const uniqueSpeeches = Array.from(
      new Map(filtered.map(speech => [speech.id, speech])).values()
    );
    
    console.log(`Final unique speeches count: ${uniqueSpeeches.length}`);
    
    // Sort speeches
    return uniqueSpeeches.sort((a, b) => {
      if (sortBy === 'newest') {
        if (a.isUpcoming && b.isUpcoming) {
          return new Date(b.event_date || '').getTime() - new Date(a.event_date || '').getTime();
        }
        return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
      } else if (sortBy === 'oldest') {
        if (a.isUpcoming && b.isUpcoming) {
          return new Date(a.event_date || '').getTime() - new Date(b.event_date || '').getTime();
        }
        return new Date(a.created_at || '').getTime() - new Date(b.created_at || '').getTime();
      } else if (sortBy === 'title-asc') {
        return (a.title || '').localeCompare(b.title || '');
      } else {
        return (b.title || '').localeCompare(a.title || '');
      }
    });
  }, [speeches, searchQuery, filterType, sortBy, user]);
  
  return { filteredSpeeches };
};
