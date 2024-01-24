
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Speech } from '@/types/speech';
import Translate from '@/components/Translate';

interface DeleteSpeechAlertProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  speech: Speech;
  onConfirm: () => void;
}

const DeleteSpeechAlert = ({ isOpen, onOpenChange, speech, onConfirm }: DeleteSpeechAlertProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle><Translate text="common.areYouSure" /></AlertDialogTitle>
          <AlertDialogDescription>
            <Translate text="dashboard.deleteWarning" /> "{speech.title}".
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel><Translate text="common.cancel" /></AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            <Translate text="common.delete" />
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteSpeechAlert;
