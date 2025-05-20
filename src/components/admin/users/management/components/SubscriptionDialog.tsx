
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, AlertCircle } from 'lucide-react';
import { User } from '../../types';
import { SubscriptionPlan } from '@/lib/plan_rules';
import { useSubscriptionActions } from '../hooks/user-actions/useSubscriptionActions';
import { useUserManagementData } from '../hooks/useUserManagementData';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { Button } from '@/components/ui/button';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

interface SubscriptionDialogProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SubscriptionDialog: React.FC<SubscriptionDialogProps> = ({
  user,
  open,
  onOpenChange
}) => {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>(
    (user.subscription_tier as SubscriptionPlan) || SubscriptionPlan.FREE_TRIAL
  );
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    user.subscription_end_date ? new Date(user.subscription_end_date) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  );
  
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const { users, setUsers } = useUserManagementData();
  const { handleUpdateUserSubscription } = useSubscriptionActions(setIsActionLoading);

  // Reset state when user changes or modal opens
  useEffect(() => {
    if (open) {
      setSelectedPlan(
        (user.subscription_tier as SubscriptionPlan) || SubscriptionPlan.FREE_TRIAL
      );
      // Set default date to 30 days from now if no existing end date
      setSelectedDate(
        user.subscription_end_date ? new Date(user.subscription_end_date) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      );
      setErrorMessage(null);
    }
  }, [user, open]);
  
  // Get all available plan types
  const planOptions = Object.values(SubscriptionPlan);

  // Handle subscription update
  const handleUpdateSubscription = async () => {
    if (!selectedDate) {
      setErrorMessage("Please select an end date for the subscription.");
      return;
    }
    
    setErrorMessage(null);
    setIsActionLoading(true);
    
    try {
      // Ensure the date is in the future
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        setErrorMessage("Please select a date in the future.");
        setIsActionLoading(false);
        return;
      }
      
      // Make sure we have a valid subscription plan
      if (!Object.values(SubscriptionPlan).includes(selectedPlan)) {
        setErrorMessage(`Invalid plan type: ${selectedPlan}`);
        setIsActionLoading(false);
        return;
      }
      
      const result = await handleUpdateUserSubscription(
        user.id, 
        selectedPlan, 
        selectedDate, 
        users, 
        setUsers
      );
      
      if (result) {
        onOpenChange(false);
      } else {
        setErrorMessage("Failed to update subscription. Please try again.");
      }
    } catch (error) {
      console.error("Error updating subscription:", error);
      setErrorMessage(error instanceof Error ? error.message : "An unknown error occurred");
    } finally {
      setIsActionLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update User Subscription</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="plan" className="text-right text-sm">
              Plan
            </label>
            <Select 
              value={selectedPlan} 
              onValueChange={(value) => setSelectedPlan(value as SubscriptionPlan)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select plan" />
              </SelectTrigger>
              <SelectContent>
                {planOptions.map((plan) => (
                  <SelectItem key={plan} value={plan}>
                    {plan === SubscriptionPlan.FREE_TRIAL 
                      ? 'Free Trial' 
                      : plan === SubscriptionPlan.PREMIUM 
                        ? 'Premium' 
                        : 'Pro'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="endDate" className="text-right text-sm">
              End Date
            </label>
            <div className="col-span-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                    disabled={(date) => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return date < today;
                    }}
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          {errorMessage && (
            <div className="bg-red-50 p-3 rounded-md flex items-start gap-2 text-red-700 text-sm">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button 
            type="submit" 
            onClick={handleUpdateSubscription}
            disabled={!selectedDate || isActionLoading}
          >
            {isActionLoading ? 'Updating...' : 'Update Subscription'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionDialog;
