
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/translations';
import { SpeechDetails } from '../hooks/useSpeechLabState';

interface UseSpeechGenerationProps {
  speechTitle: string;
  speechType: string;
  speechDetails?: SpeechDetails;
  onSuccess?: () => void;
}

export const useSpeechGeneration = ({
  speechTitle,
  speechType,
  speechDetails = {},
  onSuccess
}: UseSpeechGenerationProps) => {
  const [generating, setGenerating] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const { toast } = useToast();
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation();

  const generateSpeech = async () => {
    if (!speechTitle) {
      toast({
        title: t("speechLab.titleRequired", currentLanguage.code),
        description: t("speechLab.pleaseEnterTitle", currentLanguage.code),
        variant: "destructive",
      });
      return;
    }

    setGenerating(true);
    
    try {
      // Simulate speech generation (in production, this would call an AI endpoint)
      await new Promise(resolve => setTimeout(resolve, 4000));
      
      const audience = speechDetails.audience || 'general audience';
      const tone = speechDetails.tone || 'formal';
      const length = speechDetails.length || 'medium';
      
      // Create a sample speech based on the inputs and current language
      let generatedSpeech;
      
      if (currentLanguage.code === 'es') {
        generatedSpeech = generateSpanishSpeech(speechTitle, speechType, audience, tone, length);
      } else if (currentLanguage.code === 'fr') {
        generatedSpeech = generateFrenchSpeech(speechTitle, speechType, audience, tone, length);
      } else {
        generatedSpeech = generateEnglishSpeech(speechTitle, speechType, audience, tone, length);
      }
      
      // Create structured content with language metadata
      const structuredContent = {
        content: generatedSpeech,
        metadata: {
          language: currentLanguage.code,
          createdAt: new Date().toISOString()
        }
      };
      
      // Save to localStorage for demo purposes
      localStorage.setItem('generatedSpeech', JSON.stringify(structuredContent));
      
      setShowConfetti(true);
      
      // Hide confetti after a few seconds
      setTimeout(() => {
        setShowConfetti(false);
        if (onSuccess) onSuccess();
      }, 3000);

      toast({
        title: t("speechLab.generatedSuccess", currentLanguage.code),
        description: t("speechLab.readyToEdit", currentLanguage.code),
      });
    } catch (error) {
      console.error('Error generating speech:', error);
      toast({
        title: t("common.error", currentLanguage.code),
        description: t("speechLab.generationError", currentLanguage.code),
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  // Helper functions to generate sample speeches in different languages
  const generateEnglishSpeech = (title: string, type: string, audience: string, tone: string, length: string) => {
    return `# ${title}\n\nLadies and gentlemen, distinguished guests, and ${audience},\n\nIt is my honor to address you today on this special occasion.\n\nThis speech is a ${type} created for you with a ${tone} tone.\n\nThank you for your attention.`;
  };

  const generateSpanishSpeech = (title: string, type: string, audience: string, tone: string, length: string) => {
    return `# ${title}\n\nDamas y caballeros, invitados distinguidos, y ${audience},\n\nEs un honor dirigirme a ustedes hoy en esta ocasión especial.\n\nEste discurso es un ${type} creado para usted con un tono ${tone}.\n\nGracias por su atención.`;
  };

  const generateFrenchSpeech = (title: string, type: string, audience: string, tone: string, length: string) => {
    return `# ${title}\n\nMesdames et messieurs, distingués invités, et ${audience},\n\nC'est un honneur de m'adresser à vous aujourd'hui en cette occasion spéciale.\n\nCe discours est un ${type} créé pour vous avec un ton ${tone}.\n\nMerci de votre attention.`;
  };

  return {
    generating,
    showConfetti,
    generateSpeech
  };
};
