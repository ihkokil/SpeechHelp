
import React from 'react';
import { Label } from '@/components/ui/label';
import { TextareaWithPinkScrollbar } from '@/components/ui/textarea-with-pink-scrollbar';

interface SpeechContentEditorProps {
  content: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const SpeechContentEditor: React.FC<SpeechContentEditorProps> = ({ content, onChange }) => {
  return (
    <div>
      <Label htmlFor="speechContent" className="text-pink-600 font-medium mb-2 block">
        Speech Content
      </Label>
      <TextareaWithPinkScrollbar 
        id="speechContent"
        className="min-h-[300px]" 
        value={content}
        onChange={onChange}
      />
    </div>
  );
};

export default SpeechContentEditor;
