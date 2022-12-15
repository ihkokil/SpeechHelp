
import { useState } from 'react';
import { Speech } from '@/types/auth';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

type SpeechOperationsProps = {
  updateSpeech: (id: string, title: string, content: string) => Promise<void>;
  deleteSpeech: (id: string) => Promise<void>;
};

export const useSpeechOperations = ({ updateSpeech, deleteSpeech }: SpeechOperationsProps) => {
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

  return {
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
  };
};
