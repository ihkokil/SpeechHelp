
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import SpeechContentEditor from '@/components/speech/components/SpeechContentEditor';
import SpeechExportButtons from './SpeechExportButtons';
import { Speech } from '@/types/speech';
import Translate from '@/components/Translate';
import SpeechPreview from '@/components/speech/components/SpeechPreview';

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
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');
  
  // Debug logs
  useEffect(() => {
    console.log('EditSpeechForm rendered with:', {
      speechId: speech?.id,
      editTitle,
      editContent: editContent ? `${editContent.substring(0, 50)}...` : 'empty'
    });
  }, [speech, editTitle, editContent]);

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
      <div className="mt-4">
        {viewMode === 'edit' ? (
          <SpeechContentEditor 
            content={editContent}  
            onContentChange={handleContentChange}
            preserveHtml={false}
            forceEditMode={true}
            showFormattedContent={false}
          />
        ) : (
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-pink-600 font-medium uppercase">
                <Translate text="speechLab.content" fallback="Speech Content" />
              </label>
              <button 
                onClick={() => setViewMode('edit')}
                className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                <Translate text="speechLab.edit" fallback="Edit" />
              </button>
            </div>
            <SpeechPreview content={editContent} />
          </div>
        )}
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
