
import React from 'react';
import { Speech } from '@/types/speech';
import { ButtonCustom } from '@/components/ui/button-custom';
import { Download, Printer } from 'lucide-react';
import Translate from '@/components/Translate';
import { useExportFunctions } from '../utils/exportUtils';

interface SpeechExportButtonsProps {
  speech: Speech | null;
  title: string;
  content: string;
  size?: 'default' | 'sm' | 'lg' | 'xl' | 'icon';
}

const SpeechExportButtons: React.FC<SpeechExportButtonsProps> = ({ 
  speech, 
  title, 
  content, 
  size = 'sm' 
}) => {
  const { handleDownload, handlePrint } = useExportFunctions(speech, title, content);

  if (!speech) return null;

  return (
    <div className="flex flex-wrap gap-2">
      <ButtonCustom 
        variant="outline" 
        size={size}
        onClick={handleDownload}
      >
        <Download className="h-4 w-4 mr-2" />
        <Translate text="common.download" fallback="Download as PDF" />
      </ButtonCustom>
      <ButtonCustom 
        variant="outline" 
        size={size}
        onClick={handlePrint}
      >
        <Printer className="h-4 w-4 mr-2" />
        <Translate text="common.print" fallback="Print" />
      </ButtonCustom>
    </div>
  );
};

export default SpeechExportButtons;
