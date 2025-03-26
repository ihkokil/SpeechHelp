
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { TextareaWithPinkScrollbar } from '@/components/ui/textarea-with-pink-scrollbar';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Edit, Eye } from 'lucide-react';
import SpeechPreview from './SpeechPreview';
import Translate from '@/components/Translate';

interface SpeechContentEditorProps {
  content: string;
  onContentChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const SpeechContentEditor: React.FC<SpeechContentEditorProps> = ({ 
  content, 
  onContentChange 
}) => {
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');
  const [processedContent, setProcessedContent] = useState(content);

  // Process JSON content if needed
  useEffect(() => {
    // Try to parse JSON if the content appears to be JSON
    if (content.includes('{"content"')) {
      try {
        const jsonContent = JSON.parse(content);
        setProcessedContent(jsonContent.content || content);
      } catch (e) {
        // If parsing fails, use the original content
        setProcessedContent(content);
      }
    } else {
      setProcessedContent(content);
    }
  }, [content]);

  // Custom handler for content changes to maintain JSON structure if it exists
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    
    // If original content was JSON, maintain that structure
    if (content.includes('{"content"')) {
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
        onContentChange(e);
      }
    } else {
      // If not JSON, just update normally
      onContentChange(e);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <Label 
          htmlFor="speechContent" 
          className="text-pink-600 font-medium uppercase"
        >
          <Translate text="speechLab.content" fallback="Speech Content" />
        </Label>
        
        <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as 'edit' | 'preview')}>
          <ToggleGroupItem value="edit" aria-label="Edit mode" className="px-3 py-1">
            <Edit className="h-5 w-5 mr-1" />
            <Translate text="speechLab.edit" fallback="Edit" />
          </ToggleGroupItem>
          <ToggleGroupItem value="preview" aria-label="Preview mode" className="px-3 py-1">
            <Eye className="h-5 w-5 mr-1" />
            <Translate text="speechLab.preview" fallback="Preview" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {viewMode === 'edit' ? (
        <TextareaWithPinkScrollbar 
          id="speechContent"
          className="min-h-[300px]" 
          value={processedContent}
          onChange={handleContentChange}
        />
      ) : (
        <SpeechPreview content={content} />
      )}
    </div>
  );
};

export default SpeechContentEditor;
