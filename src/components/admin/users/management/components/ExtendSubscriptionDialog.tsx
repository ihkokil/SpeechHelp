import React, { useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { User } from '@/components/admin/users/types';
import { SubscriptionPlan, PLAN_RULES } from '@/lib/plan_rules';

interface ExtendSubscriptionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (userId: string, planType: SubscriptionPlan, endDate: Date) => Promise<void>;
  user: User | null;
  isLoading: boolean;
}

const ExtendSubscriptionDialog: React.FC<ExtendSubscriptionDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  user,
  isLoading
}) => {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>(
    (user?.subscription_tier as SubscriptionPlan) || SubscriptionPlan.FREE_TRIAL
  );
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    user?.subscription_end_date ? new Date(user.subscription_end_date) : (() => {
      const date = new Date();
      date.setDate(date.getDate() + 28); // Default to 28 days from now
      return date;
    })()
  );

  // Get all available plan types
  const planOptions = Object.values(SubscriptionPlan);
  
  // Reset state when dialog opens with a new user
  React.useEffect(() => {
    if (isOpen && user) {
      setSelectedPlan((user.subscription_tier as SubscriptionPlan) || SubscriptionPlan.FREE_TRIAL);
      setSelectedDate(user.subscription_end_date ? new Date(user.subscription_end_date) : (() => {
        const date = new Date();
        date.setDate(date.getDate() + 28);
        return date;
      })());
    }
  }, [isOpen, user]);

  const handleConfirm = async () => {
    if (!user || !selectedDate) return;
    await onConfirm(user.id, selectedPlan, selectedDate);
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Extend Subscription</DialogTitle>
          <DialogDescription>
            Update subscription plan and end date for {user.email}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-right text-sm font-medium">Plan</span>
            <div className="col-span-3">
              <Select 
                value={selectedPlan} 
                onValueChange={(value) => setSelectedPlan(value as SubscriptionPlan)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select plan" />
                </SelectTrigger>
                <SelectContent>
                  {planOptions.map((plan) => (
                    <SelectItem key={plan} value={plan}>
                      {PLAN_RULES[plan].displayName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-right text-sm font-medium">End Date</span>
            <div className="col-span-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
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
            variant="outline" 
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm}
            disabled={!selectedDate || isLoading}
          >
            {isLoading ? 'Updating...' : 'Confirm'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExtendSubscriptionDialog;
