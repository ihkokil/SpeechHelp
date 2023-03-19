
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { TextareaWithPinkScrollbar } from '@/components/ui/textarea-with-pink-scrollbar';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Edit, Eye } from 'lucide-react';
import SpeechPreview from './SpeechPreview';
import Translate from '@/components/Translate';

interface SpeechContentEditorProps {
  content: string;
  onContentChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const SpeechContentEditor: React.FC<SpeechContentEditorProps> = ({ 
  content, 
  onContentChange 
}) => {
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <Label 
          htmlFor="speechContent" 
          className="text-pink-600 font-medium uppercase"
        >
          <Translate text="speechLab.content" fallback="Speech Content" />
        </Label>
        
        <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as 'edit' | 'preview')}>
          <ToggleGroupItem value="edit" aria-label="Edit mode" className="px-4 py-1 min-w-[100px] w-[100px] flex justify-center">
            <Edit className="h-5 w-5 mr-2" />
            <Translate text="speechLab.edit" fallback="Edit" />
          </ToggleGroupItem>
          <ToggleGroupItem value="preview" aria-label="Preview mode" className="px-4 py-1 min-w-[100px] w-[100px] flex justify-center">
            <Eye className="h-5 w-5 mr-2" />
            <Translate text="speechLab.preview" fallback="Preview" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {viewMode === 'edit' ? (
        <TextareaWithPinkScrollbar 
          id="speechContent"
          className="min-h-[300px]" 
          value={content}
          onChange={onContentChange}
        />
      ) : (
        <SpeechPreview content={content} />
      )}
    </div>
  );
};

export default SpeechContentEditor;
