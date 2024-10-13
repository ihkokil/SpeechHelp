
import { useMemo } from 'react';
import { Speech } from '@/types/speech';
import { FilterOption, SortOption } from './FilterBar';
import { useAuth } from '@/contexts/AuthContext';
import { getSpeechTypeLabel } from './speech-utils';

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
    console.log('Filter type:', filterType);
    
    // Deep inspect the speeches array to see what we're actually getting
    const regularSpeechCount = speeches.filter(s => !s.isUpcoming).length;
    const upcomingSpeechCount = speeches.filter(s => s.isUpcoming).length;
    console.log('Original regular speeches count:', regularSpeechCount);
    console.log('Original upcoming speeches count:', upcomingSpeechCount);
    
    // Ensure each speech has correct isUpcoming flag
    let allSpeeches = speeches.map(speech => ({
      ...speech,
      isUpcoming: speech.isUpcoming || false // Default to false for regular speeches
    }));
    
    console.log('All speeches after mapping:', allSpeeches.length);
    
    // Get upcoming events from localStorage with user-specific key
    let upcomingEvents: any[] = [];
    try {
      const userId = user?.id;
      if (!userId) {
        console.log('No user ID available, skipping upcoming events');
      } else {
        const storageKey = `upcomingEvents_${userId}`;
        const upcomingEventsJSON = localStorage.getItem(storageKey);
        if (upcomingEventsJSON) {
          upcomingEvents = JSON.parse(upcomingEventsJSON);
          console.log(`Found ${upcomingEvents.length} upcoming events for user ${userId}`);
        } else {
          console.log(`No upcoming events found in localStorage for user ${userId}`);
        }
      }
    } catch (error) {
      console.error('Error parsing upcoming events:', error);
      upcomingEvents = [];
    }
    
    // Create speech objects for upcoming events - ensure speech_type is preserved
    const upcomingSpeeches = upcomingEvents.map((event) => ({
      id: event.id,
      user_id: user?.id || '', 
      title: event.title || 'Untitled Event',
      content: event.notes || '',
      created_at: event.date || '', // Use event date for sorting
      updated_at: event.date || '',
      speech_type: event.category || 'upcoming', // Preserve the original category/speech_type
      isUpcoming: true,
      event_date: event.date
    }));

    console.log(`Found ${upcomingSpeeches.length} upcoming speeches from localStorage`);

    // Combine regular speeches and upcoming speeches
    let combinedSpeeches = [...allSpeeches, ...upcomingSpeeches];
    console.log(`Combined total: ${combinedSpeeches.length} speeches`);
    
    // Debug: Log all speech types to see what we have
    console.log('Speech types in combined list:', 
      combinedSpeeches.map(s => ({ 
        type: s.speech_type, 
        label: getSpeechTypeLabel(s.speech_type),
        isUpcoming: s.isUpcoming, 
        title: s.title 
      }))
    );

    // Apply search filter if provided
    if (searchQuery) {
      const query = searchQuery.toLowerCase().trim();
      combinedSpeeches = combinedSpeeches.filter(speech => 
        speech.title?.toLowerCase().includes(query) || 
        speech.content?.toLowerCase().includes(query)
      );
      console.log(`After search query: ${combinedSpeeches.length} speeches`);
    }
    
    // Apply type filter
    let filtered: Speech[] = [];
    
    // Filter by type - correctly handling all three cases
    if (filterType === 'all') {
      // Show ALL speeches - both saved and upcoming
      filtered = combinedSpeeches;
      console.log('Showing ALL speeches (both saved and upcoming speeches)');
    } else if (filterType === 'upcoming') {
      // Only upcoming speeches
      filtered = combinedSpeeches.filter(speech => speech.isUpcoming === true);
      console.log('Showing ONLY upcoming speeches');
    } else {
      // Only saved speeches of specific type
      filtered = combinedSpeeches.filter(speech => 
        speech.speech_type === filterType && !speech.isUpcoming
      );
      console.log(`Showing ONLY saved speeches of type: ${filterType}`);
    }
    
    // Log filtering results for debugging
    const regularAfterFilter = filtered.filter(s => !s.isUpcoming).length;
    const upcomingAfterFilter = filtered.filter(s => s.isUpcoming).length;
    console.log(`After filtering (${filterType}): ${filtered.length} total speeches`);
    console.log(`- Regular/saved speeches: ${regularAfterFilter}`);
    console.log(`- Upcoming speeches: ${upcomingAfterFilter}`);
    
    // Remove duplicates based on ID
    const uniqueSpeeches = Array.from(
      new Map(filtered.map(speech => [speech.id, speech])).values()
    );
    
    console.log(`After deduplication: ${uniqueSpeeches.length} speeches`);
    
    // Sort speeches
    return uniqueSpeeches.sort((a, b) => {
      if (sortBy === 'newest') {
        if (a.isUpcoming && b.isUpcoming) {
          return new Date(b.event_date || '').getTime() - new Date(a.event_date || '').getTime();
        } else if (a.isUpcoming) {
          return -1; // Upcoming speeches first
        } else if (b.isUpcoming) {
          return 1;
        }
        return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
      } else if (sortBy === 'oldest') {
        if (a.isUpcoming && b.isUpcoming) {
          return new Date(a.event_date || '').getTime() - new Date(b.event_date || '').getTime();
        } else if (a.isUpcoming) {
          return -1; // Upcoming speeches first
        } else if (b.isUpcoming) {
          return 1;
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
