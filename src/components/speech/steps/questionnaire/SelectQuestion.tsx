import React from 'react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SelectQuestionProps {
  question: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
}

const SelectQuestion: React.FC<SelectQuestionProps> = ({
  question,
  value,
  onChange,
  options,
  placeholder
}) => {
  return (
    <div className="space-y-3">
      <Label className="text-lg font-medium">{question}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full bg-background">
          <SelectValue placeholder={placeholder || 'Select an option'} />
        </SelectTrigger>
        <SelectContent className="bg-popover z-50">
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectQuestion;
