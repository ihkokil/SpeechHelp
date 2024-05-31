
import React from 'react';
import { ButtonCustom } from '@/components/ui/button-custom';
import { ArrowUp, ArrowDown, FileText, Laugh } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import Translate from '@/components/Translate';

interface QuickSpeechModifiersProps {
  onModify: (modifierType: string) => void;
  isProcessing?: boolean;
}

const QuickSpeechModifiers: React.FC<QuickSpeechModifiersProps> = ({ 
  onModify,
  isProcessing = false 
}) => {
  return (
    <div className="flex flex-wrap gap-2 mt-4">
      <ButtonCustom
        variant="outline"
        size="sm"
        onClick={() => onModify('longer')}
        disabled={isProcessing}
        className="flex items-center gap-1 text-xs"
      >
        <ArrowUp className="h-3.5 w-3.5" />
        <Translate text="speechLab.makeLonger" fallback="Make it longer" />
      </ButtonCustom>
      
      <ButtonCustom
        variant="outline"
        size="sm"
        onClick={() => onModify('shorter')}
        disabled={isProcessing}
        className="flex items-center gap-1 text-xs"
      >
        <ArrowDown className="h-3.5 w-3.5" />
        <Translate text="speechLab.makeShorter" fallback="Make it shorter" />
      </ButtonCustom>
      
      <ButtonCustom
        variant="outline"
        size="sm"
        onClick={() => onModify('formal')}
        disabled={isProcessing}
        className="flex items-center gap-1 text-xs"
      >
        <FileText className="h-3.5 w-3.5" />
        <Translate text="speechLab.makeFormal" fallback="Make it formal" />
      </ButtonCustom>
      
      <ButtonCustom
        variant="outline"
        size="sm"
        onClick={() => onModify('humor')}
        disabled={isProcessing}
        className="flex items-center gap-1 text-xs"
      >
        <Laugh className="h-3.5 w-3.5" />
        <Translate text="speechLab.addHumor" fallback="Add more humor" />
      </ButtonCustom>
    </div>
  );
};

export default QuickSpeechModifiers;
