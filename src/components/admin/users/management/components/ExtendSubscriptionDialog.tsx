
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User } from '../../types';
import { SubscriptionPlan } from '@/lib/plan_rules';

interface ExtendSubscriptionDialogProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (userId: string, days: number, plan: SubscriptionPlan) => void;
  isLoading?: boolean;
}

export function ExtendSubscriptionDialog({
  user,
  open,
  onOpenChange,
  onConfirm,
  isLoading = false,
}: ExtendSubscriptionDialogProps) {
  const [selectedDuration, setSelectedDuration] = useState<string>("30");
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>(SubscriptionPlan.PREMIUM);
  
  const handleConfirm = () => {
    const days = parseInt(selectedDuration);
    if (!isNaN(days)) {
      onConfirm(user.id, days, selectedPlan);
    }
  };
  
  const durationOptions = [
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
            Update {user.email}'s subscription by selecting a plan and duration below.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-6">
          <div className="space-y-2">
            <Label>Subscription Plan</Label>
            <Select 
              value={selectedPlan} 
              onValueChange={(value) => setSelectedPlan(value as SubscriptionPlan)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={SubscriptionPlan.FREE_TRIAL}>Free Trial</SelectItem>
                <SelectItem value={SubscriptionPlan.PREMIUM}>Premium</SelectItem>
                <SelectItem value={SubscriptionPlan.PRO}>Pro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Duration</Label>
            <RadioGroup value={selectedDuration} onValueChange={setSelectedDuration}>
              {durationOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`option-${option.value}`} />
                  <Label htmlFor={`option-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
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
            {isLoading ? "Processing..." : "Update Subscription"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ExtendSubscriptionDialog;
