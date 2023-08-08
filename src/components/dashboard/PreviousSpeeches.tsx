
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Speech } from '@/types/auth';
import { ButtonCustom } from '@/components/ui/button-custom';
import { useNavigate } from 'react-router-dom';
import ViewSpeechModal from './speeches/ViewSpeechModal';
import EditSpeechModal from './speeches/EditSpeechModal';
import DeleteSpeechAlert from './speeches/DeleteSpeechAlert';
import SpeechesTable from './speeches/SpeechesTable';
import Translate from '@/components/Translate';

const PreviousSpeeches = () => {
  const { speeches, updateSpeech, deleteSpeech } = useAuth();
  const [selectedSpeech, setSelectedSpeech] = useState<Speech | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const navigate = useNavigate();

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
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-4 flex justify-between items-center border-b">
        <h2 className="text-lg font-semibold text-gray-800"><Translate text="dashboard.previousSpeeches" /></h2>
        <ButtonCustom 
          variant="pink" 
          size="sm" 
          onClick={handleCreateNewSpeech}
        >
          <Translate text="dashboard.createNewSpeech" />
        </ButtonCustom>
      </div>
      
      {speeches.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-gray-500 mb-4"><Translate text="dashboard.noSpeeches" /></p>
          <ButtonCustom 
            variant="outline" 
            onClick={handleCreateNewSpeech}
          >
            <Translate text="dashboard.createFirstSpeech" />
          </ButtonCustom>
        </div>
      ) : (
        <div className="overflow-auto">
          <SpeechesTable 
            speeches={speeches}
            onView={handleViewSpeech}
            onEdit={handleEditSpeech}
            onDelete={handleDeleteSpeech}
          />
        </div>
      )}
      
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

export default PreviousSpeeches;
