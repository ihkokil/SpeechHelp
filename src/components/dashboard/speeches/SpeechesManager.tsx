import { useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Speech } from '@/types/auth';
import { ButtonCustom } from '@/components/ui/button-custom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { SearchIcon, FilterIcon } from 'lucide-react';
import { format } from 'date-fns';
import SpeechesTable from './SpeechesTable';
import ViewSpeechModal from './ViewSpeechModal';
import EditSpeechModal from './EditSpeechModal';
import DeleteSpeechAlert from './DeleteSpeechAlert';

type SortOption = 'newest' | 'oldest' | 'title';
type FilterOption = 'all' | 'wedding' | 'business' | 'eulogy' | 'graduation' | 'other';

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

  const filteredSpeeches = useMemo(() => {
    let result = [...speeches];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(speech => 
        speech.title.toLowerCase().includes(query)
      );
    }
    
    if (filterType !== 'all') {
      result = result.filter(speech => speech.speech_type === filterType);
    }
    
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-purple-600">Speech Library</CardTitle>
          <CardDescription>
            Search, filter, and manage your speeches
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <Label htmlFor="search-speeches" className="mb-1 block text-sm">Search Speeches</Label>
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  id="search-speeches"
                  placeholder="Search speeches..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="filter-type" className="mb-1 block text-sm">Filter by Type</Label>
              <Select
                value={filterType}
                onValueChange={(value) => setFilterType(value as FilterOption)}
              >
                <SelectTrigger id="filter-type">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="wedding">Wedding</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="eulogy">Eulogy</SelectItem>
                  <SelectItem value="graduation">Graduation</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="sort-by" className="mb-1 block text-sm">Sort By</Label>
              <Select
                value={sortBy}
                onValueChange={(value) => setSortBy(value as SortOption)}
              >
                <SelectTrigger id="sort-by">
                  <SelectValue placeholder="Newest First" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="title">Title A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="text-sm text-gray-500 mb-4">
            Found {filteredSpeeches.length} speeches
          </div>
          
          {filteredSpeeches.length > 0 ? (
            <SpeechesTable 
              speeches={filteredSpeeches}
              onView={handleViewSpeech}
              onEdit={handleEditSpeech}
              onDelete={handleDeleteSpeech}
            />
          ) : (
            <div className="text-center py-12 border rounded-md bg-gray-50">
              <p className="text-gray-500 mb-2">No speeches found</p>
              <p className="text-gray-400 text-sm mb-4">Try adjusting your search or filters</p>
              <ButtonCustom 
                variant="outline" 
                onClick={() => {
                  setSearchQuery('');
                  setFilterType('all');
                }}
              >
                Clear Filters
              </ButtonCustom>
            </div>
          )}
        </CardContent>
      </Card>
      
      <ViewSpeechModal 
        isOpen={isViewModalOpen}
        onOpenChange={setIsViewModalOpen}
        speech={selectedSpeech}
        onEditClick={handleEditSpeech}
      />
      
      <EditSpeechModal 
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        speech={selectedSpeech}
        editTitle={editTitle}
        editContent={editContent}
        setEditTitle={setEditTitle}
        setEditContent={setEditContent}
        onSave={handleSaveEdit}
      />
      
      <DeleteSpeechAlert 
        isOpen={isDeleteAlertOpen}
        onOpenChange={setIsDeleteAlertOpen}
        speech={selectedSpeech}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default SpeechesManager;
