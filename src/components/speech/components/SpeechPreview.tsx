
import React from 'react';
import { Card } from '@/components/ui/card';

interface SpeechPreviewProps {
  content: string;
}

const SpeechPreview: React.FC<SpeechPreviewProps> = ({ content }) => {
  // Function to convert markdown-like syntax to HTML with better styling
  const formatSpeechContent = (text: string): string => {
    if (!text) return '';
    
    let formattedText = text;
    
    // If the content already contains HTML tags, just return it
    if (formattedText.includes('<h1') || formattedText.includes('<p') || 
        formattedText.includes('<strong') || formattedText.includes('<div')) {
      return formattedText;
    }
    
    // Remove the raw JSON if it appears in the content
    if (formattedText.includes('{"content"')) {
      try {
        const jsonContent = JSON.parse(formattedText);
        formattedText = jsonContent.content || formattedText;
      } catch (e) {
        // If parsing fails, continue with the original text
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

  return (
    <Card className="min-h-[300px] p-6 overflow-y-auto text-left bg-white shadow-sm border border-gray-200">
      <div 
        className="prose prose-pink max-w-none speech-preview-content"
        dangerouslySetInnerHTML={{ __html: formatSpeechContent(content) }} 
      />
    </Card>
  );
};

export default SpeechPreview;
