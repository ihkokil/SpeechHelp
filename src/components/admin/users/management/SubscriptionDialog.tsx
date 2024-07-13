
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { User } from '../types';
import { cn } from '@/lib/utils';
import { SubscriptionPlan, PLAN_RULES } from '@/lib/plan_rules';

interface SubscriptionDialogProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubscriptionUpdate: (userId: string, plan: string, endDate: Date) => Promise<void>;
}

const SubscriptionDialog: React.FC<SubscriptionDialogProps> = ({
  user,
  open,
  onOpenChange,
  onSubscriptionUpdate
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>(
    user.subscription_tier || SubscriptionPlan.FREE_TRIAL
  );
  
  // Set default date to 30 days from now, or use existing end date if available
  const defaultDate = user.subscription_end_date 
    ? new Date(user.subscription_end_date) 
    : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  
  const [selectedDate, setSelectedDate] = useState<Date>(defaultDate);

  const handleSubscriptionUpdate = async () => {
    try {
      setIsSubmitting(true);
      await onSubscriptionUpdate(user.id, selectedPlan, selectedDate);
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to update subscription:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Subscription</DialogTitle>
          <DialogDescription>
            Change subscription plan and end date for {user.email}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="plan" className="text-right text-sm font-medium">
              Plan
            </label>
            <Select
              value={selectedPlan}
              onValueChange={setSelectedPlan}
              disabled={isSubmitting}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={SubscriptionPlan.FREE_TRIAL}>
                  {PLAN_RULES[SubscriptionPlan.FREE_TRIAL].displayName}
                </SelectItem>
                <SelectItem value={SubscriptionPlan.PREMIUM}>
                  {PLAN_RULES[SubscriptionPlan.PREMIUM].displayName}
                </SelectItem>
                <SelectItem value={SubscriptionPlan.PRO}>
                  {PLAN_RULES[SubscriptionPlan.PRO].displayName}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="endDate" className="text-right text-sm font-medium">
              End Date
            </label>
            <div className="col-span-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                    disabled={isSubmitting}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    initialFocus
                    disabled={(date) => date < new Date()}
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type="button" 
            onClick={handleSubscriptionUpdate}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Updating..." : "Update Subscription"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionDialog;
