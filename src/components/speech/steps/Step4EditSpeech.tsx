
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ButtonCustom } from '@/components/ui/button-custom';
import { ArrowLeft, Save } from 'lucide-react';
import Translate from '@/components/Translate';
import { useToast } from "@/hooks/use-toast";
import SpeechTitleInput from '../components/SpeechTitleInput';
import SpeechContentEditor from '../components/SpeechContentEditor';
import SpeechActionButtons from '../components/SpeechActionButtons';
import { useSpeechSave } from '../hooks/useSpeechSave';
import { createPlaceholderSpeech } from '../utils/speechContentUtils';

interface Step4Props {
  prevStep: () => void;
  speechTitle: string;
  speechType: string;
  onTitleChange: (title: string) => void;
  speechDetails?: Record<string, string>;
}

const Step4EditSpeech: React.FC<Step4Props> = ({ 
  prevStep, 
  speechTitle, 
  speechType,
  onTitleChange,
  speechDetails = {}
}) => {
  const [title, setTitle] = useState(speechTitle);
  const [content, setContent] = useState('');
  const { toast } = useToast();

  // Setup save functionality hook
  const { isSaving, handleSave } = useSpeechSave({
    title,
    content,
    speechType,
    speechDetails
  });

  useEffect(() => {
    setTitle(speechTitle);
  }, [speechTitle]);

  useEffect(() => {
    const savedSpeech = localStorage.getItem('generatedSpeech');
    if (savedSpeech) {
      setContent(savedSpeech);
    } else {
      const placeholderSpeech = createPlaceholderSpeech(title, speechDetails);
      setContent(placeholderSpeech);
    }
  }, []);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    onTitleChange(e.target.value);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  // Extract the proper content from speech
  const extractContentForExport = (content: string): string => {
    if (content.includes('{"content"')) {
      try {
        const jsonContent = JSON.parse(content);
        return jsonContent.content || content;
      } catch (e) {
        return content;
      }
    }
    return content;
  };

  // Download speech as PDF
  const handleDownload = () => {
    const speechTitle = title.trim() || 'speech';
    
    // Create a temporary div to hold the formatted content
    const container = document.createElement('div');
    document.body.appendChild(container);
    
    // Create styled content for the PDF
    container.innerHTML = `
      <div style="font-family: Arial, sans-serif; margin: 20px; line-height: 1.6;">
        <div style="font-size: 24px; font-weight: bold; margin-bottom: 8px; color: #6b21a8;">
          ${speechTitle}
        </div>
        <div style="font-size: 14px; color: #666; margin-bottom: 16px;">
          ${speechType}
        </div>
        <hr style="border: 1px solid #e5e7eb; margin: 16px 0;" />
        <div id="speech-content"></div>
      </div>
    `;
    
    // Get the speech content element
    const speechContentElement = container.querySelector('#speech-content');
    if (speechContentElement) {
      // Get the formatted content
      const processedContent = extractContentForExport(content);
      
      // Format content with the same formatting function as SpeechPreview
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
        formattedText = formattedText.replace(/^# (.+)$/gm, '<h1 style="font-size: 24px; font-weight: bold; margin-bottom: 16px; color: #6b21a8;">$1</h1>');
        formattedText = formattedText.replace(/^## (.+)$/gm, '<h2 style="font-size: 20px; font-weight: bold; margin-top: 24px; margin-bottom: 12px; color: #6b21a8;">$1</h2>');
        formattedText = formattedText.replace(/^### (.+)$/gm, '<h3 style="font-size: 18px; font-weight: bold; margin-top: 20px; margin-bottom: 8px; color: #6b21a8;">$1</h3>');
        
        // Handle bold text
        formattedText = formattedText.replace(/\*\*(.+?)\*\*/g, '<strong style="font-weight: bold;">$1</strong>');
        
        // Handle italic text
        formattedText = formattedText.replace(/\*(.+?)\*/g, '<em style="font-style: italic;">$1</em>');
        
        // Handle horizontal rule with a more prominent styling
        formattedText = formattedText.replace(/^---$/gm, '<hr style="border: 1px solid #e5e7eb; margin: 16px 0;" />');
        
        // Add spacing between paragraphs
        formattedText = formattedText.replace(/\n\n/g, '</p><p style="margin-bottom: 16px;">');
        
        // Handle "Your Speech Inputs" section
        if (formattedText.includes('Your Speech Inputs')) {
          formattedText = formattedText.replace(
            /(Your Speech Inputs.*?)---/s, 
            '<div style="background-color: #f5f3ff; padding: 16px; border-radius: 6px; margin-bottom: 24px; border: 1px solid #e9d5ff;">$1</div>'
          );
        }
        
        // Make question-answer pairs in the input section more readable
        formattedText = formattedText.replace(
          /<strong style="font-weight: bold;">(.+?)<\/strong> (.+?)(?=<\/p>|<strong|$)/g, 
          '<div style="margin-bottom: 8px;"><span style="font-weight: 500; color: #7e22ce;">$1:</span> <span style="color: #1f2937;">$2</span></div>'
        );
        
        // Wrap the content in a paragraph tag with proper spacing
        formattedText = `<p style="margin-bottom: 16px;">${formattedText}</p>`;
        
        // Fix any double wrapping of paragraph tags
        formattedText = formattedText.replace(/<p style="margin-bottom: 16px;"><p style="margin-bottom: 16px;">/g, '<p style="margin-bottom: 16px;">');
        formattedText = formattedText.replace(/<\/p><\/p>/g, '</p>');
        
        return formattedText;
      };

      speechContentElement.innerHTML = formatSpeechContent(processedContent);
      
      // Configure PDF options
      const options = {
        margin: [15, 15, 15, 15],
        filename: `${speechTitle}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      
      // Generate PDF
      html2pdf().from(container).set(options).save().then(() => {
        // Clean up
        document.body.removeChild(container);
        
        toast({
          title: "Download Started",
          description: "Your speech is being downloaded as a PDF file.",
        });
      }).catch(error => {
        console.error("PDF generation error:", error);
        document.body.removeChild(container);
        
        toast({
          title: "Error",
          description: "There was an error downloading your speech. Please try again.",
          variant: "destructive"
        });
      });
    }
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset your speech? This will clear all your changes.")) {
      const savedSpeech = localStorage.getItem('generatedSpeech');
      if (savedSpeech) {
        setContent(savedSpeech);
      } else {
        setContent(createPlaceholderSpeech(title, speechDetails));
      }
      
      toast({
        title: "Speech Reset",
        description: "Your speech has been reset to the original generated content.",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle><Translate text="speechLab.editTitle" /></CardTitle>
        <CardDescription><Translate text="speechLab.editDesc" /></CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <SpeechTitleInput 
          title={title} 
          onTitleChange={handleTitleChange} 
        />
        
        <SpeechContentEditor 
          content={content} 
          onContentChange={handleContentChange}
          preserveHtml={true}
        />
        
        <SpeechActionButtons 
          content={content}
          title={title}
          onDownload={handleDownload} 
          onReset={handleReset} 
        />
      </CardContent>
      <CardFooter className="flex justify-between">
        <ButtonCustom onClick={prevStep} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          <Translate text="speechLab.backButton" />
        </ButtonCustom>
        <ButtonCustom 
          variant="magenta" 
          onClick={handleSave}
          disabled={isSaving || !title.trim() || !content.trim()}
        >
          {isSaving ? (
            <span className="inline-flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <Translate text="common.saving" fallback="Saving..." />
            </span>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              <Translate text="speechLab.saveButton" />
            </>
          )}
        </ButtonCustom>
      </CardFooter>
    </Card>
  );
};

export default Step4EditSpeech;
