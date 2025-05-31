
import React, { useState } from 'react';
import { format } from 'date-fns';
import { User } from '../../types';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { SubscriptionPlan, PLAN_RULES } from '@/lib/plan_rules';

interface UpdateSubscriptionDialogProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubscriptionUpdated: (userId: string, tier: string, endDate: Date) => void;
}

const UpdateSubscriptionDialog: React.FC<UpdateSubscriptionDialogProps> = ({
  user,
  open,
  onOpenChange,
  onSubscriptionUpdated
}) => {
  // Initialize with either subscription_plan or subscription_plan
  const [selectedPlan, setSelectedPlan] = useState<string>(
    user.subscription_plan || user.subscription_plan || SubscriptionPlan.FREE_TRIAL
  );
  
  const [endDate, setEndDate] = useState<Date | undefined>(
    user.subscription_end_date ? new Date(user.subscription_end_date) : undefined
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get plan display names from the plan rules
  const planOptions = Object.values(SubscriptionPlan).map(planType => ({
    value: planType,
    label: PLAN_RULES[planType as SubscriptionPlan].displayName
  }));

  const handleSubmit = () => {
    if (!endDate && selectedPlan !== SubscriptionPlan.FREE_TRIAL) {
      return; // Don't submit if endDate is missing for paid plans
    }

    setIsSubmitting(true);
    
    // Call the update function with the user ID, selected plan, and end date
    onSubscriptionUpdated(
      user.id, 
      selectedPlan,
      endDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Default to 7 days for free trial
    );
  };

  // Use email instead of username for display since username might not exist
  const userDisplay = user.email || "User";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Subscription</DialogTitle>
          <DialogDescription>
            Update subscription details for {userDisplay}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="subscription-plan">Subscription Plan</Label>
            <RadioGroup
              id="subscription-plan"
              value={selectedPlan}
              onValueChange={setSelectedPlan}
              className="flex flex-col space-y-1"
            >
              {planOptions.map((plan) => (
                <div key={plan.value} className="flex items-center space-x-2 rounded-md border p-2">
                  <RadioGroupItem value={plan.value} id={`plan-${plan.value}`} />
                  <Label htmlFor={`plan-${plan.value}`} className="flex-grow cursor-pointer">
                    {plan.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          
          {selectedPlan !== SubscriptionPlan.FREE_TRIAL && (
            <div className="space-y-2">
              <Label htmlFor="subscription-end-date">Subscription End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="subscription-end-date"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                    disabled={(date) => date < new Date()}
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
              {selectedPlan !== SubscriptionPlan.FREE_TRIAL && !endDate && (
                <p className="text-xs text-destructive">End date is required for paid plans</p>
              )}
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting || (selectedPlan !== SubscriptionPlan.FREE_TRIAL && !endDate)}
          >
            {isSubmitting ? 'Updating...' : 'Update Subscription'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateSubscriptionDialog;
