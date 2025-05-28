
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  const navigate = useNavigate();
  const location = useLocation();
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

  // Update URL when filter changes
  useEffect(() => {
    const currentParams = new URLSearchParams(location.search);
    
    if (filterType === 'upcoming') {
      currentParams.set('filter', 'upcoming');
    } else if (filterType === 'all') {
      currentParams.delete('filter');
    } else {
      currentParams.set('filter', filterType);
    }
    
    const newSearch = currentParams.toString();
    const newPath = newSearch ? `${location.pathname}?${newSearch}` : location.pathname;
    
    // Only navigate if the URL actually needs to change
    if (location.pathname + location.search !== newPath) {
      navigate(newPath, { replace: true });
    }
  }, [filterType, navigate, location.pathname, location.search]);
  
  // Debug logging for incoming speeches data
  useEffect(() => {
    console.log('SpeechesManager received speeches array from props:', speeches?.length || 0);
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

  // Update filter type handler to ensure URL updates
  const handleFilterTypeChange = (newFilterType: FilterOption) => {
    console.log('Filter type changing to:', newFilterType);
    setFilterType(newFilterType);
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
        setFilterType={handleFilterTypeChange}
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
