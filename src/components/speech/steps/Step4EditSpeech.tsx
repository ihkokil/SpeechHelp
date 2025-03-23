
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ButtonCustom } from '@/components/ui/button-custom';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Download, RefreshCw, Copy, Check } from 'lucide-react';
import Translate from '@/components/Translate';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface Step4Props {
  prevStep: () => void;
  generatedSpeech: string;
  speechTitle?: string;
  selectedSpeechType?: string;
}

const Step4EditSpeech: React.FC<Step4Props> = ({ 
  prevStep, 
  generatedSpeech, 
  speechTitle = "My Speech",
  selectedSpeechType = "other"
}) => {
  const [speechContent, setSpeechContent] = useState(generatedSpeech || "Your speech will appear here once generated.");
  const [copied, setCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, saveSpeech } = useAuth();

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

  const handleSave = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to save your speech",
        variant: "destructive"
      });
      navigate('/auth');
      return;
    }

    try {
      setIsSaving(true);
      await saveSpeech(speechTitle, speechContent, selectedSpeechType);
      toast({
        title: "Speech Saved",
        description: "Your speech has been saved to your account"
      });
      navigate('/dashboard');
    } catch (error) {
      console.error("Error saving speech:", error);
      toast({
        title: "Save Failed",
        description: "Failed to save your speech. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
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
        <ButtonCustom 
          variant="magenta" 
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <Translate text="common.saving" fallback="Saving..." />
            </span>
          ) : (
            <Translate text="speechLab.saveButton" fallback="Save Speech" />
          )}
        </ButtonCustom>
      </CardFooter>
    </Card>
  );
};

export default Step4EditSpeech;
