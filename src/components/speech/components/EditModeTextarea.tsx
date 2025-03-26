
import React from 'react';
import { Label } from '@/components/ui/label';
import { TextareaWithPinkScrollbar } from '@/components/ui/textarea-with-pink-scrollbar';
import Translate from '@/components/Translate';

interface EditModeTextareaProps {
  content: string;
  onContentChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  forceEditMode?: boolean;
}

const EditModeTextarea = React.forwardRef<HTMLTextAreaElement, EditModeTextareaProps>(
  ({ content, onContentChange, forceEditMode = false }, ref) => {
    return (
      <>
        {forceEditMode && (
          <Label 
            htmlFor="speechContent" 
            className="text-pink-600 font-medium uppercase block mb-2"
          >
            <Translate text="speechLab.content" fallback="Speech Content" />
          </Label>
        )}
        <TextareaWithPinkScrollbar 
          id="speechContent"
          className="min-h-[300px]" 
          value={content}
          onChange={onContentChange}
          ref={ref}
        />
      </>
    );
  }
);

EditModeTextarea.displayName = "EditModeTextarea";

export default EditModeTextarea;
