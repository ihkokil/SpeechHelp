
import { useState, useEffect } from 'react';
import { Speech } from '@/types/speech';
import FilterBar from './FilterBar';
import SpeechesTable from './SpeechesTable';
import EmptyState from './EmptyState';
import SpeechModals from './SpeechModals';
import { useSpeechesFilter } from './useSpeechesFilter';
import { FilterOption, SortOption } from './FilterBar';
import { getSpeechTypeLabel } from './speech-utils';

interface SpeechesManagerProps {
  speeches: Speech[];
  initialFilter?: string;
}

const SpeechesManager = ({ speeches = [], initialFilter = 'all' }: SpeechesManagerProps) => {
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
  
  // Debug logging for incoming speeches data
  useEffect(() => {
    console.log('SpeechesManager received speeches array:', speeches?.length || 0);
    const speechesArray = speeches || [];
    const savedSpeeches = speechesArray.filter(s => !s.isUpcoming).length;
    const upcomingSpeeches = speechesArray.filter(s => s.isUpcoming).length;
    console.log(`SpeechesManager input breakdown: ${savedSpeeches} saved, ${upcomingSpeeches} upcoming`);
    
    // Log speech types with proper labels
    const speechTypes = speechesArray.map(speech => ({
      type: speech.speech_type,
      label: getSpeechTypeLabel(speech.speech_type),
      isUpcoming: speech.isUpcoming
    }));
    console.log('Speech types with labels:', speechTypes);
  }, [speeches]);
  
  const { filteredSpeeches } = useSpeechesFilter(speeches || [], searchQuery, filterType, sortBy);
  
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

  // Enhanced debug logging for filtered results
  useEffect(() => {
    console.log(`SpeechesManager - Current filter: ${filterType}`);
    console.log(`SpeechesManager - Displaying ${filteredSpeeches.length} speeches after filtering`);
    
    // Log number of upcoming and regular speeches
    const upcomingCount = filteredSpeeches.filter(speech => speech.isUpcoming).length;
    const regularCount = filteredSpeeches.filter(speech => !speech.isUpcoming).length;
    console.log(`SpeechesManager - Breakdown after filtering: ${upcomingCount} upcoming, ${regularCount} saved speeches`);
    
    // Log speech types with their display labels
    const typesWithLabels = filteredSpeeches.map(speech => ({
      type: speech.speech_type,
      label: getSpeechTypeLabel(speech.speech_type),
      isUpcoming: speech.isUpcoming,
      title: speech.title
    }));
    console.log('Filtered speeches with proper labels:', typesWithLabels);
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
