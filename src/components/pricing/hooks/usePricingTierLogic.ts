
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '../../speech/hooks/useProfile';
import { SubscriptionPlan, getEffectivePlanStatus } from '@/lib/plan_rules';

// Plan hierarchy: PRO > PREMIUM > FREE_TRIAL
const getPlanHierarchyLevel = (plan: SubscriptionPlan): number => {
  switch (plan) {
    case SubscriptionPlan.PRO:
      return 3;
    case SubscriptionPlan.PREMIUM:
      return 2;
    case SubscriptionPlan.FREE_TRIAL:
      return 1;
    default:
      return 0;
  }
};

export const usePricingTierLogic = (planType: SubscriptionPlan) => {
  const { user } = useAuth();
  const { profile } = useProfile();

  // Get effective plan status considering expiration
  const userSubscription = profile ? {
    id: profile.id,
    userId: user?.id || '',
    planType: profile.subscription_plan as SubscriptionPlan,
    status: profile.subscription_status || 'inactive',
    startDate: profile.subscription_start_date ? new Date(profile.subscription_start_date) : new Date(),
    endDate: profile.subscription_end_date ? new Date(profile.subscription_end_date) : null,
    usageStats: {
      speechesUsed: 0,
      storageUsed: 0,
      teamMembersAdded: 0
    }
  } : null;

  const effectiveStatus = userSubscription ? getEffectivePlanStatus(userSubscription) : null;
  
  // Use effective plan instead of raw subscription plan
  const currentPlanLevel = effectiveStatus?.effectivePlan 
    ? getPlanHierarchyLevel(effectiveStatus.effectivePlan) 
    : 0;
  const targetPlanLevel = getPlanHierarchyLevel(planType);
  
  // Only disable lower tier plans if the current plan is active
  const isLowerTierPlan = effectiveStatus?.isActive && currentPlanLevel > targetPlanLevel;

  // Check if user has already used free trial
  const hasUsedFreeTrial = profile?.subscription_plan === 'free_trial' || 
    (profile?.subscription_start_date && profile?.subscription_plan !== null);
  
  const isFreeTrial = planType === SubscriptionPlan.FREE_TRIAL;
  const cannotUseFreeTrialAgain = isFreeTrial && hasUsedFreeTrial;

  // Determine if this plan should be disabled
  const isPlanDisabled = isLowerTierPlan || cannotUseFreeTrialAgain;

  // Determine button action type for expired users
  const isCurrentPlanType = profile?.subscription_plan === planType;
  const isRenewal = isCurrentPlanType && effectiveStatus?.isExpired;
  const isUpgrade = !effectiveStatus?.isActive && currentPlanLevel < targetPlanLevel;
  const isSwitch = effectiveStatus?.isExpired && !isCurrentPlanType;

  const getDisabledReason = () => {
    if (isLowerTierPlan) {
      return `You already have an active ${effectiveStatus?.effectivePlan} plan, which is higher than this plan.`;
    }
    if (cannotUseFreeTrialAgain) {
      return 'You have already used your free trial. Free trials are limited to one per lifetime. Please choose a paid plan to continue.';
    }
    return '';
  };

  return {
    user,
    profile,
    isPlanDisabled,
    cannotUseFreeTrialAgain,
    hasUsedFreeTrial,
    isTrialExpired: effectiveStatus?.isExpired || false,
    isRenewal,
    isUpgrade,
    isSwitch,
    effectiveStatus,
    disabledReason: getDisabledReason()
  };
};
