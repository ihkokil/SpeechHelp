
import React from 'react';
import { format } from 'date-fns';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User } from '../types';

interface UserBillingProps {
  user: User;
}

export const UserBilling: React.FC<UserBillingProps> = ({ user }) => {
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
    return planType || 'Free Plan';
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
          
          <div className="mt-4">
            <p className="text-xs text-muted-foreground">
              Subscription management has been disabled by administrator.
            </p>
          </div>
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
