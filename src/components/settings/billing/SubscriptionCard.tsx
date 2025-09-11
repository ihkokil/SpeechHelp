import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Calendar, CreditCard, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { PaymentMethod } from './types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { createCheckoutSession, getPriceId } from '@/services/stripe';
import { useAuth } from '@/contexts/AuthContext';

interface SubscriptionData {
  plan: string;
  status: string;
  price: string;
  billingPeriod: string;
  startDate: Date;
  endDate: Date;
  paymentMethod?: PaymentMethod;
}

interface SubscriptionCardProps {
  subscriptionData: SubscriptionData;
  autoRenew: boolean;
  onAutoRenewToggle: (checked: boolean) => void;
  onToggleBillingPeriod: () => void;
  onSubscriptionUpdate?: () => void;
}

const SubscriptionCard = ({
  subscriptionData,
  autoRenew,
  onAutoRenewToggle,
  onToggleBillingPeriod,
  onSubscriptionUpdate,
}: SubscriptionCardProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isReactivating, setIsReactivating] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'canceled':
      case 'cancelled':
      case 'will_cancel':
        return 'bg-red-100 text-red-800';
      case 'past_due':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'Active';
      case 'canceled':
      case 'cancelled':
        return 'Canceled';
      case 'will_cancel':
        return 'Will Cancel';
      case 'past_due':
        return 'Past Due';
      case 'inactive':
        return 'Inactive';
      default:
        return 'Unknown';
    }
  };

  // Get the correct price based on plan and billing period
  const getPlanPrice = () => {
    const planName = subscriptionData.plan.toLowerCase();
    
    if (planName.includes('free') || planName.includes('trial')) {
      return '$0.00';
    }
    
    if (planName.includes('pro')) {
      return subscriptionData.billingPeriod === 'yearly' ? '$299.99' : '$29.99';
    }
    
    if (planName.includes('premium')) {
      return subscriptionData.billingPeriod === 'yearly' ? '$99.99' : '$9.99';
    }
    
    // Fallback to the original price from subscription data
    return subscriptionData.price;
  };

  // Get the correct plan display name based on the raw plan type
  const getActualPlanName = () => {
    const rawPlan = subscriptionData.plan.toLowerCase();
    
    // Remove " plan" suffix if it exists to get the raw plan type
    const planType = rawPlan.replace(' plan', '');
    
    switch (planType) {
      case 'premium':
        return 'Premium Plan';
      case 'pro':
        return 'Pro Plan';
      case 'free_trial':
        return 'Free Trial';
      case 'free':
        return 'Free Plan';
      default:
        return subscriptionData.plan; // Return as-is if we can't determine
    }
  };

  // Check if the current plan is a free trial
  const isFreeTrial = () => {
    const planName = subscriptionData.plan.toLowerCase();
    return planName.includes('free') || planName.includes('trial');
  };

  const handleReactivateSubscription = async () => {
    setIsReactivating(true);
    try {
      const { data, error } = await supabase.functions.invoke('reactivate-subscription');

      if (error) {
        console.error('Error reactivating subscription:', error);
        toast({
          title: "Error",
          description: "Failed to reactivate subscription. Please try again.",
          variant: "destructive"
        });
        return;
      }

      // Handle different response types
      if (data?.error) {
        console.error('Reactivation error:', data);
        
        if (data.action === 'create_new') {
          toast({
            title: "No Previous Subscription Found",
            description: data.message || "Please create a new subscription instead.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Error",
            description: data.message || "Failed to reactivate subscription. Please try again.",
            variant: "destructive"
          });
        }
        return;
      }

      // Success case
      toast({
        title: "Success",
        description: data?.message || "Your subscription has been reactivated successfully!",
      });

      // Refresh subscription data
      if (onSubscriptionUpdate) {
        onSubscriptionUpdate();
      }
    } catch (error) {
      console.error('Error reactivating subscription:', error);
      toast({
        title: "Error",
        description: "Failed to reactivate subscription. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsReactivating(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to cancel your subscription.",
        variant: "destructive"
      });
      return;
    }

    setIsCancelling(true);
    try {
      // Get fresh session to ensure we have a valid token
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        console.error('Session error:', sessionError);
        toast({
          title: "Authentication Error",
          description: "Please log out and log back in, then try again.",
          variant: "destructive"
        });
        return;
      }

      console.log('Cancelling subscription for user:', user.id);
      
      const { data, error } = await supabase.functions.invoke('cancel-subscription', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('Error cancelling subscription:', error);
        toast({
          title: "Error",
          description: "Failed to cancel subscription. Please try again.",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Subscription Cancelled",
        description: data?.message || "Your subscription has been cancelled successfully.",
      });

      // Refresh subscription data
      if (onSubscriptionUpdate) {
        onSubscriptionUpdate();
      }
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      toast({
        title: "Error",
        description: "Failed to cancel subscription. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCancelling(false);
    }
  };

  const handleAutoRenewToggle = async (checked: boolean) => {
    try {
      const { data, error } = await supabase.functions.invoke('update-subscription-auto-renewal', {
        body: { autoRenew: checked }
      });

      if (error) {
        console.error('Error updating auto-renewal:', error);
        toast({
          title: "Error",
          description: "Failed to update auto-renewal setting. Please try again.",
          variant: "destructive"
        });
        return;
      }

      onAutoRenewToggle(checked);
      toast({
        title: "Auto-renewal Updated",
        description: `Auto-renewal has been ${checked ? 'enabled' : 'disabled'}.`,
      });

    } catch (error) {
      console.error('Error updating auto-renewal:', error);
      toast({
        title: "Error",
        description: "Failed to update auto-renewal setting. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              Current Subscription
              <Badge className={getStatusColor(subscriptionData.status)}>
                {getStatusText(subscriptionData.status)}
              </Badge>
            </CardTitle>
            <CardDescription>
              Manage your subscription and billing preferences
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Plan Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-medium">Plan Details</h4>
            <div className="space-y-1">
              <p className="text-2xl font-bold">{getActualPlanName()}</p>
              <p className="text-lg text-muted-foreground">
                {getPlanPrice()}
                {getPlanPrice() !== '$0.00' && (
                  <span className="text-sm">/{subscriptionData.billingPeriod}</span>
                )}
              </p>
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium">Billing Information</h4>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4" />
                <span>Started: {format(subscriptionData.startDate, 'MMM dd, yyyy')}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <RefreshCw className="h-4 w-4" />
                <span>
                  {subscriptionData.status === 'active' && !isFreeTrial() ? 'Renews' : 'Ends'}: {format(subscriptionData.endDate, 'MMM dd, yyyy')}
                </span>
              </div>
              {subscriptionData.paymentMethod && (
                <div className="flex items-center gap-2 text-sm">
                  <CreditCard className="h-4 w-4" />
                  <span>
                    {subscriptionData.paymentMethod.brand} •••• {subscriptionData.paymentMethod.last4}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Auto-renewal toggle and Cancel button - only show for paid subscriptions */}
        {subscriptionData.status === 'active' && !isFreeTrial() && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Switch
                id="auto-renew"
                checked={autoRenew}
                onCheckedChange={handleAutoRenewToggle}
              />
              <Label htmlFor="auto-renew">Auto-renewal</Label>
            </div>
            
            <Button 
              variant="destructive" 
              onClick={handleCancelSubscription}
              disabled={isCancelling}
            >
              {isCancelling ? 'Cancelling...' : 'Cancel Subscription'}
            </Button>
          </div>
        )}

        {/* Action Buttons for non-active states */}
        {subscriptionData.status !== 'active' && (
          <div className="flex flex-col sm:flex-row gap-3">
            {(subscriptionData.status === 'inactive' || subscriptionData.status === 'canceled') && (
              <Button 
                className="flex-1"
                onClick={handleReactivateSubscription}
                disabled={isReactivating}
              >
                {isReactivating ? 'Checking Subscription...' : 'Reactivate Subscription'}
              </Button>
            )}
            
            {subscriptionData.status === 'past_due' && (
              <Button className="flex-1" variant="destructive">
                Update Payment Method
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SubscriptionCard;
