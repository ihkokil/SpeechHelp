
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { createPlaceholderSpeech } from '../utils/speechContentUtils';

interface UseSpeechResetProps {
  title: string;
  content: string;
  setContent: (content: string) => void;
  speechDetails?: Record<string, string>;
}

export const useSpeechReset = ({ 
  title, 
  content, 
  setContent, 
  speechDetails = {} 
}: UseSpeechResetProps) => {
  const { toast } = useToast();
  
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

  return { handleReset };
};
