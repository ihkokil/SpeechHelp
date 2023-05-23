
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

  // Download speech as a text file
  const handleDownload = () => {
    const processedContent = extractContentForExport(editContent);
    const blob = new Blob([processedContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${editTitle.trim() || 'speech'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Download Started",
      description: "Your speech is being downloaded as a text file.",
    });
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
              <Translate text="common.download" fallback="Download" />
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
