
import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import SpeechContentEditor from '@/components/speech/components/SpeechContentEditor';
import SpeechExportButtons from './SpeechExportButtons';
import { Speech } from '@/types/auth';
import Translate from '@/components/Translate';

interface EditSpeechFormProps {
  speech: Speech | null;
  editTitle: string;
  editContent: string;
  setEditTitle: (title: string) => void;
  setEditContent: (content: string) => void;
}

const EditSpeechForm: React.FC<EditSpeechFormProps> = ({
  speech,
  editTitle,
  editContent,
  setEditTitle,
  setEditContent
}) => {
  const [processedContent, setProcessedContent] = useState(editContent);
  
  // Process content initially and when editContent changes
  useEffect(() => {
    setProcessedContent(editContent);
  }, [editContent]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setEditContent(newContent);
  };

  if (!speech) return null;

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="editTitle" className="text-sm font-medium">
          <Translate text="common.title" />
        </label>
        <Input
          id="editTitle"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className="w-full"
        />
      </div>
      <div>
        <SpeechContentEditor 
          content={editContent}
          onContentChange={handleContentChange}
        />
      </div>
      <SpeechExportButtons 
        speech={speech}
        title={editTitle}
        content={editContent}
      />
    </div>
  );
};

export default EditSpeechForm;
