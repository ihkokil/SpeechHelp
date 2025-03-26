
import html2pdf from 'html2pdf.js';
import { useToast } from "@/hooks/use-toast";
import { pdfStyles, pdfOptions } from './pdfStyles';
import { formatSpeechContentForPdf, extractContentForExport } from './pdfFormatters';

/**
 * Creates and downloads a PDF from speech content
 * @param title Speech title
 * @param content Speech content
 * @param speechType Type of speech
 * @param toast Toast notification function
 * @returns Promise that resolves when PDF is generated
 */
export const createPdfFromContent = (
  title: string, 
  content: string, 
  speechType: string, 
  toast: ReturnType<typeof useToast>['toast']
) => {
  const speechTitle = title.trim() || 'speech';
  
  // Create a container for the PDF content
  const container = document.createElement('div');
  document.body.appendChild(container);
  
  // Enhanced styling for the PDF
  container.innerHTML = `
    <div style="${pdfStyles.container}">
      <div style="${pdfStyles.title}">
        ${speechTitle}
      </div>
      <div style="${pdfStyles.subtitle}">
        ${speechType}
      </div>
      <hr style="${pdfStyles.divider}" />
      <div id="speech-content"></div>
    </div>
  `;
  
  const speechContentElement = container.querySelector('#speech-content');
  if (speechContentElement) {
    // Process and format the content
    const processedContent = extractContentForExport(content);
    speechContentElement.innerHTML = formatSpeechContentForPdf(processedContent);
    
    // Configure PDF options with custom filename
    const options = {
      ...pdfOptions,
      filename: `${speechTitle}.pdf`
    };
    
    // Generate and download the PDF
    return html2pdf().from(container).set(options).save().then(() => {
      // Clean up the temporary container
      document.body.removeChild(container);
      
      // Show success toast
      toast({
        title: "Download Started",
        description: "Your speech is being downloaded as a PDF file.",
      });
    }).catch(error => {
      console.error("PDF generation error:", error);
      document.body.removeChild(container);
      
      // Show error toast
      toast({
        title: "Error",
        description: "There was an error downloading your speech. Please try again.",
        variant: "destructive"
      });
    });
  }
};
