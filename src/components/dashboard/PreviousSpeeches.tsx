
import { useAuth } from '@/contexts/AuthContext';
import { ButtonCustom } from '@/components/ui/button-custom';
import ViewSpeechModal from './speeches/ViewSpeechModal';
import EditSpeechModal from './speeches/EditSpeechModal';
import DeleteSpeechAlert from './speeches/DeleteSpeechAlert';
import SpeechesTable from './speeches/SpeechesTable';
import Translate from '@/components/Translate';
import SpeechesLoader from './speeches/SpeechesLoader';
import { useSpeechOperations } from './speeches/hooks/useSpeechOperations';

const PreviousSpeeches = () => {
  const { speeches, updateSpeech, deleteSpeech, isLoading, fetchSpeeches } = useAuth();
  const {
    selectedSpeech,
    isViewModalOpen,
    setIsViewModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    isDeleteAlertOpen,
    setIsDeleteAlertOpen,
    editTitle,
    setEditTitle,
    editContent,
    setEditContent,
    handleViewSpeech,
    handleEditSpeech,
    handleSaveEdit,
    handleDeleteSpeech,
    confirmDelete,
    handleCreateNewSpeech
  } = useSpeechOperations({ updateSpeech, deleteSpeech });

  const renderSpeechesTable = () => (
    <SpeechesTable 
      speeches={speeches}
      onView={handleViewSpeech}
      onEdit={handleEditSpeech}
      onDelete={handleDeleteSpeech}
    />
  );

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
      
      <SpeechesLoader
        speeches={speeches}
        isLoading={isLoading}
        fetchSpeeches={fetchSpeeches}
        onCreateNewSpeech={handleCreateNewSpeech}
        renderTable={renderSpeechesTable}
      />
      
      {/* Modals */}
      <ViewSpeechModal 
        isOpen={isViewModalOpen}
        onOpenChange={setIsViewModalOpen}
        speech={selectedSpeech}
        onEditClick={(speech) => {
          setIsViewModalOpen(false);
          handleEditSpeech(speech);
        }}
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
