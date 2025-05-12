
import React, { useState } from 'react';
import SpeechTitleInput from './SpeechTitleInput';
import SpeechContentEditor from './SpeechContentEditor';
import SpeechActionButtons from './SpeechActionButtons';
import QuickSpeechModifiers from './QuickSpeechModifiers';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';

interface SpeechEditorProps {
  title: string;
  content: string;
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onContentChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onDownload: () => void;
  onReset: () => void;
}

const SpeechEditor: React.FC<SpeechEditorProps> = ({
  title,
  content,
  onTitleChange,
  onContentChange,
  onDownload,
  onReset
}) => {
  const { toast } = useToast();
  const [isModifying, setIsModifying] = useState(false);

  const modifySpeech = async (modifierType: string, customInstruction?: string) => {
    if (!content.trim()) {
      toast({
        title: "No Content",
        description: "Please add some speech content first before applying modifications.",
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
      
      console.log(`Modifying speech with instruction: ${instruction}`);
      
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
      
      console.log('Received modified speech from service');
      
      // Create a synthetic event to update the content
      const syntheticEvent = {
        target: { value: data.speech },
        preventDefault: () => {},
      } as React.ChangeEvent<HTMLTextAreaElement>;
      
      onContentChange(syntheticEvent);
      
      toast({
        title: "Speech Modified",
        description: getModificationMessage(modifierType),
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

  return (
    <div className="space-y-8">
      <SpeechTitleInput 
        title={title} 
        onTitleChange={onTitleChange} 
      />
      
      <div>
        <QuickSpeechModifiers 
          onModify={modifySpeech} 
          isProcessing={isModifying}
        />
        
        <div className={`${isModifying ? 'opacity-70 pointer-events-none' : ''}`}>
          <SpeechContentEditor 
            content={content} 
            onContentChange={onContentChange}
            preserveHtml={true}
          />
        </div>
        
        {isModifying && (
          <div className="flex justify-center items-center py-4">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700"></div>
              <p className="mt-2 text-sm text-purple-700">Modifying your speech...</p>
            </div>
          </div>
        )}
      </div>
      
      <SpeechActionButtons 
        content={content}
        title={title}
        onDownload={onDownload} 
        onReset={onReset} 
      />
    </div>
  );
};

export default SpeechEditor;
