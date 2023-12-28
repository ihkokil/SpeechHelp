
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Speech } from '@/types/auth';
import { ButtonCustom } from '@/components/ui/button-custom';
import Translate from '@/components/Translate';
import EditSpeechForm from '../components/EditSpeechForm';
import { useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface EditSpeechModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  speech: Speech;
  editTitle: string;
  editContent: string;
  setEditTitle: (title: string) => void;
  setEditContent: (content: string) => void;
  onSave: () => void;
}

const EditSpeechModal = ({ 
  isOpen, 
  onOpenChange, 
  speech, 
  editTitle, 
  editContent, 
  setEditTitle, 
  setEditContent, 
  onSave 
}: EditSpeechModalProps) => {
  const isMobile = useIsMobile();
  
  // Debug log when the modal opens/closes or speech changes
  useEffect(() => {
    if (isOpen && speech) {
      console.log('EditSpeechModal opened for speech:', {
        id: speech.id,
        title: speech.title,
        contentPreview: speech.content.substring(0, 50) + '...',
        editTitle,
        editContentPreview: editContent ? editContent.substring(0, 50) + '...' : 'empty'
      });
    }
  }, [isOpen, speech, editTitle, editContent]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className={`${isMobile ? 'w-[95%]' : 'max-w-3xl'} max-h-[90vh] overflow-auto p-4 sm:p-6`}>
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-xl sm:text-2xl"><Translate text="dashboard.editSpeech" /></DialogTitle>
          <DialogDescription className="text-sm">
            <Translate text="dashboard.editSpeechDesc" />
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4">
          <EditSpeechForm
            speech={speech}
            editTitle={editTitle}
            editContent={editContent}
            setEditTitle={setEditTitle}
            setEditContent={setEditContent}
          />
        </div>
        
        <DialogFooter className={`mt-6 ${isMobile ? 'flex-col space-y-2' : 'flex-row space-x-2'}`}>
          <ButtonCustom 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className={`${isMobile ? 'w-full' : ''}`}
          >
            <Translate text="common.cancel" />
          </ButtonCustom>
          <ButtonCustom 
            variant="default" 
            onClick={onSave}
            className={`${isMobile ? 'w-full' : ''}`}
          >
            <Translate text="common.saveChanges" />
          </ButtonCustom>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditSpeechModal;
