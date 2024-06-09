
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Speech } from '@/types/speech';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format, parseISO } from 'date-fns';
import { getSpeechTypeLabel, getTypeColor } from './speech-utils';
import { useTranslation } from '@/translations';
import { useLanguage } from '@/contexts/LanguageContext';
import Translate from '@/components/Translate';
import SpeechPreview from '@/components/speech/components/SpeechPreview';
import SpeechExportButtons from './components/SpeechExportButtons';

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
    const date = parseISO(dateString);
    return format(date, 'MMM d, yyyy h:mm a');
  };

  if (!speech) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-xl text-purple-800">{speech.title}</DialogTitle>
          <DialogDescription>
            <Badge className={getTypeColor(speech.speech_type)}>
              {getSpeechTypeLabel(speech.speech_type)}
            </Badge>
          </DialogDescription>
        </DialogHeader>
        <div className="overflow-auto max-h-[60vh] my-4">
          <SpeechPreview content={speech.content} />
        </div>
        <div className="text-sm mt-2 flex">
          <span className="text-purple-600">
            <Translate text="dashboard.created" />: {formatDate(speech.created_at)}
          </span> 
          <span className="mx-2 text-gray-500">|</span> 
          <span className="text-pink-600">
            <Translate text="dashboard.lastUpdated" />: {formatDate(speech.updated_at)}
          </span>
        </div>
        
        <SpeechExportButtons 
          speech={speech}
          title={speech.title}
          content={speech.content}
        />
        
        <DialogFooter className="mt-4">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            <Translate text="common.close" />
          </Button>
          <Button 
            variant="magenta" 
            onClick={() => {
              onOpenChange(false);
              onEditClick(speech);
            }}
          >
            <Translate text="common.edit" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewSpeechModal;
