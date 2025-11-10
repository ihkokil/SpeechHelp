
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
      speechTitle: speech?.title,
      editTitle,
      editContentLength: editContent?.length || 0,
      hasEditContent: Boolean(editContent)
    });
  }, [speech, editTitle, editContent]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setEditContent(newContent);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditTitle(e.target.value);
  };

  if (!speech) {
    console.log('EditSpeechForm: No speech provided');
    return null;
  }

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="editTitle" className="text-sm font-medium">
          <Translate text="common.title" />
        </label>
        <Input
          id="editTitle"
          value={editTitle}
          onChange={handleTitleChange}
          className="w-full"
          placeholder="Enter speech title..."
        />
      </div>
      <div className="mt-4">
        <div className="flex justify-between items-center mb-2">
          <label className="text-pink-600 font-medium uppercase">
            <Translate text="speechLab.generatedSpeech" fallback="Generated Speech" />
          </label>
          <div className="flex bg-gray-100 rounded-md p-1">
            <button 
              onClick={() => setViewMode('edit')}
              className={`px-3 py-1 text-sm rounded-md flex items-center transition-colors ${
                viewMode === 'edit' 
                  ? 'bg-white shadow-sm text-gray-900' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
              <Translate text="speechLab.edit" fallback="Edit" />
            </button>
            <button 
              onClick={() => setViewMode('preview')}
              className={`px-3 py-1 text-sm rounded-md flex items-center transition-colors ${
                viewMode === 'preview' 
                  ? 'bg-white shadow-sm text-gray-900' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              disabled={!editContent.trim()}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
              <Translate text="speechLab.preview" fallback="Preview" />
            </button>
          </div>
        </div>
        
        {viewMode === 'edit' ? (
          <SpeechContentEditor 
            content={editContent}  
            onContentChange={handleContentChange}
            preserveHtml={false}
            forceEditMode={true}
            showFormattedContent={false}
          />
        ) : (
          <SpeechPreview content={editContent} />
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
