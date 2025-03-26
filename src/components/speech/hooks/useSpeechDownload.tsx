
import { useToast } from "@/hooks/use-toast";
import { createPdfFromContent } from '../utils/pdfGenerator';

interface UseSpeechDownloadProps {
  title: string;
  content: string; 
  speechType: string;
}

export const useSpeechDownload = ({ title, content, speechType }: UseSpeechDownloadProps) => {
  const { toast } = useToast();
  
  const handleDownload = () => {
    createPdfFromContent(title, content, speechType, toast);
  };

  return { handleDownload };
};
