
import React, { useState, useEffect, useRef } from 'react';
import { Label } from '@/components/ui/label';
import { TextareaWithPinkScrollbar } from '@/components/ui/textarea-with-pink-scrollbar';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Edit, Eye } from 'lucide-react';
import SpeechPreview from './SpeechPreview';
import Translate from '@/components/Translate';

interface SpeechContentEditorProps {
  content: string;
  onContentChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  preserveHtml?: boolean;
}

const SpeechContentEditor: React.FC<SpeechContentEditorProps> = ({ 
  content, 
  onContentChange,
  preserveHtml = false
}) => {
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');
  const [processedContent, setProcessedContent] = useState(content);
  const [htmlContent, setHtmlContent] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Process content on initial load and when content changes
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

    // Generate HTML representation for the editor when in preview mode
    const formattedHtml = formatSpeechContent(content);
    setHtmlContent(formattedHtml);
  }, [content]);

  // Format content for preview - same function as in SpeechPreview
  const formatSpeechContent = (text: string): string => {
    if (!text) return '';
    
    let formattedText = text;
    
    // Remove the raw JSON if it appears in the content
    if (formattedText.includes('{"content"')) {
      try {
        const jsonContent = JSON.parse(formattedText);
        formattedText = jsonContent.content || formattedText;
      } catch (e) {
        console.log('Failed to parse JSON content');
      }
    }
    
    // Handle headings with improved styling
    formattedText = formattedText.replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mb-4 text-purple-800">$1</h1>');
    formattedText = formattedText.replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold mt-6 mb-3 text-purple-700">$1</h2>');
    formattedText = formattedText.replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold mt-5 mb-2 text-purple-600">$1</h3>');
    
    // Handle bold text
    formattedText = formattedText.replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold">$1</strong>');
    
    // Handle italic text
    formattedText = formattedText.replace(/\*(.+?)\*/g, '<em class="italic">$1</em>');
    
    // Handle horizontal rule with a more prominent styling
    formattedText = formattedText.replace(/^---$/gm, '<hr class="my-6 border-t-2 border-purple-300" />');
    
    // Add spacing between paragraphs
    formattedText = formattedText.replace(/\n\n/g, '</p><p class="mb-4">');
    
    // Handle "Your Speech Inputs" section
    if (formattedText.includes('Your Speech Inputs')) {
      formattedText = formattedText.replace(
        /(Your Speech Inputs.*?)---/s, 
        '<div class="bg-purple-50 p-4 rounded-md mb-6 border border-purple-200">$1</div>'
      );
    }
    
    // Make question-answer pairs in the input section more readable
    formattedText = formattedText.replace(
      /<strong class="font-bold">(.+?)<\/strong> (.+?)(?=<\/p>|<strong|$)/g, 
      '<div class="mb-2"><span class="font-medium text-purple-700">$1:</span> <span class="text-gray-800">$2</span></div>'
    );
    
    // Wrap the content in a paragraph tag with proper spacing
    formattedText = `<p class="mb-4">${formattedText}</p>`;
    
    // Fix any double wrapping of paragraph tags
    formattedText = formattedText.replace(/<p class="mb-4"><p class="mb-4">/g, '<p class="mb-4">');
    formattedText = formattedText.replace(/<\/p><\/p>/g, '</p>');
    
    return formattedText;
  };

  // Custom handler for content changes to maintain JSON structure if it exists
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setProcessedContent(newValue);
    
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
          value={preserveHtml ? content : processedContent}
          onChange={handleContentChange}
          ref={textareaRef}
        />
      ) : (
        <SpeechPreview content={content} />
      )}
    </div>
  );
};

export default SpeechContentEditor;
