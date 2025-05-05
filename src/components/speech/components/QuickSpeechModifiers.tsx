
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
  const { toast } = useToast();
  
  const handleModify = (type: string) => {
    if (isProcessing) {
      toast({
        title: "Processing in Progress",
        description: "Please wait until the current modification is complete.",
        variant: "warning"
      });
      return;
    }
    
    onModify(type);
  };
  
  return (
    <div className="flex flex-wrap gap-2 mt-4">
      <ButtonCustom
        variant="outline"
        size="sm"
        onClick={() => handleModify('longer')}
        disabled={isProcessing}
        className="flex items-center gap-1 text-xs"
      >
        <ArrowUp className="h-3.5 w-3.5" />
        <Translate text="speechLab.makeLonger" fallback="Make it longer" />
      </ButtonCustom>
      
      <ButtonCustom
        variant="outline"
        size="sm"
        onClick={() => handleModify('shorter')}
        disabled={isProcessing}
        className="flex items-center gap-1 text-xs"
      >
        <ArrowDown className="h-3.5 w-3.5" />
        <Translate text="speechLab.makeShorter" fallback="Make it shorter" />
      </ButtonCustom>
      
      <ButtonCustom
        variant="outline"
        size="sm"
        onClick={() => handleModify('formal')}
        disabled={isProcessing}
        className="flex items-center gap-1 text-xs"
      >
        <FileText className="h-3.5 w-3.5" />
        <Translate text="speechLab.makeFormal" fallback="Make it formal" />
      </ButtonCustom>
      
      <ButtonCustom
        variant="outline"
        size="sm"
        onClick={() => handleModify('humor')}
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
