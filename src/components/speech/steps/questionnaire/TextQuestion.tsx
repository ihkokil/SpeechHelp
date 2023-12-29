
import React from 'react';
import { Input } from '@/components/ui/input';
import { useIsMobile } from '@/hooks/use-mobile';

interface TextQuestionProps {
  question: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const TextQuestion: React.FC<TextQuestionProps> = ({ 
  question, 
  value, 
  onChange, 
  placeholder 
}) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="space-y-2">
      <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-medium`}>{question}</h3>
      <Input 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full"
      />
    </div>
  );
};

export default TextQuestion;
