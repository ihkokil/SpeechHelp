
import { useState, useEffect } from 'react';
import { useAuth, Speech } from '@/contexts/AuthContext';
import { ButtonCustom } from '@/components/ui/button-custom';
import { useNavigate } from 'react-router-dom';
import ViewSpeechModal from './speeches/ViewSpeechModal';
import EditSpeechModal from './speeches/EditSpeechModal';
import DeleteSpeechAlert from './speeches/DeleteSpeechAlert';
import SpeechesTable from './speeches/SpeechesTable';
import Translate from '@/components/Translate';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

const PreviousSpeeches = () => {
  const { speeches, updateSpeech, deleteSpeech, isLoading, fetchSpeeches } = useAuth();
  const [selectedSpeech, setSelectedSpeech] = useState<Speech | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [componentLoaded, setComponentLoaded] = useState(false);
  const [isLoadingSpeeches, setIsLoadingSpeeches] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Make sure speeches are loaded when component mounts
  useEffect(() => {
    let isMounted = true;
    
    const loadSpeeches = async () => {
      if (!componentLoaded && isMounted) {
        console.log("PreviousSpeeches component mounted, fetching speeches");
        setIsLoadingSpeeches(true);
        
        try {
          await fetchSpeeches();
        } catch (error) {
          console.error("Error fetching speeches in PreviousSpeeches:", error);
          if (isMounted) {
            toast({
              title: "Error loading speeches",
              description: "We couldn't load your speeches. Please try again.",
              variant: "destructive"
            });
          }
        } finally {
          if (isMounted) {
            setIsLoadingSpeeches(false);
            setComponentLoaded(true);
          }
        }
      }
    };
    
    // Only try to fetch if we have a user and aren't already loading
    if (!isLoading) {
      loadSpeeches();
    }
    
    return () => {
      isMounted = false;
    };
  }, [fetchSpeeches, componentLoaded, isLoading, toast]);

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
      toast({
        title: "Speech updated",
        description: "Your speech has been successfully updated.",
      });
    } catch (error) {
      console.error('Error updating speech:', error);
      toast({
        title: "Update failed",
        description: "We couldn't update your speech. Please try again.",
        variant: "destructive"
      });
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
      toast({
        title: "Speech deleted",
        description: "Your speech has been successfully deleted.",
      });
    } catch (error) {
      console.error('Error deleting speech:', error);
      toast({
        title: "Delete failed",
        description: "We couldn't delete your speech. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleCreateNewSpeech = () => {
    navigate('/speech-lab');
  };

  const renderContent = () => {
    if (isLoading || isLoadingSpeeches) {
      return (
        <div className="p-4">
          <Skeleton className="h-12 w-full mb-4" />
          <Skeleton className="h-12 w-full mb-4" />
          <Skeleton className="h-12 w-full mb-4" />
        </div>
      );
    }

    if (!speeches || speeches.length === 0) {
      return (
        <div className="p-8 text-center">
          <p className="text-gray-500 mb-4"><Translate text="dashboard.noSpeeches" /></p>
          <ButtonCustom 
            variant="outline" 
            onClick={handleCreateNewSpeech}
          >
            <Translate text="dashboard.createFirstSpeech" />
          </ButtonCustom>
        </div>
      );
    }

    return (
      <SpeechesTable 
        speeches={speeches}
        onView={handleViewSpeech}
        onEdit={handleEditSpeech}
        onDelete={handleDeleteSpeech}
      />
    );
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
      
      {renderContent()}
      
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
