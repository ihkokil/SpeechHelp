
import React, { useState, useEffect, useRef } from 'react';
import { Label } from '@/components/ui/label';
import SpeechPreview from './SpeechPreview';
import Translate from '@/components/Translate';
import ViewModeToggle from './ViewModeToggle';
import EditModeTextarea from './EditModeTextarea';
import { formatSpeechContent, getEditableContent } from '../utils/speechFormattingUtils';

interface SpeechContentEditorProps {
  content: string;
  onContentChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  preserveHtml?: boolean;
  forceEditMode?: boolean;
  showFormattedContent?: boolean;
}

const SpeechContentEditor: React.FC<SpeechContentEditorProps> = ({ 
  content, 
  onContentChange,
  preserveHtml = false,
  forceEditMode = false,
  showFormattedContent = false
}) => {
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>(forceEditMode ? 'edit' : 'edit');
  const [displayContent, setDisplayContent] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Process content on initial load and when content changes
  useEffect(() => {
    console.log('SpeechContentEditor received content:', typeof content, content ? `${content.substring(0, 50)}...` : 'empty');
    
    if (content) {
      setDisplayContent(content);
    } else {
      setDisplayContent('');
    }
  }, [content, preserveHtml, showFormattedContent]);

  // Custom handler for content changes
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setDisplayContent(newValue);
    onContentChange(e);
  };

  const handleViewModeChange = (mode: 'edit' | 'preview') => {
    setViewMode(mode);
  };

  return (
    <div>
      {!forceEditMode && (
        <div className="flex items-center justify-between mb-2">
          <Label 
            htmlFor="speechContent" 
            className="text-pink-600 font-medium uppercase"
          >
            <Translate text="speechLab.generatedSpeech" fallback="Generated Speech" />
          </Label>
          
          <ViewModeToggle viewMode={viewMode} onViewModeChange={handleViewModeChange} />
        </div>
      )}

      {viewMode === 'edit' ? (
        <EditModeTextarea
          content={displayContent}
          onContentChange={handleContentChange}
          forceEditMode={forceEditMode}
          ref={textareaRef}
        />
      ) : (
        <SpeechPreview content={displayContent} />
      )}
    </div>
  );
};

export default SpeechContentEditor;
