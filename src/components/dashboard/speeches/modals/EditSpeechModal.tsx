import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Speech } from '@/types/speech';
import { ButtonCustom } from '@/components/ui/button-custom';
import Translate from '@/components/Translate';
import EditSpeechForm from '../components/EditSpeechForm';
import QuickSpeechModifiers from '@/components/speech/components/QuickSpeechModifiers';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
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
  const {
    toast
  } = useToast();
  const [isModifying, setIsModifying] = useState(false);

  // Debug log
  console.log('EditSpeechModal rendered with:', {
    isOpen,
    speechId: speech?.id,
    speechTitle: speech?.title,
    editTitle,
    editContentLength: editContent?.length || 0,
    hasContent: Boolean(editContent)
  });
  const modifySpeech = async (modifierType: string, customInstruction?: string) => {
    if (!editContent.trim()) {
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
        case 'custom':
          instruction = customInstruction || "Improve this speech based on the custom instruction.";
          break;
        default:
          instruction = "Improve this speech.";
      }

      // Try to modify the speech using Supabase Edge Function
      const {
        data,
        error
      } = await supabase.functions.invoke('openai-gen', {
        body: {
          existingSpeech: editContent,
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
      setEditContent(data.speech);
      toast({
        title: "Speech Modified",
        description: getModificationMessage(modifierType)
      });
    } catch (error) {
      console.error('Error modifying speech:', error);
      toast({
        title: "Modification Failed",
        description: "Could not modify the speech. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsModifying(false);
    }
  };
  const getModificationMessage = (modifierType: string): string => {
    switch (modifierType) {
      case 'longer':
        return "The speech has been successfully lengthened.";
      case 'shorter':
        return "The speech has been successfully shortened.";
      case 'formal':
        return "The speech has been successfully made more formal.";
      case 'humor':
        return "The speech has been successfully made more humorous.";
      case 'custom':
        return "The speech has been successfully modified according to your instructions.";
      default:
        return "The speech has been successfully modified.";
    }
  };
  if (!speech) return null;
  return <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle><Translate text="dashboard.editSpeech" /></DialogTitle>
          
        </DialogHeader>
        
        <QuickSpeechModifiers onModify={modifySpeech} isProcessing={isModifying} className="mb-2" />
        
        <EditSpeechForm speech={speech} editTitle={editTitle} editContent={editContent} setEditTitle={setEditTitle} setEditContent={setEditContent} />
        
        <DialogFooter className="mt-4">
          <ButtonCustom variant="outline" onClick={() => onOpenChange(false)}>
            <Translate text="common.cancel" />
          </ButtonCustom>
          <ButtonCustom variant="default" onClick={onSave} disabled={!editTitle.trim() || !editContent.trim()}>
            <Translate text="common.saveChanges" />
          </ButtonCustom>
        </DialogFooter>
      </DialogContent>
    </Dialog>;
};
export default EditSpeechModal;