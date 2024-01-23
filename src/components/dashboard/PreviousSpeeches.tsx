
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Speech } from '@/types/speech';
import { ButtonCustom } from '@/components/ui/button-custom';
import { useNavigate } from 'react-router-dom';
import SpeechesTable from './speeches/SpeechesTable';
import SpeechModals from './speeches/SpeechModals';
import Translate from '@/components/Translate';

const PreviousSpeeches = () => {
  const { speeches } = useAuth();
  const [selectedSpeech, setSelectedSpeech] = useState<Speech | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const navigate = useNavigate();

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
        <SpeechesTable 
          speeches={speeches}
          onView={handleViewSpeech}
          onEdit={handleEditSpeech}
          onDelete={handleDeleteSpeech}
        />
      )}
      
      {/* Modals */}
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

export default PreviousSpeeches;
