
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
  const isInitialMount = useRef(true);
  
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
      setFilterType(initialFilter as FilterOption);
    }
  }, [initialFilter]);
  
  // Update URL when filter changes from user interaction (not from URL parsing)
  useEffect(() => {
    // Skip URL updates on initial mount or when filter comes from URL
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const params = new URLSearchParams(location.search);
    const currentFilter = params.get('filter');
    
    // Only update URL if filter actually changed and wasn't set from URL
    if (filterType !== 'all' && filterType !== currentFilter) {
      params.set('filter', filterType);
      navigate(`${location.pathname}?${params.toString()}`, { replace: true });
    } else if (filterType === 'all' && currentFilter) {
      params.delete('filter');
      const newSearch = params.toString();
      navigate(`${location.pathname}${newSearch ? `?${newSearch}` : ''}`, { replace: true });
    }
  }, [filterType, navigate, location.pathname]);
  
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
