
import React from 'react';
import { format } from 'date-fns';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter 
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { User } from '../types';
import { useSubscriptionActions } from '../management/hooks/user-actions/useSubscriptionActions';
import { SubscriptionPlan, PLAN_RULES } from '@/lib/plan_rules';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useUserManagementData } from '../management/hooks/useUserManagementData';
import { useToast } from '@/hooks/use-toast';

interface UserBillingProps {
  user: User;
}

export const UserBilling: React.FC<UserBillingProps> = ({ user }) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>(
    (user.subscription_tier as SubscriptionPlan) || SubscriptionPlan.FREE_TRIAL
  );
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    user.subscription_end_date ? new Date(user.subscription_end_date) : undefined
  );
  const [isActionLoading, setIsActionLoading] = useState(false);
  
  const { users, setUsers } = useUserManagementData();
  const { handleUpdateUserSubscription } = useSubscriptionActions(setIsActionLoading);

  // Get all available plan types
  const planOptions = Object.values(SubscriptionPlan);
  
  // Format the subscription end date for display
  const formattedEndDate = user.subscription_end_date 
    ? format(new Date(user.subscription_end_date), 'PPP') 
    : 'N/A';
  
  // Determine the subscription status
  const subscriptionStatus = user.subscription_end_date && new Date(user.subscription_end_date) > new Date()
    ? 'Active'
    : 'Inactive';
  
  // Get plan display name
  const getPlanDisplayName = (planType: string) => {
    const plan = Object.values(SubscriptionPlan).find(p => p === planType);
    return plan ? PLAN_RULES[plan].displayName : planType || 'Free Plan';
  };

  // Handle subscription update
  const handleUpdateSubscription = async () => {
    if (!selectedDate) {
      toast({
        title: "Error",
        description: "Please select an end date for the subscription",
        variant: "destructive",
      });
      return;
    }
    
    setIsActionLoading(true);
    try {
      console.log("Updating subscription for user:", user.id);
      console.log("Selected plan:", selectedPlan);
      console.log("Selected end date:", selectedDate);
      
      const result = await handleUpdateUserSubscription(
        user.id, 
        selectedPlan, 
        selectedDate, 
        users, 
        setUsers
      );
      
      if (result) {
        setIsOpen(false);
        toast({
          title: "Subscription Updated",
          description: `User's subscription has been updated to ${PLAN_RULES[selectedPlan].displayName}`,
        });
      } else {
        throw new Error("Failed to update subscription");
      }
    } catch (error) {
      console.error("Error updating subscription:", error);
      toast({
        title: "Error",
        description: "Failed to update subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Subscription Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Current Plan</p>
              <p className="text-sm">
                {getPlanDisplayName(user.subscription_tier || '')}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <p className="text-sm">
                {subscriptionStatus}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Next Billing Date</p>
              <p className="text-sm">{formattedEndDate}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Payment Method</p>
              <p className="text-sm">{user.stripe_customer_id ? 'Stripe' : 'None on file'}</p>
            </div>
          </div>
          
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="mt-4">
                Modify Subscription
              </Button>
            </DialogTrigger>
            <DialogContent>
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
                          {PLAN_RULES[plan].displayName}
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
                  onClick={handleUpdateSubscription}
                  disabled={!selectedDate || isActionLoading}
                >
                  {isActionLoading ? 'Updating...' : 'Update Subscription'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md bg-muted/50 p-6 text-center">
            <p className="text-muted-foreground">No billing records available.</p>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
