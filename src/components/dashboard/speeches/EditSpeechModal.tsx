
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Speech } from '@/types/auth';
import { Input } from '@/components/ui/input';
import { ButtonCustom } from '@/components/ui/button-custom';
import Translate from '@/components/Translate';
import SpeechContentEditor from '@/components/speech/components/SpeechContentEditor';
import { Download, Printer } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getSpeechTypeLabel } from './speech-utils';
import html2pdf from 'html2pdf.js';

interface EditSpeechModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  speech: Speech | null;
  editTitle: string;
  editContent: string;
  setEditTitle: (title: string) => void;
  setEditContent: (content: string) => void;
  onSave: () => void;
}

const EditSpeechModal = ({ 
  isOpen, 
  onOpenChange, 
  speech, 
  editTitle, 
  editContent, 
  setEditTitle, 
  setEditContent, 
  onSave 
}: EditSpeechModalProps) => {
  const { toast } = useToast();
  
  if (!speech) return null;

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditContent(e.target.value);
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
    const speechTitle = editTitle.trim() || 'speech';
    
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
      // Get the formatted content
      const processedContent = extractContentForExport(editContent);
      
      // Create a temporary SpeechPreview element to get formatted HTML
      const tempDiv = document.createElement('div');
      tempDiv.style.display = 'none';
      document.body.appendChild(tempDiv);
      
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
    const processedContent = extractContentForExport(editContent);
    const title = editTitle;
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
          <DialogTitle><Translate text="dashboard.editSpeech" /></DialogTitle>
          <DialogDescription>
            <Translate text="dashboard.editSpeechDesc" />
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label htmlFor="editTitle" className="text-sm font-medium">
              <Translate text="common.title" />
            </label>
            <Input
              id="editTitle"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <SpeechContentEditor 
              content={editContent}
              onContentChange={handleContentChange}
            />
          </div>
          <div className="flex flex-wrap gap-2">
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
        </div>
        <DialogFooter className="mt-4">
          <ButtonCustom 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            <Translate text="common.cancel" />
          </ButtonCustom>
          <ButtonCustom 
            variant="default" 
            onClick={onSave}
          >
            <Translate text="common.saveChanges" />
          </ButtonCustom>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditSpeechModal;
