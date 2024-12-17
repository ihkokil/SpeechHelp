
import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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

const SpeechesManager = ({ speeches = [], initialFilter = 'all' }: SpeechesManagerProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  
  // Use a ref to track if we're initializing to prevent infinite loops
  const isInitializing = useRef(true);
  
  // Initialize filter from URL params or initialFilter
  const getInitialFilter = (): FilterOption => {
    const params = new URLSearchParams(location.search);
    const urlFilter = params.get('filter');
    if (urlFilter && ['all', 'completed', 'upcoming', 'draft'].includes(urlFilter)) {
      return urlFilter as FilterOption;
    }
    return initialFilter as FilterOption;
  };
  
  const [filterType, setFilterType] = useState<FilterOption>(getInitialFilter);
  
  const [selectedSpeech, setSelectedSpeech] = useState<Speech | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  
  // Single effect to handle URL synchronization
  useEffect(() => {
    if (isInitializing.current) {
      // On first load, just set the initial state without navigation
      isInitializing.current = false;
      return;
    }
    
    const params = new URLSearchParams(location.search);
    const currentFilter = params.get('filter');
    
    // Only update URL if filter has actually changed and it's not 'all'
    if (filterType !== 'all' && filterType !== currentFilter) {
      params.set('filter', filterType);
      navigate(`${location.pathname}?${params.toString()}`, { replace: true });
    } else if (filterType === 'all' && currentFilter) {
      params.delete('filter');
      const newSearch = params.toString();
      navigate(`${location.pathname}${newSearch ? `?${newSearch}` : ''}`, { replace: true });
    }
  }, [filterType, location.pathname, navigate]);
  
  // Separate effect to handle external filter changes (like from props)
  useEffect(() => {
    if (!isInitializing.current && initialFilter !== filterType) {
      setFilterType(initialFilter as FilterOption);
    }
  }, [initialFilter]);
  
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
