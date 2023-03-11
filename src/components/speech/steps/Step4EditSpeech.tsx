
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ButtonCustom } from '@/components/ui/button-custom';
import { ArrowLeft, Save } from 'lucide-react';
import Translate from '@/components/Translate';
import { useToast } from "@/hooks/use-toast";
import SpeechTitleInput from '../components/SpeechTitleInput';
import SpeechContentEditor from '../components/SpeechContentEditor';
import SpeechActionButtons from '../components/SpeechActionButtons';
import { useSpeechSave } from '../hooks/useSpeechSave';
import { createPlaceholderSpeech } from '../utils/speechContentUtils';

interface Step4Props {
  prevStep: () => void;
  speechTitle: string;
  speechType: string;
  onTitleChange: (title: string) => void;
  speechDetails?: Record<string, string>;
}

const Step4EditSpeech: React.FC<Step4Props> = ({ 
  prevStep, 
  speechTitle, 
  speechType,
  onTitleChange,
  speechDetails = {}
}) => {
  const [title, setTitle] = useState(speechTitle);
  const [content, setContent] = useState('');
  const { toast } = useToast();

  // Setup save functionality hook
  const { isSaving, handleSave } = useSpeechSave({
    title,
    content,
    speechType,
    speechDetails
  });

  useEffect(() => {
    setTitle(speechTitle);
  }, [speechTitle]);

  useEffect(() => {
    const savedSpeech = localStorage.getItem('generatedSpeech');
    if (savedSpeech) {
      setContent(savedSpeech);
    } else {
      const placeholderSpeech = createPlaceholderSpeech(title, speechDetails);
      setContent(placeholderSpeech);
    }
  }, []);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    onTitleChange(e.target.value);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.trim() || 'speech'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Download Started",
      description: "Your speech is being downloaded as a text file.",
    });
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset your speech? This will clear all your changes.")) {
      const savedSpeech = localStorage.getItem('generatedSpeech');
      if (savedSpeech) {
        setContent(savedSpeech);
      } else {
        setContent(createPlaceholderSpeech(title, speechDetails));
      }
      
      toast({
        title: "Speech Reset",
        description: "Your speech has been reset to the original generated content.",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle><Translate text="speechLab.editTitle" /></CardTitle>
        <CardDescription><Translate text="speechLab.editDesc" /></CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <SpeechTitleInput 
          title={title} 
          onTitleChange={handleTitleChange} 
        />
        
        <SpeechContentEditor 
          content={content} 
          onContentChange={handleContentChange} 
        />
        
        <SpeechActionButtons 
          content={content}
          onDownload={handleDownload} 
          onReset={handleReset} 
        />
      </CardContent>
      <CardFooter className="flex justify-between">
        <ButtonCustom onClick={prevStep} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          <Translate text="speechLab.backButton" />
        </ButtonCustom>
        <ButtonCustom 
          variant="magenta" 
          onClick={handleSave}
          disabled={isSaving || !title.trim() || !content.trim()}
        >
          {isSaving ? (
            <span className="inline-flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <Translate text="common.saving" fallback="Saving..." />
            </span>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              <Translate text="speechLab.saveButton" />
            </>
          )}
        </ButtonCustom>
      </CardFooter>
    </Card>
  );
};

export default Step4EditSpeech;
