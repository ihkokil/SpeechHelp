
import React from 'react';
import { format } from 'date-fns';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BadgePercent } from 'lucide-react';
import { User } from '../types';
import { PLAN_RULES, SubscriptionPlan } from '@/lib/plan_rules';

interface UserBillingProps {
  user: User;
}

export const UserBilling: React.FC<UserBillingProps> = ({ user }) => {
  console.log('UserBilling rendering for user:', {
    id: user.id,
    subscription_plan: user.subscription_plan,
    subscription_period: user.subscription_period,
    subscription_amount: user.subscription_amount,
    subscription_end_date: user.subscription_end_date,
    stripe_customer_id: user.stripe_customer_id,
    subscription_status: user.subscription_status
  });

  // Format the subscription end date for display
  const formattedEndDate = user.subscription_end_date 
    ? format(new Date(user.subscription_end_date), 'PPP') 
    : 'N/A';
  
  // Determine the subscription status
  const subscriptionStatus = user.subscription_end_date && new Date(user.subscription_end_date) > new Date()
    ? 'Active'
    : 'Inactive';
  
  // Get plan display name
  const getPlanDisplayName = (user: User) => {
    const planType = user.subscription_plan || 'free_trial';
    
    if (!planType || planType === 'free_trial') return 'Free Trial';
    
    // Use the plan rules if available
    const planKey = planType as SubscriptionPlan;
    if (PLAN_RULES[planKey]) {
      return PLAN_RULES[planKey].displayName;
    }
    
    // Capitalize first letter if no plan rule found
    return planType.charAt(0).toUpperCase() + planType.slice(1).replace('_', ' ');
  };

  // Get billing period display
  const getBillingPeriod = () => {
    if (!user.subscription_period) return 'N/A';
    
    switch (user.subscription_period.toLowerCase()) {
      case 'monthly':
        return 'Monthly';
      case 'yearly':
        return 'Yearly';
      case 'annual':
        return 'Yearly';
      default:
        return user.subscription_period;
    }
  };

  // Get subscription amount display
  const getSubscriptionAmount = () => {
    // If no amount or amount is 0, check if it's a free plan
    if (!user.subscription_amount || user.subscription_amount === 0) {
      const planType = user.subscription_plan?.toLowerCase();
      if (planType === 'free_trial' || planType === 'free' || !planType) {
        return 'Free';
      }
      // If it's a paid plan but no amount, show N/A
      return 'N/A';
    }
    
    // Convert from cents to dollars and format
    return `$${(user.subscription_amount / 100).toFixed(2)}`;
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BadgePercent className="mr-2 h-5 w-5 text-primary" />
            Subscription Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Current Plan</p>
              <p className="text-sm">
                <span className="inline-flex w-24 justify-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {getPlanDisplayName(user)}
                </span>
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <p className="text-sm">
                <span 
                  className={`inline-flex items-center w-24 justify-center px-2 py-1 rounded-full text-xs font-medium ${
                    subscriptionStatus === 'Active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {subscriptionStatus}
                </span>
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">End Date</p>
              <p className="text-sm">{formattedEndDate}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Payment Method</p>
              <p className="text-sm">{user.stripe_customer_id ? 'Stripe' : 'None on file'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Billing Period</p>
              <p className="text-sm">{getBillingPeriod()}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Amount</p>
              <p className="text-sm">{getSubscriptionAmount()}</p>
            </div>
          </div>
          
          <div className="mt-4">
            <p className="text-xs text-muted-foreground">
              Subscription management is handled by administrators.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Account Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">User ID:</span>
              <span className="text-sm font-mono">{user.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Created:</span>
              <span className="text-sm">
                {user.created_at ? format(new Date(user.created_at), 'PPP') : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Stripe Customer ID:</span>
              <span className="text-sm font-mono">{user.stripe_customer_id || 'None'}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
