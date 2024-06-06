
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Pencil, Wand2 } from "lucide-react";
import { useTranslation } from '@/translations';
import { useLanguage } from '@/contexts/LanguageContext';

interface QuickSpeechModifiersProps {
  onModify: (modifierType: string) => void;
  isProcessing: boolean;
}

const QuickSpeechModifiers: React.FC<QuickSpeechModifiersProps> = ({ onModify, isProcessing }) => {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap gap-2 mb-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onModify('longer')}
        disabled={isProcessing}
        className="flex items-center text-sm"
      >
        <Wand2 className="h-3.5 w-3.5 mr-1" />
        {t('speechLab.makeLonger', currentLanguage.code)}
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => onModify('shorter')}
        disabled={isProcessing}
        className="flex items-center text-sm"
      >
        <Wand2 className="h-3.5 w-3.5 mr-1" />
        {t('speechLab.makeShorter', currentLanguage.code)}
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => onModify('formal')}
        disabled={isProcessing}
        className="flex items-center text-sm"
      >
        <Pencil className="h-3.5 w-3.5 mr-1" />
        {t('speechLab.makeFormal', currentLanguage.code)}
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => onModify('humor')}
        disabled={isProcessing}
        className="flex items-center text-sm"
      >
        <ArrowRight className="h-3.5 w-3.5 mr-1" />
        {t('speechLab.addHumor', currentLanguage.code)}
      </Button>
    </div>
  );
};

export default QuickSpeechModifiers;
