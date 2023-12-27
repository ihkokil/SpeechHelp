
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
  const [processedContent, setProcessedContent] = useState(content);
  const [htmlContent, setHtmlContent] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Process content on initial load and when content changes
  useEffect(() => {
    // Extract content appropriately
    const extractedContent = getEditableContent(content, preserveHtml, showFormattedContent);
    setProcessedContent(extractedContent);

    // Generate HTML representation for the editor when in preview mode
    const formattedHtml = formatSpeechContent(content);
    setHtmlContent(formattedHtml);
  }, [content, preserveHtml, showFormattedContent]);

  // Custom handler for content changes to maintain JSON structure if it exists
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setProcessedContent(newValue);
    
    // If original content was JSON and we need to preserve structure
    if (content && content.includes('{"content"') && preserveHtml) {
      try {
        const jsonContent = JSON.parse(content);
        // Create new event with updated content structure
        const newEvent = {
          ...e,
          target: {
            ...e.target,
            value: JSON.stringify({
              ...jsonContent,
              content: newValue
            })
          }
        };
        onContentChange(newEvent as React.ChangeEvent<HTMLTextAreaElement>);
      } catch (e) {
        // If JSON parsing fails, just update with the raw value
        onContentChange({
          ...e,
          target: {
            ...e.target,
            value: newValue
          }
        } as React.ChangeEvent<HTMLTextAreaElement>);
      }
    } else {
      // If not JSON, just update normally
      onContentChange({
        ...e,
        target: {
          ...e.target,
          value: newValue
        }
      } as React.ChangeEvent<HTMLTextAreaElement>);
    }
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
