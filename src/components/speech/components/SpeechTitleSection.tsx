
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Translate from '@/components/Translate';

interface SpeechTitleSectionProps {
  title: string;
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SpeechTitleSection: React.FC<SpeechTitleSectionProps> = ({
  title,
  onTitleChange
}) => {
  return (
    <div>
      <Label htmlFor="speechTitle" className="mb-2 block">
        <Translate text="speechLab.speechTitleLabel" />
      </Label>
      <Input
        id="speechTitle"
        placeholder="Enter speech title"
        value={title}
        onChange={onTitleChange}
      />
    </div>
  );
};

export default SpeechTitleSection;
