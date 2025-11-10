
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, FileText, Pencil, Smile, Wand2 } from "lucide-react";
import { useTranslation } from '@/translations';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

interface QuickSpeechModifiersProps {
  onModify: (modifierType: string, customInstruction?: string) => void;
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
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customInstruction, setCustomInstruction] = useState('');

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customInstruction.trim()) {
      onModify('custom', customInstruction);
      setCustomInstruction('');
      setShowCustomInput(false);
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex flex-wrap gap-2 mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onModify('longer')}
          disabled={isProcessing}
          className="flex items-center text-sm transition-colors hover:text-white hover:border-purple-300"
        >
          <ArrowUp className="h-3.5 w-3.5 mr-1" />
          {t('speechLab.makeLonger', currentLanguage.code)}
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onModify('shorter')}
          disabled={isProcessing}
          className="flex items-center text-sm transition-colors hover:text-white hover:border-purple-300"
        >
          <ArrowDown className="h-3.5 w-3.5 mr-1" />
          {t('speechLab.makeShorter', currentLanguage.code)}
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onModify('formal')}
          disabled={isProcessing}
          className="flex items-center text-sm transition-colors hover:text-white hover:border-purple-300"
        >
          <FileText className="h-3.5 w-3.5 mr-1" />
          {t('speechLab.makeFormal', currentLanguage.code)}
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onModify('humor')}
          disabled={isProcessing}
          className="flex items-center text-sm transition-colors hover:text-white hover:border-purple-300"
        >
          <Smile className="h-3.5 w-3.5 mr-1" />
          {t('speechLab.addHumor', currentLanguage.code)}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowCustomInput(!showCustomInput)}
          disabled={isProcessing}
          className="flex items-center text-sm transition-colors hover:text-white hover:border-purple-300"
        >
          <Pencil className="h-3.5 w-3.5 mr-1" />
          {t('speechLab.customInstruction', currentLanguage.code) || "Custom Instruction"}
        </Button>
      </div>

      {showCustomInput && (
        <form onSubmit={handleCustomSubmit} className="flex gap-2">
          <Input
            value={customInstruction}
            onChange={(e) => setCustomInstruction(e.target.value)}
            placeholder={t('speechLab.customInstructionPlaceholder', currentLanguage.code) || "Enter your instruction..."}
            className="flex-1"
            disabled={isProcessing}
          />
          <Button 
            type="submit" 
            size="sm"
            disabled={isProcessing || !customInstruction.trim()}
          >
            {t('speechLab.apply', currentLanguage.code) || "Apply"}
          </Button>
        </form>
      )}
    </div>
  );
};

export default QuickSpeechModifiers;
