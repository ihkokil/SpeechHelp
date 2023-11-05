
import { useState, useEffect, useMemo } from 'react';
import { Speech } from '@/types/auth';
import { FilterOption, SortOption } from './FilterBar';

export const useSpeechesFilter = (
  speeches: Speech[], 
  searchQuery: string, 
  filterType: FilterOption,
  sortBy: SortOption
) => {
  const filteredSpeeches = useMemo(() => {
    // First filter by type if not "all"
    let filtered = speeches;
    if (filterType !== 'all') {
      filtered = filtered.filter(speech => speech.speech_type === filterType);
    }
    
    // Then filter by search query if provided
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(speech => 
        speech.title.toLowerCase().includes(query) || 
        speech.content.toLowerCase().includes(query)
      );
    }
    
    // Finally sort according to selection
    return [...filtered].sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else if (sortBy === 'oldest') {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      } else if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  }, [speeches, searchQuery, filterType, sortBy]);
  
  return { filteredSpeeches };
};
