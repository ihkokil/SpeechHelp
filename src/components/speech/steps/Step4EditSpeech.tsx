
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ButtonCustom } from '@/components/ui/button-custom';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Download, RefreshCw, Copy, Check } from 'lucide-react';
import Translate from '@/components/Translate';
import { useToast } from '@/hooks/use-toast';

interface Step4Props {
  prevStep: () => void;
  generatedSpeech: string;
  speechTitle?: string;
}

const Step4EditSpeech: React.FC<Step4Props> = ({ 
  prevStep, 
  generatedSpeech, 
  speechTitle = "My Speech" 
}) => {
  const [speechContent, setSpeechContent] = useState(generatedSpeech || "Your speech will appear here once generated.");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(speechContent);
    setCopied(true);
    toast({
      title: "Copied to clipboard",
      description: "Speech content has been copied to your clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([speechContent], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${speechTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Speech Downloaded",
      description: "Your speech has been downloaded as a text file",
    });
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset the speech content? This action cannot be undone.")) {
      setSpeechContent(generatedSpeech);
      toast({
        title: "Speech Reset",
        description: "Your speech has been reset to the original generated content",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle><Translate text="speechLab.editTitle" /></CardTitle>
        <CardDescription><Translate text="speechLab.editDesc" /></CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Textarea 
          className="min-h-[400px] font-medium leading-relaxed" 
          value={speechContent}
          onChange={(e) => setSpeechContent(e.target.value)}
        />
        
        <div className="flex flex-wrap gap-2">
          <ButtonCustom variant="outline" size="sm" onClick={handleDownload}>
            <Translate text="speechLab.downloadButton" />
            <Download className="ml-2 h-4 w-4" />
          </ButtonCustom>
          <ButtonCustom variant="outline" size="sm" onClick={handleReset}>
            <Translate text="speechLab.resetButton" />
            <RefreshCw className="ml-2 h-4 w-4" />
          </ButtonCustom>
          <ButtonCustom variant="outline" size="sm" onClick={handleCopy}>
            {copied ? (
              <>
                <Translate text="speechLab.copied" fallback="Copied" />
                <Check className="ml-2 h-4 w-4" />
              </>
            ) : (
              <>
                <Translate text="speechLab.copy" fallback="Copy" />
                <Copy className="ml-2 h-4 w-4" />
              </>
            )}
          </ButtonCustom>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <ButtonCustom onClick={prevStep} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          <Translate text="speechLab.backButton" />
        </ButtonCustom>
        <ButtonCustom variant="magenta">
          <Translate text="speechLab.saveButton" />
        </ButtonCustom>
      </CardFooter>
    </Card>
  );
};

export default Step4EditSpeech;
