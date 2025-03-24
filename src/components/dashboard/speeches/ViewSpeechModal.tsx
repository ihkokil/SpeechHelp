
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Speech } from '@/types/auth';
import { Badge } from '@/components/ui/badge';
import { ButtonCustom } from '@/components/ui/button-custom';
import { format } from 'date-fns';
import { getSpeechTypeLabel, getTypeColor } from './speech-utils';
import { useTranslation } from '@/translations';
import { useLanguage } from '@/contexts/LanguageContext';
import Translate from '@/components/Translate';

interface ViewSpeechModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  speech: Speech | null;
  onEditClick: (speech: Speech) => void;
}

const ViewSpeechModal = ({ isOpen, onOpenChange, speech, onEditClick }: ViewSpeechModalProps) => {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation();

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy h:mm a');
  };

  if (!speech) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>{speech.title}</DialogTitle>
          <DialogDescription>
            <Badge className={getTypeColor(speech.speech_type)}>
              {getSpeechTypeLabel(speech.speech_type)}
            </Badge>
          </DialogDescription>
        </DialogHeader>
        <div className="whitespace-pre-line border rounded-md p-4 bg-gray-50 overflow-auto max-h-[50vh]">
          {speech.content}
        </div>
        <div className="text-sm text-gray-500 mt-2">
          <Translate text="dashboard.created" />: {formatDate(speech.created_at)} | 
          <Translate text="dashboard.lastUpdated" />: {formatDate(speech.updated_at)}
        </div>
        <DialogFooter>
          <ButtonCustom 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            <Translate text="common.close" />
          </ButtonCustom>
          <ButtonCustom 
            variant="default" 
            onClick={() => {
              onOpenChange(false);
              onEditClick(speech);
            }}
          >
            <Translate text="common.edit" />
          </ButtonCustom>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewSpeechModal;
