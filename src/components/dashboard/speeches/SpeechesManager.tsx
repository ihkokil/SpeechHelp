
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Speech } from '@/types/auth';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import SpeechesTable from './SpeechesTable';
import FilterBar, { FilterOption, SortOption } from './FilterBar';
import EmptyState from './EmptyState';
import SpeechModals from './SpeechModals';
import { useSpeechesFilter } from './useSpeechesFilter';
import Translate from '@/components/Translate';

interface SpeechesManagerProps {
  speeches: Speech[];
}

const SpeechesManager = ({ speeches }: SpeechesManagerProps) => {
  const { updateSpeech, deleteSpeech } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [filterType, setFilterType] = useState<FilterOption>('all');
  const [selectedSpeech, setSelectedSpeech] = useState<Speech | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  // Use our custom hook for filtering and sorting speeches
  const filteredSpeeches = useSpeechesFilter(speeches, searchQuery, filterType, sortBy);

  const handleViewSpeech = (speech: Speech) => {
    setSelectedSpeech(speech);
    setIsViewModalOpen(true);
  };

  const handleEditSpeech = (speech: Speech) => {
    setSelectedSpeech(speech);
    setEditTitle(speech.title);
    setEditContent(speech.content);
    setIsEditModalOpen(true);
  };

  const handleDeleteSpeech = (speech: Speech) => {
    setSelectedSpeech(speech);
    setIsDeleteAlertOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedSpeech) return;
    
    try {
      await updateSpeech(selectedSpeech.id, editTitle, editContent);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error updating speech:', error);
    }
  };

  const confirmDelete = async () => {
    if (!selectedSpeech) return;
    
    try {
      await deleteSpeech(selectedSpeech.id);
      setIsDeleteAlertOpen(false);
    } catch (error) {
      console.error('Error deleting speech:', error);
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setFilterType('all');
  };

  const hasFilters = searchQuery !== '' || filterType !== 'all';

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-purple-600">Speech Library</CardTitle>
          <CardDescription>
            <Translate text="dashboard.manageSpeeches" fallback="Search, filter, and manage your speeches" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filter and sort controls */}
          <FilterBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filterType={filterType}
            setFilterType={setFilterType}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
          
          <div className="text-sm text-gray-500 mb-4">
            <Translate 
              text="dashboard.speechesFound" 
              fallback="Found" 
            />: {filteredSpeeches.length}
          </div>
          
          {filteredSpeeches.length > 0 ? (
            <SpeechesTable 
              speeches={filteredSpeeches}
              onView={handleViewSpeech}
              onEdit={handleEditSpeech}
              onDelete={handleDeleteSpeech}
            />
          ) : (
            <EmptyState 
              onClearFilters={clearFilters}
              hasFilters={hasFilters}
            />
          )}
        </CardContent>
      </Card>
      
      {/* Modals for viewing, editing, and deleting speeches */}
      <SpeechModals
        selectedSpeech={selectedSpeech}
        isViewModalOpen={isViewModalOpen}
        isEditModalOpen={isEditModalOpen}
        isDeleteAlertOpen={isDeleteAlertOpen}
        setIsViewModalOpen={setIsViewModalOpen}
        setIsEditModalOpen={setIsEditModalOpen}
        setIsDeleteAlertOpen={setIsDeleteAlertOpen}
        editTitle={editTitle}
        editContent={editContent}
        setEditTitle={setEditTitle}
        setEditContent={setEditContent}
        onSaveEdit={handleSaveEdit}
        onConfirmDelete={confirmDelete}
        onEditClick={handleEditSpeech}
      />
    </div>
  );
};

export default SpeechesManager;
