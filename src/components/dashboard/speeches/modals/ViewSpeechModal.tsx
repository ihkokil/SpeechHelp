
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
import QuickSpeechModifiers from '@/components/speech/components/QuickSpeechModifiers';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ViewSpeechModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  speech: Speech;
  onEditClick: () => void;
}

const ViewSpeechModal = ({ isOpen, onOpenChange, speech, onEditClick }: ViewSpeechModalProps) => {
  const { currentLanguage } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [content, setContent] = useState(speech?.content || '');
  const [isModifying, setIsModifying] = useState(false);

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

  const modifySpeech = async (modifierType: string) => {
    if (!content.trim()) {
      toast({
        title: "No Content",
        description: "There is no speech content to modify.",
        variant: "destructive"
      });
      return;
    }
    
    setIsModifying(true);
    
    try {
      let instruction = "";
      
      switch (modifierType) {
        case 'longer':
          instruction = "Make this speech longer with more details and examples, but keep the same tone and purpose.";
          break;
        case 'shorter':
          instruction = "Make this speech shorter and more concise, while keeping the key points and purpose.";
          break;
        case 'formal':
          instruction = "Rewrite this speech in a more formal and professional tone, using more sophisticated language.";
          break;
        case 'humor':
          instruction = "Add more humor throughout this speech with appropriate jokes and light-hearted comments.";
          break;
        default:
          instruction = "Improve this speech.";
      }
      
      // Try to modify the speech using Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('openai-gen', {
        body: {
          existingSpeech: content,
          instruction: instruction,
          isModification: true
        }
      });
      
      if (error) {
        console.error('Error from Supabase function:', error);
        throw error;
      }
      
      if (!data || !data.speech) {
        console.error('Invalid response format:', data);
        throw new Error('Invalid response from modification service');
      }
      
      setContent(data.speech);
      
      toast({
        title: "Speech Modified",
        description: `The speech has been successfully ${modifierType === 'humor' ? 'made more humorous' : 
          modifierType === 'longer' ? 'lengthened' : 
          modifierType === 'shorter' ? 'shortened' : 
          'made more formal'}.`,
      });
      
    } catch (error) {
      console.error('Error modifying speech:', error);
      toast({
        title: "Modification Failed",
        description: "Could not modify the speech. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsModifying(false);
    }
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

        {!speech.isUpcoming && (
          <QuickSpeechModifiers 
            onModify={modifySpeech} 
            isProcessing={isModifying}
            className="mb-2"
          />
        )}
        
        <div className="overflow-auto max-h-[60vh] my-4">
          {isModifying ? (
            <div className="flex justify-center items-center p-8">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700"></div>
                <p className="mt-2 text-sm text-purple-700">Modifying your speech...</p>
              </div>
            </div>
          ) : (
            <SpeechPreview content={content || speech.content} />
          )}
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
          content={content || speech.content}
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
