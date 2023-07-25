
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
import { format, parseISO } from 'date-fns';
import { getSpeechTypeLabel, getTypeColor } from './speech-utils';
import { useTranslation } from '@/translations';
import { useLanguage } from '@/contexts/LanguageContext';
import Translate from '@/components/Translate';
import SpeechPreview from '@/components/speech/components/SpeechPreview';
import SpeechExportButtons from './components/SpeechExportButtons';
import { useIsMobile } from '@/hooks/use-mobile';

interface ViewSpeechModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  speech: Speech | null;
  onEditClick: (speech: Speech) => void;
}

const ViewSpeechModal = ({ isOpen, onOpenChange, speech, onEditClick }: ViewSpeechModalProps) => {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  const formatDate = (dateString: string) => {
    const date = parseISO(dateString);
    return format(date, 'MMM d, yyyy h:mm a');
  };

  if (!speech) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className={`${isMobile ? 'w-[calc(100vw-32px)]' : 'max-w-3xl'} max-h-[90vh] overflow-auto`}>
        <DialogHeader>
          <DialogTitle className="text-xl text-purple-800 break-words">{speech.title}</DialogTitle>
          <DialogDescription>
            <Badge className={getTypeColor(speech.speech_type)}>
              {getSpeechTypeLabel(speech.speech_type)}
            </Badge>
          </DialogDescription>
        </DialogHeader>
        <div className="overflow-auto max-h-[60vh] my-4">
          <SpeechPreview content={speech.content} />
        </div>
        <div className={`text-sm mt-2 ${isMobile ? 'flex flex-col gap-1' : 'flex'}`}>
          <span className="text-purple-600">
            <Translate text="dashboard.created" />: {formatDate(speech.created_at)}
          </span> 
          {!isMobile && <span className="mx-2 text-gray-500">|</span>} 
          <span className="text-pink-600">
            <Translate text="dashboard.lastUpdated" />: {formatDate(speech.updated_at)}
          </span>
        </div>
        
        <SpeechExportButtons 
          speech={speech}
          title={speech.title}
          content={speech.content}
        />
        
        <DialogFooter className={`mt-4 ${isMobile ? 'flex-col gap-2' : ''}`}>
          <ButtonCustom 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className={isMobile ? 'w-full' : ''}
          >
            <Translate text="common.close" />
          </ButtonCustom>
          <ButtonCustom 
            variant="default" 
            onClick={() => {
              onOpenChange(false);
              onEditClick(speech);
            }}
            className={isMobile ? 'w-full' : ''}
          >
            <Translate text="common.edit" />
          </ButtonCustom>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewSpeechModal;
