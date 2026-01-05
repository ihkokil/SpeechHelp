import React from 'react';
import { TextareaWithPinkScrollbar } from '@/components/ui/textarea-with-pink-scrollbar';

interface EditModeTextareaProps {
  content: string;
  onContentChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  forceEditMode?: boolean;
}

const EditModeTextarea = React.forwardRef<HTMLTextAreaElement, EditModeTextareaProps>(({
  content,
  onContentChange,
  forceEditMode = false
}, ref) => {
  return (
    <TextareaWithPinkScrollbar 
      id="speechContent" 
      className="min-h-[40vh] lg:min-h-[45vh]" 
      value={content} 
      onChange={onContentChange} 
      ref={ref} 
    />
  );
});

EditModeTextarea.displayName = "EditModeTextarea";
export default EditModeTextarea;