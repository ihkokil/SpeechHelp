
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

    const getStatusColor = (status: string) => {
      switch (status.toLowerCase()) {
        case 'active':
          return 'bg-green-500 text-white hover:bg-green-600';
        case 'canceled':
        case 'cancelled':
          return 'bg-red-500 text-white hover:bg-red-600';
        case 'past_due':
          return 'bg-yellow-500 text-white hover:bg-yellow-600';
        default:
          return 'bg-gray-500 text-white hover:bg-gray-600';
      }
    };

    return (
      <div className="mb-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 shadow-lg">
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Your Current Subscription
          </h2>
          <div className="flex items-center gap-3 flex-wrap justify-center">
            <Badge className={`${getStatusColor(status)} font-semibold px-4 py-2 text-base`}>
              {formatPlanName(planName)}
            </Badge>
            {status === 'active' && profile.subscription_end_date && (
              <span className="text-sm text-gray-700 bg-white px-3 py-1 rounded-full border">
                Renews: {new Date(profile.subscription_end_date).toLocaleDateString()}
              </span>
            )}
            {status !== 'active' && (
              <span className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full border">
                Status: {status.charAt(0).toUpperCase() + status.slice(1)}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="text-center max-w-4xl mx-auto mb-12">
      <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600">
        Choose Your Perfect Plan
      </h1>
      <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
        Unlock the full potential of Speech Help with our flexible pricing plans designed for every need.
      </p>
      {getCurrentPlanDisplay()}
    </div>
  );
};

export default PricingHeader;
