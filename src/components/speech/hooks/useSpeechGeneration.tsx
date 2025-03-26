
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { generateSpeechFromDetails } from '../utils/speechGenerator';
import { SpeechDetails } from './useSpeechLabState';

interface UseSpeechGenerationProps {
  speechTitle: string;
  speechDetails?: SpeechDetails;
  onSuccess: () => void;
}

export const useSpeechGeneration = ({ 
  speechTitle, 
  speechDetails = {}, 
  onSuccess 
}: UseSpeechGenerationProps) => {
  const { toast } = useToast();
  const [generating, setGenerating] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [generatedSpeech, setGeneratedSpeech] = useState('');

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showConfetti) {
      timer = setTimeout(() => {
        setShowConfetti(false);
        onSuccess();
      }, 5000); // Show confetti for 5 seconds before moving to next step
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [showConfetti, onSuccess]);

  const validateTitle = () => {
    if (!speechTitle.trim()) {
      toast({
        title: "Title Required",
        description: "Please enter a title for your speech",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const generateSpeech = () => {
    if (!validateTitle()) {
      return;
    }
    
    setGenerating(true);
    
    try {
      // Generate the fully enhanced speech with all embellishments
      const speech = generateSpeechFromDetails(speechTitle, speechDetails);
      setGeneratedSpeech(speech);
      
      setShowConfetti(true);
      
      // Save the fully enhanced speech to localStorage
      localStorage.setItem('generatedSpeech', speech);
      
      toast({
        title: "Speech Generated",
        description: "Your comprehensive speech has been created based on your questionnaire answers",
      });
      
    } catch (error) {
      console.error('Error generating speech:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate speech. Please try again.",
        variant: "destructive",
      });
      setGenerating(false);
    }
  };

  return {
    generating,
    showConfetti,
    generatedSpeech,
    generateSpeech
  };
};
