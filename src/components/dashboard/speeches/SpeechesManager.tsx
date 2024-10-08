
import { useState, useEffect } from 'react';
import { Speech } from '@/types/speech';
import FilterBar from './FilterBar';
import SpeechesTable from './SpeechesTable';
import EmptyState from './EmptyState';
import SpeechModals from './SpeechModals';
import { useSpeechesFilter } from './useSpeechesFilter';
import { FilterOption, SortOption } from './FilterBar';

interface SpeechesManagerProps {
  speeches: Speech[];
  initialFilter?: string;
}

const SpeechesManager = ({ speeches, initialFilter = 'all' }: SpeechesManagerProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<FilterOption>(initialFilter as FilterOption);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  
  const [selectedSpeech, setSelectedSpeech] = useState<Speech | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  
  // Apply initial filter when component mounts or initialFilter changes
  useEffect(() => {
    if (initialFilter) {
      console.log('Setting initial filter to:', initialFilter);
      setFilterType(initialFilter as FilterOption);
    }
  }, [initialFilter]);
  
  // Explicitly check speeches passed to component
  useEffect(() => {
    console.log('SpeechesManager received speeches array:', speeches.length);
    const savedSpeeches = speeches.filter(s => !s.isUpcoming).length;
    const upcomingSpeeches = speeches.filter(s => s.isUpcoming).length;
    console.log(`SpeechesManager input breakdown: ${savedSpeeches} saved, ${upcomingSpeeches} upcoming`);
    
    // Deep inspect each speech to diagnose issues
    speeches.forEach((speech, index) => {
      console.log(`Speech ${index}:`, {
        id: speech.id,
        title: speech.title,
        type: speech.speech_type,
        isUpcoming: speech.isUpcoming || false,
        created: speech.created_at
      });
    });
    
    // Deep inspect the speech types in incoming speeches
    const speechTypeBreakdown = speeches.reduce((acc, speech) => {
      const type = speech.speech_type || 'unknown';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    console.log('Speech types in incoming speeches:', speechTypeBreakdown);
  }, [speeches]);
  
  const { filteredSpeeches } = useSpeechesFilter(speeches, searchQuery, filterType, sortBy);
  
  const handleViewSpeech = (speech: Speech) => {
    setSelectedSpeech(speech);
    setIsViewModalOpen(true);
  };

  const handleEditSpeech = (speech: Speech) => {
    setSelectedSpeech(speech);
    setIsEditModalOpen(true);
  };

  const handleDeleteSpeech = (speech: Speech) => {
    setSelectedSpeech(speech);
    setIsDeleteAlertOpen(true);
  };

  // Enhanced debug logging
  useEffect(() => {
    console.log(`SpeechesManager - Current filter: ${filterType}`);
    console.log(`SpeechesManager - Displaying ${filteredSpeeches.length} speeches after filtering`);
    
    // Log number of upcoming and regular speeches
    const upcomingCount = filteredSpeeches.filter(speech => speech.isUpcoming).length;
    const regularCount = filteredSpeeches.filter(speech => !speech.isUpcoming).length;
    console.log(`SpeechesManager - Breakdown: ${upcomingCount} upcoming, ${regularCount} saved speeches`);
    
    // Log detailed speech list after filtering
    console.log('Speeches after filtering:', 
      filteredSpeeches.map(s => ({
        id: s.id,
        title: s.title,
        type: s.speech_type,
        isUpcoming: s.isUpcoming
      }))
    );
  }, [filterType, filteredSpeeches]);
  
  return (
    <div>
      <FilterBar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterType={filterType}
        setFilterType={setFilterType}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />
      
      {filteredSpeeches.length === 0 ? (
        <EmptyState searchQuery={searchQuery} filterType={filterType} />
      ) : (
        <SpeechesTable 
          speeches={filteredSpeeches}
          onView={handleViewSpeech}
          onEdit={handleEditSpeech}
          onDelete={handleDeleteSpeech}
        />
      )}
      
      <SpeechModals 
        selectedSpeech={selectedSpeech}
        isViewModalOpen={isViewModalOpen}
        setIsViewModalOpen={setIsViewModalOpen}
        isEditModalOpen={isEditModalOpen}
        setIsEditModalOpen={setIsEditModalOpen}
        isDeleteAlertOpen={isDeleteAlertOpen}
        setIsDeleteAlertOpen={setIsDeleteAlertOpen}
        onEditClick={handleEditSpeech}
      />
    </div>
  );
};

export default SpeechesManager;
