
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
import { ButtonCustom } from '@/components/ui/button-custom';
import { format, parseISO, isValid, differenceInDays } from 'date-fns';
import { getSpeechTypeLabel, getTypeColor } from '../speech-utils';
import { useLanguage } from '@/contexts/LanguageContext';
import Translate from '@/components/Translate';
import SpeechPreview from '@/components/speech/components/SpeechPreview';
import SpeechExportButtons from '../components/SpeechExportButtons';
import { CalendarClock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ViewSpeechModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  speech: Speech;
  onEditClick: () => void;
}

const ViewSpeechModal = ({ isOpen, onOpenChange, speech, onEditClick }: ViewSpeechModalProps) => {
  const { currentLanguage } = useLanguage();
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    if (!dateString || dateString.trim() === '') {
      return 'N/A';
    }
    
    try {
      const date = parseISO(dateString);
      
      if (!isValid(date)) {
        return 'N/A';
      }
      
      return format(date, 'MMM d, yyyy h:mm a');
    } catch (error) {
      console.error('Date parsing error:', error);
      return 'N/A';
    }
  };

  const getDaysRemaining = () => {
    if (speech.isUpcoming && speech.event_date) {
      try {
        const eventDate = parseISO(speech.event_date);
        if (isValid(eventDate)) {
          const daysLeft = differenceInDays(eventDate, new Date());
          return daysLeft > 0 ? daysLeft : 0;
        }
      } catch (error) {
        console.error('Error calculating days remaining:', error);
      }
    }
    return null;
  };
  
  const daysRemaining = getDaysRemaining();

  const handleCreateSpeech = () => {
    localStorage.setItem('currentEvent', JSON.stringify({
      id: speech.id,
      title: speech.title,
      date: speech.event_date,
      category: speech.speech_type,
      status: 'upcoming'
    }));
    
    navigate('/speech-lab');
    onOpenChange(false);
  };

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
        
        {speech.isUpcoming && (
          <div className="bg-blue-50 p-4 border border-blue-200 rounded-md flex items-start gap-3 my-4">
            <CalendarClock className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-700">Upcoming Speech Event</h3>
              {daysRemaining !== null && (
                <p className="text-blue-600">
                  Not Yet Created - {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} remaining to prepare your speech
                </p>
              )}
              <p className="text-sm text-blue-500 mt-1">
                Create this speech now to be ready for your upcoming event.
              </p>
            </div>
          </div>
        )}
        
        <div className="overflow-auto max-h-[60vh] my-4">
          <SpeechPreview content={speech.content} />
        </div>
        
        {!speech.isUpcoming && (
          <div className="text-sm mt-2 flex">
            <span className="text-purple-600">
              <Translate text="dashboard.created" />: {formatDate(speech.created_at)}
            </span> 
            <span className="mx-2 text-gray-500">|</span> 
            <span className="text-pink-600">
              <Translate text="dashboard.lastUpdated" />: {formatDate(speech.updated_at)}
            </span>
          </div>
        )}
        
        <SpeechExportButtons 
          speech={speech}
          title={speech.title}
          content={speech.content}
        />
        
        <DialogFooter className="mt-4">
          <ButtonCustom 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            <Translate text="common.close" />
          </ButtonCustom>
          {speech.isUpcoming ? (
            <ButtonCustom
              variant="default"
              onClick={handleCreateSpeech}
            >
              <Translate text="common.Create" />
            </ButtonCustom>
          ) : (
            <ButtonCustom 
              variant="default" 
              onClick={() => {
                onOpenChange(false);
                onEditClick();
              }}
            >
              <Translate text="common.edit" />
            </ButtonCustom>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewSpeechModal;
