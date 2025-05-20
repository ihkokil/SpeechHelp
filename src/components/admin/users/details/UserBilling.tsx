
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarIcon, AlertCircle, CheckCircle2 } from 'lucide-react';
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
import { useUserManagementData } from '../management/hooks/useUserManagementData';
import { Badge } from '@/components/ui/badge';

interface UserBillingProps {
  user: User;
}

export const UserBilling: React.FC<UserBillingProps> = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>(
    (user.subscription_tier as SubscriptionPlan) || SubscriptionPlan.FREE_TRIAL
  );
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    user.subscription_end_date ? new Date(user.subscription_end_date) : undefined
  );
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const { users, setUsers } = useUserManagementData();
  const { handleUpdateUserSubscription } = useSubscriptionActions(setIsActionLoading);

  // Reset state when user changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedPlan(
        (user.subscription_tier as SubscriptionPlan) || SubscriptionPlan.FREE_TRIAL
      );
      // Set default date to 30 days from now if no existing end date
      setSelectedDate(
        user.subscription_end_date ? new Date(user.subscription_end_date) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      );
      setErrorMessage(null);
    }
  }, [user, isOpen]);
  
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

  // Get plan badge color
  const getPlanBadgeColor = (planType: string) => {
    switch(planType) {
      case SubscriptionPlan.FREE_TRIAL:
        return 'bg-gray-200 text-gray-800';
      case SubscriptionPlan.PREMIUM:
        return 'bg-blue-100 text-blue-800';
      case SubscriptionPlan.PRO:
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

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
      if (selectedDate <= new Date()) {
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
        setIsOpen(false);
      } else {
        setErrorMessage("Failed to update subscription. Please try again.");
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "An unknown error occurred");
    } finally {
      setIsActionLoading(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Subscription Information</span>
            <Badge 
              className={cn("ml-2", getPlanBadgeColor(user.subscription_tier || ''))}
            >
              {getPlanDisplayName(user.subscription_tier || '')}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <p className="text-sm flex items-center">
                {subscriptionStatus === 'Active' ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-green-600">Active</span>
                  </>
                ) : (
                  <span className="text-gray-500">Inactive</span>
                )}
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
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Subscription Plans</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.values(SubscriptionPlan).map((plan) => (
              <div key={plan} className={cn(
                "p-4 border rounded-lg",
                user.subscription_tier === plan ? "border-blue-500 bg-blue-50" : ""
              )}>
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{PLAN_RULES[plan].displayName}</h3>
                    <p className="text-sm text-muted-foreground">
                      {plan === SubscriptionPlan.FREE_TRIAL 
                        ? 'Limited features, 7-day access' 
                        : plan === SubscriptionPlan.PREMIUM 
                          ? 'Standard features, unlimited access' 
                          : 'All features, priority support'}
                    </p>
                  </div>
                  <Badge className={getPlanBadgeColor(plan)}>
                    {user.subscription_tier === plan ? 'Current Plan' : ''}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
};
