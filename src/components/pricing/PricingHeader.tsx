
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
          return 'bg-green-100 text-green-800';
        case 'canceled':
        case 'cancelled':
          return 'bg-red-100 text-red-800';
        case 'past_due':
          return 'bg-yellow-100 text-yellow-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    };

    return (
      <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
        <div className="flex items-center justify-center gap-3">
          <span className="text-lg font-medium text-gray-700">
            Your Current Plan:
          </span>
          <Badge className={`${getStatusColor(status)} font-medium px-3 py-1`}>
            {formatPlanName(planName)}
          </Badge>
          {status === 'active' && profile.subscription_end_date && (
            <span className="text-sm text-gray-600">
              (Renews: {new Date(profile.subscription_end_date).toLocaleDateString()})
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
