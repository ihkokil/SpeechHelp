
import React, { useState } from 'react';
import SpeechTitleInput from './SpeechTitleInput';
import SpeechContentEditor from './SpeechContentEditor';
import SpeechActionButtons from './SpeechActionButtons';
import { useIsMobile } from '@/hooks/use-mobile';

interface SpeechEditorProps {
  title: string;
  content: string;
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onContentChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onDownload: () => void;
  onReset: () => void;
}

const SpeechEditor: React.FC<SpeechEditorProps> = ({
  title,
  content,
  onTitleChange,
  onContentChange,
  onDownload,
  onReset
}) => {
  const isMobile = useIsMobile();
  
  return (
    <div className={`space-y-4 ${isMobile ? '' : 'space-y-8'}`}>
      <SpeechTitleInput 
        title={title} 
        onTitleChange={onTitleChange} 
      />
      
      <SpeechContentEditor 
        content={content} 
        onContentChange={onContentChange}
        preserveHtml={true}
      />
      
      <SpeechActionButtons 
        content={content}
        title={title}
        onDownload={onDownload} 
        onReset={onReset} 
      />
    </div>
  );
};

export default SpeechEditor;
