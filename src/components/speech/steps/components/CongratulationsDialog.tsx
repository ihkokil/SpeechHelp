
import React from 'react';
import { PartyPopper, Sparkles } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ButtonCustom } from '@/components/ui/button-custom';
import Translate from '@/components/Translate';

interface CongratulationsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CongratulationsDialog: React.FC<CongratulationsDialogProps> = ({ 
  open, 
  onOpenChange 
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-gradient-to-r from-purple-100 to-pink-100 border-purple-200">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-purple-800 flex items-center justify-center gap-2">
            <PartyPopper className="h-6 w-6 text-purple-600" />
            Congratulations - You Did It!
            <PartyPopper className="h-6 w-6 text-purple-600" />
          </DialogTitle>
          <DialogDescription className="text-center text-lg text-purple-700">
            Your speech has been successfully generated! Get ready to impress your audience.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center py-4">
          <Sparkles className="h-24 w-24 text-purple-500 animate-pulse" />
        </div>
        <div className="flex justify-center">
          <ButtonCustom 
            variant="magenta" 
            className="px-8"
            onClick={() => onOpenChange(false)}
          >
            Awesome!
          </ButtonCustom>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CongratulationsDialog;
