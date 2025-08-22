
import React from 'react';
import { User } from '@/components/admin/users/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { CreditCard } from 'lucide-react';

interface SubscriptionInfoProps {
  user: User;
}

export const SubscriptionInfo: React.FC<SubscriptionInfoProps> = ({ user }) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Subscription Details
        </CardTitle>
        <CardDescription>Current subscription plan and status</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Current Plan</h4>
              <Badge variant="outline" className="capitalize">
                {user.subscription_plan || 'Free Trial'}
              </Badge>
            </div>

            {user.subscription_status && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Status</h4>
                <Badge variant={user.subscription_status === 'active' ? 'default' : 'secondary'} className="capitalize">
                  {user.subscription_status}
                </Badge>
              </div>
            )}

            {user.subscription_amount && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Amount</h4>
                <p className="text-sm">
                  ${(user.subscription_amount / 100).toFixed(2)} {user.subscription_currency?.toUpperCase() || 'USD'}
                </p>
              </div>
            )}

            {user.subscription_period && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Billing Period</h4>
                <p className="text-sm capitalize">{user.subscription_period}</p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {user.subscription_start_date && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Started</h4>
                <p className="text-sm">
                  {format(new Date(user.subscription_start_date), 'PPP')}
                </p>
              </div>
            )}

            {user.subscription_end_date && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Expires</h4>
                <p className="text-sm">
                  {format(new Date(user.subscription_end_date), 'PPP')}
                </p>
              </div>
            )}

            {user.stripe_subscription_id && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Stripe Subscription ID</h4>
                <p className="text-sm font-mono text-xs">{user.stripe_subscription_id}</p>
              </div>
            )}

            {user.subscription_price_id && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Price ID</h4>
                <p className="text-sm font-mono text-xs">{user.subscription_price_id}</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
