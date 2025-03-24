
import React from 'react';
import { Textarea } from '@/components/ui/textarea';

interface TextAreaInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const TextAreaInput: React.FC<TextAreaInputProps> = ({ value, onChange, placeholder }) => {
  return (
    <Textarea 
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full min-h-[100px]"
    />
  );
};

export default TextAreaInput;
