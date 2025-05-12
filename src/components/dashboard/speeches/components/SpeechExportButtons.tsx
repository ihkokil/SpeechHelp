
import React from 'react';
import { Speech } from '@/types/speech';
import { Button } from '@/components/ui/button';
import { Download, Printer } from 'lucide-react';
import Translate from '@/components/Translate';
import { useExportFunctions } from '../utils/exportUtils';

interface SpeechExportButtonsProps {
  speech: Speech | null;
  title: string;
  content: string;
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const SpeechExportButtons: React.FC<SpeechExportButtonsProps> = ({ 
  speech, 
  title, 
  content, 
  size = 'sm' 
}) => {
  const { handleDownload, handlePrint } = useExportFunctions(speech, title, content);

  // Check if it's an upcoming speech or there's no content
  const isUpcoming = speech?.isUpcoming === true;
  const hasContent = speech && speech.content && speech.content.trim().length > 0;
  
  // Don't render export buttons for upcoming speeches or speeches with no content
  if (!speech || !hasContent || isUpcoming) return null;

  return (
    <div className="flex flex-wrap gap-2">
      <Button 
        variant="outline" 
        size={size}
        onClick={handleDownload}
      >
        <Download className="h-4 w-4 mr-2" />
        <Translate text="common.download" fallback="Download as PDF" />
      </Button>
      <Button 
        variant="outline" 
        size={size}
        onClick={handlePrint}
      >
        <Printer className="h-4 w-4 mr-2" />
        <Translate text="common.print" fallback="Print" />
      </Button>
    </div>
  );
};

export default SpeechExportButtons;
