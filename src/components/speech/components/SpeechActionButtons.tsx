import React, { useState } from 'react';
import { ButtonCustom } from '@/components/ui/button-custom';
import { Download, RefreshCw, Play, Square, Mail } from 'lucide-react';
import Translate from '@/components/Translate';
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
interface SpeechActionButtonsProps {
  content?: string;
  title?: string;
  onDownload: () => void;
  onReset: () => void;
}
const SpeechActionButtons: React.FC<SpeechActionButtonsProps> = ({
  content = '',
  title = '',
  onDownload,
  onReset
}) => {
  const {
    toast
  } = useToast();
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [emailAddress, setEmailAddress] = useState('');
  const [isSending, setIsSending] = useState(false);
  const speechSynthRef = React.useRef<SpeechSynthesisUtterance | null>(null);
  const handleTextToSpeech = () => {
    // If speech is currently playing, stop it
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    // Check if the SpeechSynthesis API is available
    if (!('speechSynthesis' in window)) {
      toast({
        title: "Speech Synthesis Not Supported",
        description: "Your browser doesn't support the speech synthesis feature.",
        variant: "destructive"
      });
      return;
    }

    // Clean the content by removing markdown formatting
    const cleanContent = content.replace(/^#+ (.+)$/gm, '$1') // Remove headings
    .replace(/\*\*(.+?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.+?)\*/g, '$1') // Remove italic
    .replace(/---/g, '') // Remove horizontal rules
    .trim();
    try {
      // Create a new speech synthesis utterance
      speechSynthRef.current = new SpeechSynthesisUtterance(cleanContent);

      // Add event listeners
      speechSynthRef.current.onend = () => {
        setIsPlaying(false);
      };
      speechSynthRef.current.onerror = event => {
        console.error('Speech synthesis error:', event);
        setIsPlaying(false);
        toast({
          title: "Text-to-Speech Error",
          description: "An error occurred while trying to read the speech.",
          variant: "destructive"
        });
      };

      // Start speaking
      window.speechSynthesis.speak(speechSynthRef.current);
      setIsPlaying(true);
      toast({
        title: "Reading Speech",
        description: "Your speech is being read aloud. Click the stop button to end."
      });
    } catch (error) {
      console.error('Speech synthesis error:', error);
      toast({
        title: "Text-to-Speech Error",
        description: "An error occurred while trying to read the speech.",
        variant: "destructive"
      });
    }
  };

  // Clean up on component unmount
  React.useEffect(() => {
    return () => {
      if (speechSynthRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);
  const handleSendEmail = async () => {
    if (!emailAddress.trim() || !content.trim() || !title.trim()) {
      toast({
        title: "Missing information",
        description: "Please ensure you have a title, content, and a valid email address.",
        variant: "destructive"
      });
      return;
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailAddress)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }
    setIsSending(true);
    try {
      const {
        data,
        error
      } = await supabase.functions.invoke('send-speech', {
        body: {
          title,
          content,
          recipientEmail: emailAddress
        }
      });
      if (error) throw error;
      toast({
        title: "Email Sent",
        description: "Your speech has been sent to the provided email address."
      });
      setIsEmailDialogOpen(false);
      setEmailAddress('');
    } catch (error) {
      console.error('Error sending email:', error);
      toast({
        title: "Failed to send email",
        description: "There was an error sending your speech. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };
  return <>
      <div className="flex flex-wrap gap-2">
        <ButtonCustom variant="outline" size="sm" onClick={handleTextToSpeech} className={isPlaying ? "bg-pink-100" : ""}>
          {isPlaying ? <>
              <Translate text="speechLab.stop" fallback="Stop" />
              <Square className="ml-2 h-4 w-4" />
            </> : <>
              <Translate text="speechLab.play" fallback="Play" />
              <Play className="ml-2 h-4 w-4" />
            </>}
        </ButtonCustom>
        
        <ButtonCustom variant="outline" size="sm" onClick={onDownload}>
          <Translate text="speechLab.download" fallback="Download" />
          <Download className="ml-2 h-4 w-4" />
        </ButtonCustom>
        
        

        <ButtonCustom variant="outline" size="sm" onClick={() => setIsEmailDialogOpen(true)}>
          <Translate text="speechLab.email" fallback="Email" />
          <Mail className="ml-2 h-4 w-4" />
        </ButtonCustom>
      </div>

      <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              <Translate text="speechLab.emailDialogTitle" fallback="Email Your Speech" />
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-purple-700">
                <Translate text="speechLab.emailAddressLabel" fallback="Email Address" />
              </Label>
              <Input id="email" type="email" value={emailAddress} onChange={e => setEmailAddress(e.target.value)} placeholder="Enter recipient's email address" />
            </div>
          </div>
          <DialogFooter>
            <ButtonCustom variant="outline" onClick={() => setIsEmailDialogOpen(false)} disabled={isSending}>
              <Translate text="common.cancel" fallback="Cancel" />
            </ButtonCustom>
            <ButtonCustom onClick={handleSendEmail} disabled={isSending} variant="magenta">
              {isSending ? <span className="inline-flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <Translate text="common.sending" fallback="Sending..." />
                </span> : <Translate text="speechLab.send" fallback="Send" />}
            </ButtonCustom>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>;
};
export default SpeechActionButtons;