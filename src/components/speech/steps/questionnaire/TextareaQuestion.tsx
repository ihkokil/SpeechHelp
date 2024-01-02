
import React from 'react';
import { Textarea } from '@/components/ui/textarea';

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
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-medium">{question}</h3>
      <Textarea 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full min-h-[100px]"
      />
    </div>
  );
};

export default TextareaQuestion;
