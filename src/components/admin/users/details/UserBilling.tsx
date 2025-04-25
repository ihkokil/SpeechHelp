
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

  // Add more detailed logging for debugging
  console.log('Raw subscription data types:', {
    subscription_period_type: typeof user.subscription_period,
    subscription_period_value: user.subscription_period,
    subscription_amount_type: typeof user.subscription_amount,
    subscription_amount_value: user.subscription_amount,
    is_period_null: user.subscription_period === null,
    is_period_undefined: user.subscription_period === undefined,
    is_amount_null: user.subscription_amount === null,
    is_amount_undefined: user.subscription_amount === undefined
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

  // Get billing period display - improved logic
  const getBillingPeriod = () => {
    const period = user.subscription_period;
    
    console.log('getBillingPeriod - raw period value:', period, 'type:', typeof period);
    
    // Check if period exists and is not empty
    if (period && period !== null && period !== undefined && String(period).trim() !== '') {
      const periodStr = String(period).toLowerCase().trim();
      console.log('Processing period string:', periodStr);
      
      switch (periodStr) {
        case 'monthly':
          return 'Monthly';
        case 'yearly':
        case 'annual':
          return 'Yearly';
        default:
          return periodStr.charAt(0).toUpperCase() + periodStr.slice(1);
      }
    }
    
    // Fallback logic
    const planType = user.subscription_plan?.toLowerCase();
    if (planType && planType !== 'free_trial' && planType !== 'free') {
      console.log('No period found, using fallback for plan:', planType);
      return 'Period not set';
    }
    
    return 'N/A';
  };

  // Get subscription amount display - improved logic
  const getSubscriptionAmount = () => {
    const amount = user.subscription_amount;
    
    console.log('getSubscriptionAmount - raw amount value:', amount, 'type:', typeof amount);
    
    // Check if amount exists and is a valid number
    if (amount !== null && amount !== undefined && !isNaN(Number(amount)) && Number(amount) > 0) {
      const dollarAmount = Number(amount) / 100;
      console.log('Converting amount from cents to dollars:', amount, '->', dollarAmount);
      return `$${dollarAmount.toFixed(2)}`;
    }
    
    // Fallback logic
    const planType = user.subscription_plan?.toLowerCase();
    if (planType === 'free_trial' || planType === 'free' || !planType) {
      return 'Free';
    }
    
    console.log('No valid amount found, using fallback for plan:', planType);
    return 'Amount not set';
  };

  // Get payment method display
  const getPaymentMethod = () => {
    if (user.stripe_customer_id && user.stripe_customer_id !== null && user.stripe_customer_id !== undefined) {
      return 'Stripe';
    }
    
    // Check if it's a paid plan without payment method
    const planType = user.subscription_plan?.toLowerCase();
    if (planType && planType !== 'free_trial' && planType !== 'free') {
      return 'Payment method not configured';
    }
    
    return 'None required';
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
              <p className="text-sm">{getPaymentMethod()}</p>
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
