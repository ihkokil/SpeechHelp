
import { useState } from 'react';
import { useAuth, Speech } from '@/contexts/AuthContext';
import { ButtonCustom } from '@/components/ui/button-custom';
import { useNavigate } from 'react-router-dom';
import ViewSpeechModal from './speeches/ViewSpeechModal';
import EditSpeechModal from './speeches/EditSpeechModal';
import DeleteSpeechAlert from './speeches/DeleteSpeechAlert';
import SpeechesTable from './speeches/SpeechesTable';
import Translate from '@/components/Translate';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const PreviousSpeeches = () => {
  const { speeches, fetchSpeeches, user } = useAuth();
  const [selectedSpeech, setSelectedSpeech] = useState<Speech | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

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
    if (!selectedSpeech || !user) return;
    
    try {
      const { error } = await supabase
        .from('speeches')
        .update({
          title: editTitle,
          content: editContent,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedSpeech.id)
        .eq('user_id', user.id);
      
      if (error) {
        console.error('Error updating speech:', error);
        toast({
          title: "Error updating speech",
          description: error.message,
          variant: "destructive"
        });
        throw error;
      }
      
      toast({
        title: "Speech updated",
        description: "Your speech has been updated successfully.",
      });
      
      await fetchSpeeches();
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error in handleSaveEdit:', error);
    }
  };

  const handleDeleteSpeech = (speech: Speech) => {
    setSelectedSpeech(speech);
    setIsDeleteAlertOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedSpeech) return;
    
    try {
      const { error } = await supabase
        .from('speeches')
        .delete()
        .eq('id', selectedSpeech.id)
        .eq('user_id', user?.id || '');
      
      if (error) {
        console.error('Error deleting speech:', error);
        toast({
          title: "Error deleting speech",
          description: error.message,
          variant: "destructive"
        });
        throw error;
      }
      
      toast({
        title: "Speech deleted",
        description: "Your speech has been deleted successfully.",
      });
      
      await fetchSpeeches();
      setIsDeleteAlertOpen(false);
    } catch (error) {
      console.error('Error in confirmDelete:', error);
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
        <SpeechesTable 
          speeches={speeches}
          onView={handleViewSpeech}
          onEdit={handleEditSpeech}
          onDelete={handleDeleteSpeech}
        />
      )}
      
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
