
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Speech } from '@/types/auth';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ButtonCustom } from '@/components/ui/button-custom';
import Translate from '@/components/Translate';

interface EditSpeechModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  speech: Speech | null;
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
  if (!speech) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle><Translate text="dashboard.editSpeech" /></DialogTitle>
          <DialogDescription>
            <Translate text="dashboard.editSpeechDesc" />
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label htmlFor="editTitle" className="text-sm font-medium">
              <Translate text="common.title" />
            </label>
            <Input
              id="editTitle"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="editContent" className="text-sm font-medium">
              <Translate text="common.content" />
            </label>
            <Textarea
              id="editContent"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full min-h-[300px]"
            />
          </div>
        </div>
        <DialogFooter>
          <ButtonCustom 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            <Translate text="common.cancel" />
          </ButtonCustom>
          <ButtonCustom 
            variant="default" 
            onClick={onSave}
          >
            <Translate text="common.saveChanges" />
          </ButtonCustom>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditSpeechModal;
