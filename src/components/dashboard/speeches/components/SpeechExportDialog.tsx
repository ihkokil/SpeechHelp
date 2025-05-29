
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, FileText, Printer, Mail } from 'lucide-react';
import { Speech } from '@/types/speech';
import { useExportFunctions } from '../utils/exportUtils';

interface SpeechExportDialogProps {
  speech: Speech;
  title: string;
  content: string;
  trigger?: React.ReactNode;
}

const SpeechExportDialog: React.FC<SpeechExportDialogProps> = ({
  speech,
  title,
  content,
  trigger
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { handleDownload, handlePrint } = useExportFunctions(speech, title, content);

  const exportOptions = [
    {
      label: 'Download as PDF',
      description: 'Save a formatted PDF copy to your device',
      icon: Download,
      onClick: () => {
        handleDownload();
        setIsOpen(false);
      },
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      label: 'Print',
      description: 'Print the speech directly',
      icon: Printer,
      onClick: () => {
        handlePrint();
        setIsOpen(false);
      },
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      label: 'Copy as Text',
      description: 'Copy speech content to clipboard',
      icon: FileText,
      onClick: () => {
        navigator.clipboard.writeText(content);
        setIsOpen(false);
      },
      color: 'bg-purple-500 hover:bg-purple-600'
    }
  ];

  const defaultTrigger = (
    <Button variant="outline" size="sm">
      <Download className="h-4 w-4 mr-2" />
      Export
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export Speech</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          {exportOptions.map((option, index) => {
            const Icon = option.icon;
            return (
              <Button
                key={index}
                onClick={option.onClick}
                className={`${option.color} text-white w-full justify-start h-auto p-4`}
              >
                <Icon className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">{option.label}</div>
                  <div className="text-sm opacity-90">{option.description}</div>
                </div>
              </Button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SpeechExportDialog;
