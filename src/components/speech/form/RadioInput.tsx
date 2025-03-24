
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface RadioInputProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
}

const RadioInput: React.FC<RadioInputProps> = ({ value, onChange, options }) => {
  return (
    <RadioGroup 
      value={value}
      onValueChange={onChange}
      className="flex flex-col space-y-2"
    >
      {options.map((option) => (
        <div key={option} className="flex items-center space-x-2">
          <RadioGroupItem value={option} id={option.toLowerCase().replace(/ /g, '-')} />
          <Label htmlFor={option.toLowerCase().replace(/ /g, '-')}>{option}</Label>
        </div>
      ))}
    </RadioGroup>
  );
};

export default RadioInput;
