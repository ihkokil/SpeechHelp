
import React from 'react';
import { ButtonCustom } from '@/components/ui/button-custom';
import { Download, RefreshCw, Play, Square } from 'lucide-react';
import Translate from '@/components/Translate';
import { useToast } from "@/hooks/use-toast";

interface SpeechActionButtonsProps {
  content?: string;
  onDownload: () => void;
  onReset: () => void;
}

const SpeechActionButtons: React.FC<SpeechActionButtonsProps> = ({ 
  content = '',
  onDownload, 
  onReset 
}) => {
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = React.useState(false);
  const speechSynthRef = React.useRef<SpeechSynthesisUtterance | null>(null);

  const handleTextToSpeech = () => {
    // If speech is currently playing, stop it
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    // Check if the SpeechSynthesis API is available
    if (!('speechSynthesis' in window)) {
      toast({
        title: "Speech Synthesis Not Supported",
        description: "Your browser doesn't support the speech synthesis feature.",
        variant: "destructive",
      });
      return;
    }

    // Clean the content by removing markdown formatting
    const cleanContent = content
      .replace(/^#+ (.+)$/gm, '$1') // Remove headings
      .replace(/\*\*(.+?)\*\*/g, '$1') // Remove bold
      .replace(/\*(.+?)\*/g, '$1') // Remove italic
      .replace(/---/g, '') // Remove horizontal rules
      .trim();

    try {
      // Create a new speech synthesis utterance
      speechSynthRef.current = new SpeechSynthesisUtterance(cleanContent);
      
      // Add event listeners
      speechSynthRef.current.onend = () => {
        setIsPlaying(false);
      };
      
      speechSynthRef.current.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        setIsPlaying(false);
        toast({
          title: "Text-to-Speech Error",
          description: "An error occurred while trying to read the speech.",
          variant: "destructive",
        });
      };
      
      // Start speaking
      window.speechSynthesis.speak(speechSynthRef.current);
      setIsPlaying(true);
      
      toast({
        title: "Reading Speech",
        description: "Your speech is being read aloud. Click the stop button to end.",
      });
    } catch (error) {
      console.error('Speech synthesis error:', error);
      toast({
        title: "Text-to-Speech Error",
        description: "An error occurred while trying to read the speech.",
        variant: "destructive",
      });
    }
  };

  // Clean up on component unmount
  React.useEffect(() => {
    return () => {
      if (speechSynthRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <div className="flex flex-wrap gap-2">
      <ButtonCustom 
        variant="outline" 
        size="sm" 
        onClick={handleTextToSpeech}
        className={isPlaying ? "bg-pink-100" : ""}
      >
        {isPlaying ? (
          <>
            <Translate text="speechLab.stopButton" fallback="Stop" />
            <Square className="ml-2 h-4 w-4" />
          </>
        ) : (
          <>
            <Translate text="speechLab.playButton" fallback="Play" />
            <Play className="ml-2 h-4 w-4" />
          </>
        )}
      </ButtonCustom>
      
      <ButtonCustom variant="outline" size="sm" onClick={onDownload}>
        <Translate text="speechLab.downloadButton" fallback="Download" />
        <Download className="ml-2 h-4 w-4" />
      </ButtonCustom>
      
      <ButtonCustom variant="outline" size="sm" onClick={onReset}>
        <Translate text="speechLab.resetButton" fallback="Reset" />
        <RefreshCw className="ml-2 h-4 w-4" />
      </ButtonCustom>
    </div>
  );
};

export default SpeechActionButtons;
