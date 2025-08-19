
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { User } from '../../types';
import { useTranslatedContent } from '@/hooks/useTranslatedContent';

interface StatusBadgeProps {
  user: User;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ user }) => {
  const { translate } = useTranslatedContent();
  
  return (
    <Badge 
      variant={user.is_active !== false ? "default" : "secondary"}
      className={`min-w-[80px] h-6 justify-center ${user.is_active !== false ? "bg-green-100 text-green-800 border-green-200" : "bg-gray-100 text-gray-800 border-gray-200"}`}
    >
      {user.is_active !== false ? translate('admin.status.active') : translate('admin.status.inactive')}
    </Badge>
  );
};

interface RoleBadgeProps {
  user: User;
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({ user }) => {
  const { translate } = useTranslatedContent();
  
  return (
    <>
      {user.is_admin ? (
        <Badge variant="outline" className="min-w-[80px] h-6 justify-center bg-blue-50 text-blue-700 border-blue-200">
          {translate('admin.role.admin')}
        </Badge>
      ) : (
        <Badge variant="outline" className="min-w-[80px] h-6 justify-center bg-gray-50 text-gray-700 border-gray-200">
          {translate('admin.role.user')}
        </Badge>
      )}
    </>
  );
};

interface SubscriptionBadgeProps {
  user: User;
}

export const SubscriptionBadge: React.FC<SubscriptionBadgeProps> = ({ user }) => {
  const { translate } = useTranslatedContent();
  
  // Format subscription plan for display with proper colors
  const formatSubscriptionPlan = (plan: string | null | undefined) => {
    const planType = plan || 'free_trial';
    let planName = '';
    
    switch (planType) {
      case 'free_trial':
        planName = translate('admin.plan.freeTrial');
        break;
      case 'premium':
        planName = translate('admin.plan.premium');
        break;
      case 'pro':
        planName = translate('admin.plan.pro');
        break;
      default:
        planName = translate('admin.plan.freeTrial');
    }
    
    // Define colors for each plan without hover effects
    let badgeClasses = '';
    switch (planType.toLowerCase()) {
      case 'free_trial':
        badgeClasses = 'bg-gray-100 text-gray-800 border-gray-200';
        break;
      case 'premium':
        badgeClasses = 'bg-blue-100 text-blue-800 border-blue-200';
        break;
      case 'pro':
        badgeClasses = 'bg-purple-100 text-purple-800 border-purple-200';
        break;
      default:
        badgeClasses = 'bg-gray-100 text-gray-800 border-gray-200';
    }
    
    return { name: planName, classes: badgeClasses };
  };

  const subscriptionPlan = formatSubscriptionPlan(user.subscription_plan);
  
  return (
    <Badge variant="outline" className={`min-w-[80px] h-6 justify-center ${subscriptionPlan.classes}`}>
      {subscriptionPlan.name}
    </Badge>
  );
};
