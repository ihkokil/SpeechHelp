
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Speech } from '@/types/auth';
import { Badge } from '@/components/ui/badge';
import { ButtonCustom } from '@/components/ui/button-custom';
import { format } from 'date-fns';
import { getSpeechTypeLabel, getTypeColor } from './speech-utils';
import { useTranslation } from '@/translations';
import { useLanguage } from '@/contexts/LanguageContext';
import Translate from '@/components/Translate';
import SpeechPreview from '@/components/speech/components/SpeechPreview';
import { Download, Printer } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import html2pdf from 'html2pdf.js';

interface ViewSpeechModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  speech: Speech | null;
  onEditClick: (speech: Speech) => void;
}

const ViewSpeechModal = ({ isOpen, onOpenChange, speech, onEditClick }: ViewSpeechModalProps) => {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation();
  const { toast } = useToast();

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy h:mm a');
  };

  if (!speech) return null;

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
    const speechTitle = speech.title.trim() || 'speech';
    
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
          ${getSpeechTypeLabel(speech.speech_type)}
        </div>
        <hr style="border: 1px solid #e5e7eb; margin: 16px 0;" />
        <div id="speech-content"></div>
      </div>
    `;
    
    // Get the speech content element
    const speechContentElement = container.querySelector('#speech-content');
    if (speechContentElement) {
      // Create a temporary SpeechPreview instance
      const tempDiv = document.createElement('div');
      tempDiv.style.display = 'none';
      document.body.appendChild(tempDiv);
      
      // Create a temporary instance of SpeechPreview
      const speechPreviewRoot = document.createElement('div');
      tempDiv.appendChild(speechPreviewRoot);
      
      // Clone the current speech preview content
      const currentPreviewContent = document.querySelector('.speech-preview-content');
      if (currentPreviewContent) {
        speechContentElement.innerHTML = currentPreviewContent.innerHTML;
      } else {
        // Fallback: Add formatted content
        const processedContent = extractContentForExport(speech.content);
        speechContentElement.innerHTML = processedContent.replace(/\n/g, '<br>');
      }
      
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
        document.body.removeChild(tempDiv);
        
        toast({
          title: "Download Started",
          description: "Your speech is being downloaded as a PDF file.",
        });
      }).catch(error => {
        console.error("PDF generation error:", error);
        document.body.removeChild(container);
        document.body.removeChild(tempDiv);
        
        toast({
          title: "Error",
          description: "There was an error downloading your speech. Please try again.",
          variant: "destructive"
        });
      });
    }
  };

  // Print the speech content
  const handlePrint = () => {
    const processedContent = extractContentForExport(speech.content);
    const title = speech.title;
    const type = getSpeechTypeLabel(speech.speech_type);
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
          <div class="type">${type}</div>
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

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-xl text-purple-800">{speech.title}</DialogTitle>
          <DialogDescription>
            <Badge className={getTypeColor(speech.speech_type)}>
              {getSpeechTypeLabel(speech.speech_type)}
            </Badge>
          </DialogDescription>
        </DialogHeader>
        <div className="overflow-auto max-h-[60vh] my-4">
          <SpeechPreview content={speech.content} />
        </div>
        <div className="text-sm text-gray-500 mt-2">
          <Translate text="dashboard.created" />: {formatDate(speech.created_at)} | 
          <Translate text="dashboard.lastUpdated" />: {formatDate(speech.updated_at)}
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          <ButtonCustom 
            variant="outline" 
            size="sm"
            onClick={handleDownload}
          >
            <Download className="h-4 w-4 mr-2" />
            <Translate text="common.download" fallback="Download as PDF" />
          </ButtonCustom>
          <ButtonCustom 
            variant="outline" 
            size="sm"
            onClick={handlePrint}
          >
            <Printer className="h-4 w-4 mr-2" />
            <Translate text="common.print" fallback="Print" />
          </ButtonCustom>
        </div>
        <DialogFooter className="mt-4">
          <ButtonCustom 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            <Translate text="common.close" />
          </ButtonCustom>
          <ButtonCustom 
            variant="default" 
            onClick={() => {
              onOpenChange(false);
              onEditClick(speech);
            }}
          >
            <Translate text="common.edit" />
          </ButtonCustom>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewSpeechModal;
