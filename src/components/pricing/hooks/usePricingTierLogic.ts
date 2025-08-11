
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '../../speech/hooks/useProfile';
import { SubscriptionPlan } from '@/lib/plan_rules';

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

  // Check if user has a higher tier plan
  const currentPlanLevel = profile?.subscription_plan 
    ? getPlanHierarchyLevel(profile.subscription_plan as SubscriptionPlan) 
    : 0;
  const targetPlanLevel = getPlanHierarchyLevel(planType);
  const isLowerTierPlan = currentPlanLevel > targetPlanLevel;

  // Check if user has already used free trial
  const hasUsedFreeTrial = profile?.subscription_plan === 'free_trial' || 
    (profile?.subscription_start_date && profile?.subscription_plan !== null);
  const isFreeTrial = planType === SubscriptionPlan.FREE_TRIAL;
  const cannotUseFreeTrialAgain = isFreeTrial && hasUsedFreeTrial;

  // Determine if this plan should be disabled
  const isPlanDisabled = isLowerTierPlan || cannotUseFreeTrialAgain;

  const getDisabledReason = () => {
    if (isLowerTierPlan) {
      return `You already have a ${profile?.subscription_plan} plan, which is higher than this plan.`;
    }
    if (cannotUseFreeTrialAgain) {
      return 'You have already used your free trial. Please choose a paid plan to continue.';
    }
    return '';
  };

  return {
    user,
    profile,
    isPlanDisabled,
    cannotUseFreeTrialAgain,
    hasUsedFreeTrial,
    disabledReason: getDisabledReason()
  };
};
