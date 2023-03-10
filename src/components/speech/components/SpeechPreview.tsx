
import React from 'react';
import { Card } from '@/components/ui/card';

interface SpeechPreviewProps {
  content: string;
}

const SpeechPreview: React.FC<SpeechPreviewProps> = ({ content }) => {
  // Function to convert markdown-like syntax to HTML
  const formatSpeechContent = (text: string): string => {
    if (!text) return '';
    
    let formattedText = text;
    
    // Handle headings
    formattedText = formattedText.replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mb-4 text-purple-800">$1</h1>');
    formattedText = formattedText.replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold mt-6 mb-3 text-purple-700">$1</h2>');
    formattedText = formattedText.replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold mt-5 mb-2 text-purple-600">$1</h3>');
    
    // Handle bold text
    formattedText = formattedText.replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold">$1</strong>');
    
    // Handle italic text
    formattedText = formattedText.replace(/\*(.+?)\*/g, '<em class="italic">$1</em>');
    
    // Handle paragraphs (add spacing between them)
    formattedText = formattedText.replace(/\n\n/g, '</p><p class="mb-4">');
    
    // Handle horizontal rule
    formattedText = formattedText.replace(/^---$/gm, '<hr class="my-6 border-t border-gray-300" />');
    
    // Wrap the content in a paragraph tag
    formattedText = `<p class="mb-4">${formattedText}</p>`;
    
    return formattedText;
  };

  return (
    <Card className="min-h-[300px] p-6 overflow-y-auto text-left bg-white shadow-sm border border-gray-200">
      <div 
        className="prose prose-pink max-w-none"
        dangerouslySetInnerHTML={{ __html: formatSpeechContent(content) }} 
      />
    </Card>
  );
};

export default SpeechPreview;
