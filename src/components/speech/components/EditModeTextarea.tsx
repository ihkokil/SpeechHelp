import React from 'react';
import { Label } from '@/components/ui/label';
import { TextareaWithPinkScrollbar } from '@/components/ui/textarea-with-pink-scrollbar';
import Translate from '@/components/Translate';
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
  return <>
        {forceEditMode}
        <TextareaWithPinkScrollbar id="speechContent" className="min-h-[300px]" value={content} onChange={onContentChange} ref={ref} />
      </>;
});
EditModeTextarea.displayName = "EditModeTextarea";
export default EditModeTextarea;