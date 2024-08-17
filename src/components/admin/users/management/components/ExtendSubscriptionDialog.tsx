
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { User } from '../../types';

interface ExtendSubscriptionDialogProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (userId: string, days: number) => void;
  isLoading?: boolean;
}

export function ExtendSubscriptionDialog({
  user,
  open,
  onOpenChange,
  onConfirm,
  isLoading = false,
}: ExtendSubscriptionDialogProps) {
  const [selectedOption, setSelectedOption] = useState<string>("30");
  
  const handleConfirm = () => {
    const days = parseInt(selectedOption);
    if (!isNaN(days)) {
      onConfirm(user.id, days);
    }
  };
  
  const options = [
    { value: "7", label: "1 week (7 days)" },
    { value: "30", label: "1 month (30 days)" },
    { value: "90", label: "3 months (90 days)" },
    { value: "180", label: "6 months (180 days)" },
    { value: "365", label: "1 year (365 days)" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Extend Subscription</DialogTitle>
          <DialogDescription>
            Extend {user.email}'s subscription by selecting a duration below.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <RadioGroup value={selectedOption} onValueChange={setSelectedOption}>
            {options.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={`option-${option.value}`} />
                <Label htmlFor={`option-${option.value}`}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)} 
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={isLoading}>
            {isLoading ? "Processing..." : "Extend Subscription"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ExtendSubscriptionDialog;
