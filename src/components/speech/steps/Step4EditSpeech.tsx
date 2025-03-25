
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ButtonCustom } from '@/components/ui/button-custom';
import { ArrowLeft, Save } from 'lucide-react';
import Translate from '@/components/Translate';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { useSpeechService } from '@/services/speechService';
import SpeechTitleInput from '../components/SpeechTitleInput';
import SpeechContentEditor from '../components/SpeechContentEditor';
import SpeechEditActions from '../components/SpeechEditActions';
import { createPlaceholderSpeech, downloadSpeech } from '../utils/speechUtils';

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
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const speechService = useSpeechService();

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

  const handleSave = async () => {
    if (!title.trim()) {
      toast({
        title: "Title Required",
        description: "Please enter a title for your speech",
        variant: "destructive",
      });
      return;
    }

    if (!content.trim()) {
      toast({
        title: "Content Required",
        description: "Please enter content for your speech",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      const speechWithMetadata = {
        content: content,
        details: speechDetails || {}
      };
      
      const contentToSave = JSON.stringify(speechWithMetadata);

      if (user) {
        await speechService.saveSpeech(user.id, title, contentToSave, speechType);
        toast({
          title: "Speech Saved",
          description: "Your speech has been saved successfully.",
        });
      } else {
        toast({
          title: "Authentication Required",
          description: "Please sign in to save your speech.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save speech. Please try again.",
        variant: "destructive",
      });
      console.error("Error saving speech:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownload = () => {
    downloadSpeech(content, title, toast);
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
      <CardContent className="space-y-6">
        <SpeechTitleInput title={title} onChange={handleTitleChange} />
        <SpeechContentEditor content={content} onChange={handleContentChange} />
        <SpeechEditActions onDownload={handleDownload} onReset={handleReset} />
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
