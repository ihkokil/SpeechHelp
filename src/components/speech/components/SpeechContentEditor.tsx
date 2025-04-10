
import React, { useState, useEffect, useRef } from 'react';
import { Label } from '@/components/ui/label';
import SpeechPreview from './SpeechPreview';
import Translate from '@/components/Translate';
import ViewModeToggle from './ViewModeToggle';
import EditModeTextarea from './EditModeTextarea';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslationService } from '@/services/translationService';

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
  const { currentLanguage } = useLanguage();
  const { translateSpeechContent } = useTranslationService();
  const [contentLanguage, setContentLanguage] = useState<string>(currentLanguage.code);

  // Process content on initial load and when content changes
  useEffect(() => {
    console.log('SpeechContentEditor received content:', typeof content, content ? `${content.substring(0, 50)}...` : 'empty');
    
    if (content) {
      // Check if content is in JSON format with language metadata
      try {
        const parsedContent = JSON.parse(content);
        if (parsedContent.metadata?.language && parsedContent.metadata.language !== currentLanguage.code) {
          // Content is in a different language, we should process it
          setContentLanguage(parsedContent.metadata.language);
          handleLanguageChange(parsedContent);
          return;
        }
      } catch (e) {
        // Not JSON or can't parse, just use as is
      }
      
      setDisplayContent(content);
    } else {
      setDisplayContent('');
    }
  }, [content, preserveHtml, showFormattedContent]);

  // Handle language change when the user switches languages
  const handleLanguageChange = async (parsedContent: any) => {
    // In a full implementation, this would translate content to the current language
    // For demo purposes, we'll just update metadata
    if (parsedContent.content) {
      setDisplayContent(parsedContent.content);
    } else {
      setDisplayContent(content);
    }
  };

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
            <Translate text="speechLab.content" fallback="Speech Content" />
          </Label>
          
          <ViewModeToggle viewMode={viewMode} onViewModeChange={handleViewModeChange} />
        </div>
      )}

      {contentLanguage !== currentLanguage.code && (
        <div className="mb-3 px-3 py-2 bg-amber-50 border border-amber-200 rounded-md text-amber-800 text-sm">
          <Translate text="speechLab.differentLanguage" fallback={`This speech was created in a different language (${contentLanguage}). Some content may not appear correctly.`} />
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
