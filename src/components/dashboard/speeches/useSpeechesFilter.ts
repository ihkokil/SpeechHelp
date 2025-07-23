
import { useMemo } from 'react';
import { Speech } from '@/types/speech';

export type FilterOption = 'all' | 'upcoming' | 'wedding' | 'business' | 'birthday' | 'graduation' | 'funeral' | 'motivational' | 'informative' | 'entertaining' | 'persuasive' | 'introduction' | 'farewell' | 'award' | 'retirement' | 'keynote' | 'tedtalk' | 'social' | 'other';
export type SortOption = 'newest' | 'oldest' | 'alphabetical';

export const useSpeechesFilter = (
  speeches: Speech[], 
  searchQuery: string, 
  filterType: FilterOption, 
  sortBy: SortOption
) => {
  const filteredSpeeches = useMemo(() => {
    if (!speeches) return [];
    
    let filtered = [...speeches];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(speech =>
        speech.title.toLowerCase().includes(query) ||
        speech.speech_type.toLowerCase().includes(query)
      );
    }

    // Apply type filter - ensure clean separation between upcoming and regular speeches
    if (filterType === 'upcoming') {
      filtered = filtered.filter(speech => speech.isUpcoming === true);
    } else if (filterType === 'all') {
      // For 'all', exclude upcoming speeches to avoid duplicates
      filtered = filtered.filter(speech => !speech.isUpcoming);
    } else {
      // For specific speech types, only show regular speeches (not upcoming)
      filtered = filtered.filter(speech => 
        !speech.isUpcoming && speech.speech_type === filterType
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'oldest':
        filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      case 'alphabetical':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
    }

    console.log('useSpeechesFilter - applied filters:', {
      searchQuery,
      filterType,
      sortBy,
      originalCount: speeches.length,
      filteredCount: filtered.length
    });

    return filtered;
  }, [speeches, searchQuery, filterType, sortBy]);

  return { filteredSpeeches };
};
