
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, Speech } from '@/contexts/AuthContext';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SearchIcon, FileTextIcon, EyeIcon, EditIcon, Trash2Icon } from 'lucide-react';
import ViewSpeechModal from '@/components/dashboard/speeches/ViewSpeechModal';
import EditSpeechModal from '@/components/dashboard/speeches/EditSpeechModal';
import DeleteSpeechAlert from '@/components/dashboard/speeches/DeleteSpeechAlert';
import SpeechesTable from '@/components/dashboard/speeches/SpeechesTable';
import { getSpeechTypeLabel } from '@/components/dashboard/speeches/speech-utils';
import Translate from '@/components/Translate';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/translations';

const MySpeeches = () => {
  const { user, isLoading, speeches, fetchSpeeches, updateSpeech, deleteSpeech } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [filteredSpeeches, setFilteredSpeeches] = useState<Speech[]>([]);
  const [selectedSpeech, setSelectedSpeech] = useState<Speech | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth');
    }
  }, [user, isLoading, navigate]);
  
  // Fetch speeches when component mounts
  useEffect(() => {
    if (user) {
      fetchSpeeches();
    }
  }, [user, fetchSpeeches]);
  
  // Filter and sort speeches based on user selections
  useEffect(() => {
    let result = [...speeches];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(speech => 
        speech.title.toLowerCase().includes(query)
      );
    }
    
    // Apply type filter
    if (typeFilter !== 'all') {
      result = result.filter(speech => speech.speech_type === typeFilter);
    }
    
    // Apply sorting
    if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else if (sortBy === 'oldest') {
      result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    } else if (sortBy === 'title-asc') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'title-desc') {
      result.sort((a, b) => b.title.localeCompare(a.title));
    } else if (sortBy === 'updated') {
      result.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
    }
    
    setFilteredSpeeches(result);
  }, [speeches, searchQuery, typeFilter, sortBy]);
  
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
  
  const handleSaveEdit = async () => {
    if (!selectedSpeech) return;
    
    try {
      await updateSpeech(selectedSpeech.id, editTitle, editContent);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error updating speech:', error);
    }
  };
  
  const handleDeleteSpeech = (speech: Speech) => {
    setSelectedSpeech(speech);
    setIsDeleteAlertOpen(true);
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
  
  const handleCreateNewSpeech = () => {
    navigate('/speech-lab');
  };
  
  // Get unique speech types for filter dropdown
  const speechTypes = ['all', ...new Set(speeches.map(speech => speech.speech_type))];
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-600 to-purple-600">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
          <p className="mt-4 text-white text-lg font-medium">{t('loading', currentLanguage.code)}...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <DashboardSidebar />
      
      {/* Main Content */}
      <div className="flex-1 bg-gray-50 overflow-auto p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
              <Translate text="dashboard.mySpeeches" />
            </h1>
            <Button 
              onClick={handleCreateNewSpeech}
              className="bg-pink-600 hover:bg-pink-700"
            >
              <Translate text="dashboard.createNewSpeech" />
            </Button>
          </div>
          
          {/* Filters */}
          <div className="bg-white p-4 rounded-lg shadow-sm mb-6 border">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder={t('common.search', currentLanguage.code)}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              {/* Type Filter */}
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t('common.filterByType', currentLanguage.code)} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('common.allTypes', currentLanguage.code)}</SelectItem>
                  {speechTypes.filter(type => type !== 'all').map((type) => (
                    <SelectItem key={type} value={type}>
                      {getSpeechTypeLabel(type)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {/* Sort By */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t('common.sortBy', currentLanguage.code)} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">{t('common.newest', currentLanguage.code)}</SelectItem>
                  <SelectItem value="oldest">{t('common.oldest', currentLanguage.code)}</SelectItem>
                  <SelectItem value="title-asc">{t('common.titleAZ', currentLanguage.code)}</SelectItem>
                  <SelectItem value="title-desc">{t('common.titleZA', currentLanguage.code)}</SelectItem>
                  <SelectItem value="updated">{t('common.recentlyUpdated', currentLanguage.code)}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Speeches Table */}
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            {filteredSpeeches.length === 0 ? (
              <div className="p-8 text-center">
                {speeches.length === 0 ? (
                  <>
                    <FileTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      <Translate text="dashboard.noSpeeches" />
                    </h3>
                    <p className="text-gray-500 mb-4">
                      <Translate text="dashboard.createFirstSpeechDesc" />
                    </p>
                    <Button 
                      onClick={handleCreateNewSpeech}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <Translate text="dashboard.createFirstSpeech" />
                    </Button>
                  </>
                ) : (
                  <>
                    <SearchIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      <Translate text="dashboard.noSpeechesFound" />
                    </h3>
                    <p className="text-gray-500">
                      <Translate text="dashboard.tryDifferentFilters" />
                    </p>
                  </>
                )}
              </div>
            ) : (
              <SpeechesTable 
                speeches={filteredSpeeches}
                onView={handleViewSpeech}
                onEdit={handleEditSpeech}
                onDelete={handleDeleteSpeech}
              />
            )}
          </div>
        </div>
      </div>
      
      {/* Modals */}
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

export default MySpeeches;
