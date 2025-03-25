
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface RadioQuestionProps {
  question: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

const RadioQuestion: React.FC<RadioQuestionProps> = ({ 
  question, 
  options, 
  value, 
  onChange 
}) => {
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-medium">{question}</h3>
      <RadioGroup 
        value={value} 
        onValueChange={onChange}
        className="flex flex-col space-y-2"
      >
        {options.map((option) => (
          <div key={option} className="flex items-center space-x-2">
            <RadioGroupItem 
              value={option} 
              id={option.toLowerCase().replace(/ /g, '-')} 
            />
            <Label 
              htmlFor={option.toLowerCase().replace(/ /g, '-')}
            >
              {option}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default RadioQuestion;
