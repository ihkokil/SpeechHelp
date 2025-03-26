
import { useMemo } from 'react';
import { Speech } from '@/types/auth';
import { FilterOption, SortOption } from './FilterBar';

export const useSpeechesFilter = (
  speeches: Speech[],
  searchQuery: string,
  filterType: FilterOption,
  sortBy: SortOption
) => {
  const filteredSpeeches = useMemo(() => {
    let result = [...speeches];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(speech => 
        speech.title.toLowerCase().includes(query)
      );
    }
    
    // Apply type filter
    if (filterType !== 'all') {
      result = result.filter(speech => speech.speech_type === filterType);
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'newest':
        return result.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      case 'oldest':
        return result.sort((a, b) => 
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      case 'title':
        return result.sort((a, b) => 
          a.title.localeCompare(b.title)
        );
      default:
        return result;
    }
  }, [speeches, searchQuery, sortBy, filterType]);

  return filteredSpeeches;
};
