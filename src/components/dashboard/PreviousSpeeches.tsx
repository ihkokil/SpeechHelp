
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Speech } from '@/types/speech';
import { Button } from '@/components/ui/button';
import SpeechesTable from './speeches/SpeechesTable';
import SpeechModals from './speeches/SpeechModals';
import Translate from '@/components/Translate';

const PreviousSpeeches = () => {
  const { speeches } = useAuth();
  const navigate = useNavigate();
  
  const [selectedSpeech, setSelectedSpeech] = useState<Speech | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);

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

  // Filter out upcoming speeches for PreviousSpeeches component
  const regularSpeeches = speeches?.filter(speech => !speech.isUpcoming) || [];

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-4 flex justify-between items-center border-b">
        <h2 className="text-lg font-semibold text-gray-800">
          <Translate text="dashboard.previousSpeeches" />
        </h2>
        <Button 
          onClick={handleCreateNewSpeech}
          className="h-10 px-4 py-2 bg-pink-500 text-white hover:bg-pink-600 transition-colors rounded-md"
        >
          <Translate text="dashboard.createNewSpeech" />
        </Button>
      </div>
      
      {regularSpeeches.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-gray-500 mb-4">
            <Translate text="dashboard.noSpeeches" />
          </p>
          <Button 
            variant="outline"
            onClick={handleCreateNewSpeech} 
            className="h-10 px-6 py-2 border border-pink-500 text-pink-500 hover:bg-pink-50 hover:text-white transition-colors rounded-md"
          >
            <Translate text="dashboard.createFirstSpeech" />
          </Button>
        </div>
      ) : (
        <SpeechesTable 
          speeches={regularSpeeches}
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

export default PreviousSpeeches;
