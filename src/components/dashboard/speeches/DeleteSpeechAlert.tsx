
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
  speech: Speech | null;
  onConfirm: () => void;
  isLoading?: boolean;
}

const DeleteSpeechAlert = ({ isOpen, onOpenChange, speech, onConfirm, isLoading = false }: DeleteSpeechAlertProps) => {
  if (!speech) return null;

  const isUpcoming = speech.isUpcoming;
  const itemType = isUpcoming ? 'upcoming event' : 'speech';

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle><Translate text="common.areYouSure" /></AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the {itemType} "{speech.title}".
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            <Translate text="common.cancel" />
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700"
          >
            {isLoading ? 'Deleting...' : <Translate text="common.delete" />}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteSpeechAlert;
