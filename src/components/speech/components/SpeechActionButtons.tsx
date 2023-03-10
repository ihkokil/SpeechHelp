
import React from 'react';
import { ButtonCustom } from '@/components/ui/button-custom';
import { Download, RefreshCw } from 'lucide-react';
import Translate from '@/components/Translate';

interface SpeechActionButtonsProps {
  onDownload: () => void;
  onReset: () => void;
}

const SpeechActionButtons: React.FC<SpeechActionButtonsProps> = ({ 
  onDownload, 
  onReset 
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      <ButtonCustom variant="outline" size="sm" onClick={onDownload}>
        <Translate text="speechLab.downloadButton" />
        <Download className="ml-2 h-4 w-4" />
      </ButtonCustom>
      <ButtonCustom variant="outline" size="sm" onClick={onReset}>
        <Translate text="speechLab.resetButton" />
        <RefreshCw className="ml-2 h-4 w-4" />
      </ButtonCustom>
    </div>
  );
};

export default SpeechActionButtons;
