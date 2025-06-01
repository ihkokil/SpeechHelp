
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
  console.log('=== UserBilling Debug Info ===');
  console.log('User ID:', user.id);
  console.log('User object keys:', Object.keys(user));
  console.log('Complete user subscription data:', {
    subscription_plan: user.subscription_plan,
    subscription_period: user.subscription_period,
    subscription_amount: user.subscription_amount,
    subscription_status: user.subscription_status,
    subscription_start_date: user.subscription_start_date,
    subscription_end_date: user.subscription_end_date,
    subscription_price_id: user.subscription_price_id,
    subscription_currency: user.subscription_currency,
    stripe_customer_id: user.stripe_customer_id,
    stripe_subscription_id: user.stripe_subscription_id
  });
  
  // Check for undefined, null, and empty string values
  console.log('Detailed field analysis:');
  console.log('subscription_period === null:', user.subscription_period === null);
  console.log('subscription_period === undefined:', user.subscription_period === undefined);
  console.log('subscription_period === "":', user.subscription_period === '');
  console.log('subscription_amount === null:', user.subscription_amount === null);
  console.log('subscription_amount === undefined:', user.subscription_amount === undefined);
  console.log('subscription_amount === 0:', user.subscription_amount === 0);

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

  // Get billing period display with more explicit debugging
  const getBillingPeriod = () => {
    const period = user.subscription_period;
    
    console.log('getBillingPeriod analysis:');
    console.log('Raw period value:', period);
    console.log('Period type:', typeof period);
    console.log('Period is null:', period === null);
    console.log('Period is undefined:', period === undefined);
    console.log('Period is empty string:', period === '');
    console.log('Period truthiness:', !!period);
    
    // Handle the case where period might be an empty string, null, or undefined
    if (!period || period === null || period === undefined || String(period).trim() === '') {
      console.log('Period is empty, using fallback logic');
      const planType = user.subscription_plan?.toLowerCase();
      if (planType && planType !== 'free_trial' && planType !== 'free') {
        console.log('User has paid plan but no period, showing "Period not set"');
        return 'Period not set';
      }
      console.log('User has free plan, showing "N/A"');
      return 'N/A';
    }
    
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
  };

  // Get subscription amount display with more explicit debugging
  const getSubscriptionAmount = () => {
    const amount = user.subscription_amount;
    
    console.log('getSubscriptionAmount analysis:');
    console.log('Raw amount value:', amount);
    console.log('Amount type:', typeof amount);
    console.log('Amount is null:', amount === null);
    console.log('Amount is undefined:', amount === undefined);
    console.log('Amount is 0:', amount === 0);
    console.log('Amount as number:', Number(amount));
    console.log('Amount is NaN:', isNaN(Number(amount)));
    
    // Handle the case where amount might be null, undefined, or 0
    if (amount === null || amount === undefined) {
      console.log('Amount is null/undefined, using fallback logic');
      const planType = user.subscription_plan?.toLowerCase();
      if (planType === 'free_trial' || planType === 'free' || !planType) {
        console.log('User has free plan, showing "Free"');
        return 'Free';
      }
      console.log('User has paid plan but no amount, showing "Amount not set"');
      return 'Amount not set';
    }
    
    const numAmount = Number(amount);
    if (isNaN(numAmount)) {
      console.log('Amount is not a valid number');
      return 'Invalid amount';
    }
    
    if (numAmount === 0) {
      console.log('Amount is 0, showing "Free"');
      return 'Free';
    }
    
    if (numAmount > 0) {
      // Convert from cents to dollars if the amount seems to be in cents
      const dollarAmount = numAmount > 100 ? numAmount / 100 : numAmount;
      console.log('Converting amount:', amount, '->', dollarAmount);
      return `$${dollarAmount.toFixed(2)}`;
    }
    
    console.log('Amount processing fallback');
    return 'Amount not available';
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

  const billingPeriod = getBillingPeriod();
  const subscriptionAmount = getSubscriptionAmount();
  
  console.log('Final display values:');
  console.log('Billing period:', billingPeriod);
  console.log('Subscription amount:', subscriptionAmount);
  console.log('=== End UserBilling Debug ===');

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
              <p className="text-sm">{billingPeriod}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Amount</p>
              <p className="text-sm">{subscriptionAmount}</p>
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
