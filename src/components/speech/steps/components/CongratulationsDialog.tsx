
import React from 'react';
import { PartyPopper } from 'lucide-react';
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center flex items-center justify-center">
            <PartyPopper className="h-5 w-5 mr-2 text-yellow-500" />
            <Translate text="speechLab.congratulationsTitle" fallback="Congratulations!" />
          </DialogTitle>
          <DialogDescription className="text-center">
            <Translate text="speechLab.congratulationsDesc" fallback="Your speech has been successfully generated!" />
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center">
          <ButtonCustom 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            <Translate text="common.close" fallback="Close" />
          </ButtonCustom>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CongratulationsDialog;
