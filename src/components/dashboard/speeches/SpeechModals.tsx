
import { useState } from 'react';
import { Speech } from '@/types/auth';
import ViewSpeechModal from './ViewSpeechModal';
import EditSpeechModal from './EditSpeechModal';
import DeleteSpeechAlert from './DeleteSpeechAlert';

interface SpeechModalsProps {
  selectedSpeech: Speech | null;
  isViewModalOpen: boolean;
  isEditModalOpen: boolean;
  isDeleteAlertOpen: boolean;
  setIsViewModalOpen: (isOpen: boolean) => void;
  setIsEditModalOpen: (isOpen: boolean) => void;
  setIsDeleteAlertOpen: (isOpen: boolean) => void;
  editTitle: string;
  editContent: string;
  setEditTitle: (title: string) => void;
  setEditContent: (content: string) => void;
  onSaveEdit: () => void;
  onConfirmDelete: () => void;
  onEditClick: (speech: Speech) => void;
}

const SpeechModals = ({
  selectedSpeech,
  isViewModalOpen,
  isEditModalOpen,
  isDeleteAlertOpen,
  setIsViewModalOpen,
  setIsEditModalOpen,
  setIsDeleteAlertOpen,
  editTitle,
  editContent,
  setEditTitle,
  setEditContent,
  onSaveEdit,
  onConfirmDelete,
  onEditClick
}: SpeechModalsProps) => {
  return (
    <>
      <ViewSpeechModal 
        isOpen={isViewModalOpen}
        onOpenChange={setIsViewModalOpen}
        speech={selectedSpeech}
        onEditClick={onEditClick}
      />
      
      <EditSpeechModal 
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        speech={selectedSpeech}
        editTitle={editTitle}
        editContent={editContent}
        setEditTitle={setEditTitle}
        setEditContent={setEditContent}
        onSave={onSaveEdit}
      />
      
      <DeleteSpeechAlert 
        isOpen={isDeleteAlertOpen}
        onOpenChange={setIsDeleteAlertOpen}
        speech={selectedSpeech}
        onConfirm={onConfirmDelete}
      />
    </>
  );
};

export default SpeechModals;
