
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Pencil, Wand2 } from "lucide-react";
import { useTranslation } from '@/translations';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface QuickSpeechModifiersProps {
  onModify: (modifierType: string) => void;
  isProcessing: boolean;
  className?: string;
}

const QuickSpeechModifiers: React.FC<QuickSpeechModifiersProps> = ({ 
  onModify, 
  isProcessing,
  className
}) => {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation();

  return (
    <div className={cn("flex flex-wrap gap-2 mb-4", className)}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onModify('longer')}
        disabled={isProcessing}
        className="flex items-center text-sm transition-colors hover:text-purple-600 hover:border-purple-300"
      >
        <Wand2 className="h-3.5 w-3.5 mr-1" />
        {t('speechLab.makeLonger', currentLanguage.code)}
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => onModify('shorter')}
        disabled={isProcessing}
        className="flex items-center text-sm transition-colors hover:text-purple-600 hover:border-purple-300"
      >
        <Wand2 className="h-3.5 w-3.5 mr-1" />
        {t('speechLab.makeShorter', currentLanguage.code)}
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => onModify('formal')}
        disabled={isProcessing}
        className="flex items-center text-sm transition-colors hover:text-purple-600 hover:border-purple-300"
      >
        <Pencil className="h-3.5 w-3.5 mr-1" />
        {t('speechLab.makeFormal', currentLanguage.code)}
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => onModify('humor')}
        disabled={isProcessing}
        className="flex items-center text-sm transition-colors hover:text-purple-600 hover:border-purple-300"
      >
        <ArrowRight className="h-3.5 w-3.5 mr-1" />
        {t('speechLab.addHumor', currentLanguage.code)}
      </Button>
    </div>
  );
};

export default QuickSpeechModifiers;
