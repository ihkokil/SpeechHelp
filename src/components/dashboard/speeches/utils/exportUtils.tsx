
import { Speech } from '@/types/speech';
import { getSpeechTypeLabel } from '../speech-utils';
import { useToast } from '@/hooks/use-toast';
import { 
  extractContentForExport, 
  formatSpeechContentForPdf 
} from '@/components/speech/utils/pdfFormatters';
import { createPdfFromContent } from '@/components/speech/utils/pdfGenerator';

// Helper function to extract content from speech (re-exported for backward compatibility)
export { extractContentForExport, formatSpeechContentForPdf };

export const useExportFunctions = (speech: Speech | null, title: string, content: string) => {
  const { toast } = useToast();
  
  if (!speech) return { handleDownload: () => {}, handlePrint: () => {} };

  // Download speech as PDF using our refactored function
  const handleDownload = () => {
    if (!speech) return;
    createPdfFromContent(
      title, 
      content, 
      getSpeechTypeLabel(speech.speech_type),
      toast
    );
  };

  // Print the speech content
  const handlePrint = () => {
    const processedContent = extractContentForExport(content);
    const printWindow = window.open('', '_blank');
    
    if (printWindow) {
      // Create a nicely formatted HTML page for printing
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${title} - Print</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 1.5rem;
              line-height: 1.6;
            }
            .title {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 4px;
              color: #6b21a8;
            }
            .type {
              font-size: 14px;
              color: #666;
              margin-bottom: 16px;
            }
            .content {
              white-space: pre-wrap;
              font-size: 14px;
            }
            @media print {
              body {
                margin: 1cm;
              }
            }
          </style>
        </head>
        <body>
          <div class="title">${title}</div>
          <div class="type">${getSpeechTypeLabel(speech.speech_type)}</div>
          <hr />
          <div class="content">${processedContent.replace(/\n/g, '<br>')}</div>
        </body>
        </html>
      `);
      
      printWindow.document.close();
      
      // Trigger print dialog
      printWindow.setTimeout(() => {
        printWindow.print();
      }, 500);
    } else {
      toast({
        title: "Error",
        description: "Unable to open print window. Please check your popup settings.",
        variant: "destructive"
      });
    }
  };

  return { handleDownload, handlePrint };
};
