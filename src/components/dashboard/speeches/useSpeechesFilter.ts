
import { useMemo } from 'react';
import { Speech } from '@/types/speech';
import { FilterOption, SortOption } from './FilterBar';
import { useUpcomingEventsFilter } from './hooks/useUpcomingEventsFilter';

export const useSpeechesFilter = (
  speeches: Speech[],
  searchQuery: string,
  filterType: FilterOption,
  sortBy: SortOption
) => {
  const { upcomingSpeeches } = useUpcomingEventsFilter();
  
  const filteredSpeeches = useMemo(() => {
    // Combine regular speeches with upcoming speeches
    const allSpeeches = [...speeches, ...upcomingSpeeches];
    
    // Apply search filter
    let filtered = allSpeeches;
    if (searchQuery) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(speech => 
        speech.title?.toLowerCase().includes(query) || 
        speech.content?.toLowerCase().includes(query)
      );
    }
    
    // Apply type filter
    if (filterType === 'all') {
      // Show all speeches
    } else if (filterType === 'upcoming') {
      filtered = filtered.filter(speech => speech.isUpcoming === true);
    } else {
      filtered = filtered.filter(speech => 
        speech.speech_type === filterType && !speech.isUpcoming
      );
    }
    
    // Remove duplicates based on ID
    const uniqueSpeeches = Array.from(
      new Map(filtered.map(speech => [speech.id, speech])).values()
    );
    
    // Sort speeches
    return uniqueSpeeches.sort((a, b) => {
      if (sortBy === 'newest') {
        if (a.isUpcoming && b.isUpcoming) {
          return new Date(b.event_date || '').getTime() - new Date(a.event_date || '').getTime();
        } else if (a.isUpcoming) {
          return -1;
        } else if (b.isUpcoming) {
          return 1;
        }
        return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
      } else if (sortBy === 'oldest') {
        if (a.isUpcoming && b.isUpcoming) {
          return new Date(a.event_date || '').getTime() - new Date(b.event_date || '').getTime();
        } else if (a.isUpcoming) {
          return -1;
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
  }, [speeches, upcomingSpeeches, searchQuery, filterType, sortBy]);
  
  return { filteredSpeeches };
};
