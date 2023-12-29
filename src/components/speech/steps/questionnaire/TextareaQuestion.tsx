
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { useIsMobile } from '@/hooks/use-mobile';

interface TextareaQuestionProps {
  question: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const TextareaQuestion: React.FC<TextareaQuestionProps> = ({ 
  question, 
  value, 
  onChange, 
  placeholder 
}) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="space-y-2">
      <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-medium`}>{question}</h3>
      <Textarea 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full ${isMobile ? 'min-h-[80px]' : 'min-h-[100px]'}`}
      />
    </div>
  );
};

export default TextareaQuestion;
