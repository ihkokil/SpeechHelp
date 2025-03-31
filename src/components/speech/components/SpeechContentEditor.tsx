
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
  const [processedContent, setProcessedContent] = useState(content || '');
  const [htmlContent, setHtmlContent] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Log initial content for debugging
  useEffect(() => {
    console.log('SpeechContentEditor initialized with content:', { 
      rawContent: content,
      preserveHtml,
      forceEditMode,
      showFormattedContent
    });
  }, []);

  // Process content on initial load and when content changes
  useEffect(() => {
    console.log('Content changed, processing:', content);
    
    // Make sure we have content to display
    if (!content) {
      console.warn('No content provided to SpeechContentEditor');
      setProcessedContent('');
      setHtmlContent('');
      return;
    }

    // Try to format the content properly for the editor
    let extractedContent = content;
    
    // If it's JSON content, extract the actual content
    if (content.includes('{"content"')) {
      try {
        const jsonContent = JSON.parse(content);
        extractedContent = jsonContent.content || content;
        console.log('Extracted content from JSON:', extractedContent);
      } catch (e) {
        console.error('Failed to parse JSON content', e);
      }
    }
    
    setProcessedContent(extractedContent);
    
    // Generate HTML representation for preview mode
    const formattedHtml = formatSpeechContent(extractedContent);
    setHtmlContent(formattedHtml);
    
  }, [content, preserveHtml, showFormattedContent]);

  // Custom handler for content changes
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setProcessedContent(newValue);
    
    // Just pass the updated value directly
    onContentChange({
      ...e,
      target: {
        ...e.target,
        value: newValue
      }
    } as React.ChangeEvent<HTMLTextAreaElement>);
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
            <Translate text="speechLab.content" fallback="Speech Content" />
          </Label>
          
          <ViewModeToggle viewMode={viewMode} onViewModeChange={handleViewModeChange} />
        </div>
      )}

      {viewMode === 'edit' ? (
        <EditModeTextarea
          content={processedContent}
          onContentChange={handleContentChange}
          forceEditMode={forceEditMode}
          ref={textareaRef}
        />
      ) : (
        <SpeechPreview content={content} />
      )}
    </div>
  );
};

export default SpeechContentEditor;
