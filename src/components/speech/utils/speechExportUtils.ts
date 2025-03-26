
import html2pdf from 'html2pdf.js';
import { useToast } from "@/hooks/use-toast";

export const createPdfFromContent = (title: string, content: string, speechType: string, toast: ReturnType<typeof useToast>['toast']) => {
  const speechTitle = title.trim() || 'speech';
  
  const container = document.createElement('div');
  document.body.appendChild(container);
  
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
  
  const speechContentElement = container.querySelector('#speech-content');
  if (speechContentElement) {
    const processedContent = extractContentForExport(content);
    speechContentElement.innerHTML = formatSpeechContentForPdf(processedContent);
    
    const options = {
      margin: [15, 15, 15, 15],
      filename: `${speechTitle}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    return html2pdf().from(container).set(options).save().then(() => {
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

export const extractContentForExport = (content: string): string => {
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

const formatSpeechContentForPdf = (text: string): string => {
  if (!text) return '';
  
  let formattedText = text;
  
  if (formattedText.includes('{"content"')) {
    try {
      const jsonContent = JSON.parse(formattedText);
      formattedText = jsonContent.content || formattedText;
    } catch (e) {
      console.log('Failed to parse JSON content');
    }
  }
  
  formattedText = formattedText.replace(/^# (.+)$/gm, '<h1 style="font-size: 24px; font-weight: bold; margin-bottom: 16px; color: #6b21a8;">$1</h1>');
  formattedText = formattedText.replace(/^## (.+)$/gm, '<h2 style="font-size: 20px; font-weight: bold; margin-top: 24px; margin-bottom: 12px; color: #6b21a8;">$1</h2>');
  formattedText = formattedText.replace(/^### (.+)$/gm, '<h3 style="font-size: 18px; font-weight: bold; margin-top: 20px; margin-bottom: 8px; color: #6b21a8;">$1</h3>');
  
  formattedText = formattedText.replace(/\*\*(.+?)\*\*/g, '<strong style="font-weight: bold;">$1</strong>');
  
  formattedText = formattedText.replace(/\*(.+?)\*/g, '<em style="font-style: italic;">$1</em>');
  
  formattedText = formattedText.replace(/^---$/gm, '<hr style="border: 1px solid #e5e7eb; margin: 16px 0;" />');
  
  formattedText = formattedText.replace(/\n\n/g, '</p><p style="margin-bottom: 16px;">');
  
  if (formattedText.includes('Your Speech Inputs')) {
    formattedText = formattedText.replace(
      /(Your Speech Inputs.*?)---/s, 
      '<div style="background-color: #f5f3ff; padding: 16px; border-radius: 6px; margin-bottom: 24px; border: 1px solid #e9d5ff;">$1</div>'
    );
  }
  
  formattedText = formattedText.replace(
    /<strong style="font-weight: bold;">(.+?)<\/strong> (.+?)(?=<\/p>|<strong|$)/g, 
    '<div style="margin-bottom: 8px;"><span style="font-weight: 500; color: #7e22ce;">$1:</span> <span style="color: #1f2937;">$2</span></div>'
  );
  
  formattedText = `<p style="margin-bottom: 16px;">${formattedText}</p>`;
  
  formattedText = formattedText.replace(/<p style="margin-bottom: 16px;"><p style="margin-bottom: 16px;">/g, '<p style="margin-bottom: 16px;">');
  formattedText = formattedText.replace(/<\/p><\/p>/g, '</p>');
  
  return formattedText;
};
