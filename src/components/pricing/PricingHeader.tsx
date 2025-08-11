import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { useProfile } from '../speech/hooks/useProfile';

const PricingHeader: React.FC = () => {
  const { user } = useAuth();
  const { profile } = useProfile();

  const getCurrentPlanDisplay = () => {
    if (!user || !profile) return null;
    
    const planName = profile.subscription_plan || 'Free Trial';
    const status = profile.subscription_status || 'inactive';
    const endDate = profile.subscription_end_date;
    
    // Check if subscription is expired
    const isExpired = endDate ? new Date() > new Date(endDate) : false;
    
    // Format plan name for display
    const formatPlanName = (plan: string) => {
      switch (plan.toLowerCase()) {
        case 'free_trial':
          return 'Free Trial';
        case 'premium':
          return 'Premium Plan';
        case 'pro':
          return 'Pro Plan';
        default:
          return plan.charAt(0).toUpperCase() + plan.slice(1);
      }
    };

    const getStatusColor = (status: string, expired: boolean) => {
      if (expired) {
        return 'bg-red-100 text-red-800 hover:bg-red-100';
      }
      
      switch (status.toLowerCase()) {
        case 'active':
          return 'bg-green-100 text-green-800 hover:bg-green-100';
        case 'canceled':
        case 'cancelled':
          return 'bg-red-100 text-red-800 hover:bg-red-100';
        case 'past_due':
          return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
        default:
          return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
      }
    };

    const getStatusText = (status: string, expired: boolean) => {
      if (expired) {
        return 'Expired';
      }
      
      switch (status.toLowerCase()) {
        case 'active':
          return 'Active';
        case 'canceled':
        case 'cancelled':
          return 'Canceled';
        case 'past_due':
          return 'Past Due';
        default:
          return 'Inactive';
      }
    };

    return (
      <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <span className="text-lg font-medium text-gray-700">
            Your Current Plan:
          </span>
          <Badge className={`${getStatusColor(status, isExpired)} font-medium px-3 py-1 cursor-default`}>
            {formatPlanName(planName)} {isExpired && '(Expired)'}
          </Badge>
          <Badge className={`${getStatusColor(status, isExpired)} cursor-default`}>
            {getStatusText(status, isExpired)}
          </Badge>
          {endDate && (
            <span className="text-sm text-gray-600">
              {isExpired ? 'Expired:' : (status === 'active' ? 'Renews:' : 'Ends:')} {new Date(endDate).toLocaleDateString()}
            </span>
          )}
          {isExpired && (
            <span className="text-sm text-red-600 font-medium">
              Please upgrade to continue using premium features
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="text-center max-w-3xl mx-auto mb-8">
      <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600">
        Affordable Plans for Everyone
      </h1>
      <p className="text-lg text-gray-600 mb-6">
        Find the perfect plan that suits your needs.
      </p>
      {getCurrentPlanDisplay()}
    </div>
  );
};

export default PricingHeader;
