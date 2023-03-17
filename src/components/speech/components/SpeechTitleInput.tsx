
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import Translate from '@/components/Translate';

interface SpeechTitleInputProps {
  title: string;
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SpeechTitleInput: React.FC<SpeechTitleInputProps> = ({ 
  title, 
  onTitleChange 
}) => {
  return (
    <div>
      <Label 
        htmlFor="speechTitle" 
        className="text-purple-700 font-medium mb-4 block uppercase"
      >
        <Translate text="speechLab.speechTitleLabel" />
      </Label>
      <Input 
        id="speechTitle"
        value={title}
        onChange={onTitleChange}
        className="mb-4"
        placeholder="Enter speech title"
      />
    </div>
  );
};

export default SpeechTitleInput;
