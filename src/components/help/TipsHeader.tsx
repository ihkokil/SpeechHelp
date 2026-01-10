
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Translate from '@/components/Translate';

interface TipsHeaderProps {
  handleClose: () => void;
}

const TipsHeader: React.FC<TipsHeaderProps> = ({ handleClose }) => {
  return (
    <div className="sticky top-0 z-10 bg-white shadow-sm p-4 flex justify-between items-center max-w-6xl mx-auto w-full">
      <h1 className="text-fluid-2xl font-bold text-gray-800">
        <Translate text="speechLab.tips.title" fallback="Speech Writing Tips" />
      </h1>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={handleClose}
        className="rounded-full hover:bg-gray-100"
      >
        <X className="h-6 w-6" />
        <span className="sr-only"><Translate text="common.close" fallback="Close" /></span>
      </Button>
    </div>
  );
};

export default TipsHeader;
