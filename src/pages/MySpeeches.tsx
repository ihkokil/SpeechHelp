
import { useState, useEffect } from 'react';
import { useAuth, Speech } from '@/contexts/AuthContext';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { Input } from '@/components/ui/input';
import { ButtonCustom } from '@/components/ui/button-custom';
import { useNavigate } from 'react-router-dom';
import ViewSpeechModal from '@/components/dashboard/speeches/ViewSpeechModal';
import EditSpeechModal from '@/components/dashboard/speeches/EditSpeechModal';
import DeleteSpeechAlert from '@/components/dashboard/speeches/DeleteSpeechAlert';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SpeechesFilteredTable from '@/components/dashboard/speeches/SpeechesFilteredTable';
import { Search } from 'lucide-react';
import Translate from '@/components/Translate';

const MySpeeches = () => {
  const { speeches, updateSpeech, deleteSpeech, fetchSpeeches } = useAuth();
  const [selectedSpeech, setSelectedSpeech] = useState<Speech | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const navigate = useNavigate();
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  
  // Fetch speeches when component mounts
  useEffect(() => {
    fetchSpeeches();
  }, [fetchSpeeches]);
  
  // Filter speeches based on search query and filters
  const filteredSpeeches = speeches.filter((speech) => {
    // Search by title
    const matchesSearch = speech.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by speech type
    const matchesType = typeFilter === 'all' || speech.speech_type === typeFilter;
    
    // Filter by date
    const matchesDate = dateFilter === 'all' || (() => {
      const speechDate = new Date(speech.created_at);
      const now = new Date();
      
      switch(dateFilter) {
        case 'today':
          return (
            speechDate.getDate() === now.getDate() &&
            speechDate.getMonth() === now.getMonth() &&
            speechDate.getFullYear() === now.getFullYear()
          );
        case 'week':
          const weekAgo = new Date();
          weekAgo.setDate(now.getDate() - 7);
          return speechDate >= weekAgo;
        case 'month':
          const monthAgo = new Date();
          monthAgo.setMonth(now.getMonth() - 1);
          return speechDate >= monthAgo;
        default:
          return true;
      }
    })();
    
    return matchesSearch && matchesType && matchesDate;
  });
  
  // Get unique speech types for filter dropdown
  const speechTypes = ['all', ...Array.from(new Set(speeches.map(speech => speech.speech_type)))];
  
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
  
  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                <Translate text="dashboard.previousSpeeches" />
              </h1>
              <ButtonCustom
                variant="pink"
                onClick={handleCreateNewSpeech}
              >
                <Translate text="dashboard.createNewSpeech" />
              </ButtonCustom>
            </div>
            
            {/* Search and filters */}
            <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <Input
                    placeholder="Search by title..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select
                  value={typeFilter}
                  onValueChange={(value) => setTypeFilter(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Speech Types</SelectItem>
                    {speechTypes.filter(type => type !== 'all').map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)} Speech
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select
                  value={dateFilter}
                  onValueChange={(value) => setDateFilter(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">Last 7 Days</SelectItem>
                    <SelectItem value="month">Last 30 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Speeches table */}
            <div className="bg-white rounded-lg shadow-sm border">
              {filteredSpeeches.length === 0 ? (
                <div className="p-8 text-center">
                  {searchQuery || typeFilter !== 'all' || dateFilter !== 'all' ? (
                    <p className="text-gray-500 mb-4">
                      <Translate text="dashboard.noMatchingSpeeches" />
                    </p>
                  ) : (
                    <>
                      <p className="text-gray-500 mb-4">
                        <Translate text="dashboard.noSpeeches" />
                      </p>
                      <ButtonCustom
                        variant="outline"
                        onClick={handleCreateNewSpeech}
                      >
                        <Translate text="dashboard.createFirstSpeech" />
                      </ButtonCustom>
                    </>
                  )}
                </div>
              ) : (
                <SpeechesFilteredTable
                  speeches={filteredSpeeches}
                  onView={handleViewSpeech}
                  onEdit={handleEditSpeech}
                  onDelete={handleDeleteSpeech}
                />
              )}
            </div>
          </div>
        </main>
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
