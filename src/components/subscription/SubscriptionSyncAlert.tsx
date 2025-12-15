import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePlanLimits } from '@/hooks/usePlanLimits';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ButtonCustom } from '@/components/ui/button-custom';
import { RefreshCw, AlertTriangle, X } from 'lucide-react';
export const SubscriptionSyncAlert: React.FC = () => {
  const {
    user,
    profile,
    refreshUserData
  } = useAuth();
  const planLimits = usePlanLimits();
  const [isDismissed, setIsDismissed] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastCheck, setLastCheck] = useState<Date>(new Date());

  // Check if there might be a sync issue
  const hasPotentialSyncIssue = React.useMemo(() => {
    if (!user || !profile) return false;

    // Check if plan limits show trial but profile might indicate otherwise
    const profilePlan = profile.subscription_plan;
    const effectivePlan = planLimits.effectivePlan;

    // If the profile shows premium/pro but effective plan is trial, there might be a sync issue
    if ((profilePlan === 'premium' || profilePlan === 'pro') && effectivePlan === 'free_trial') {
      return true;
    }

    // If user can't create speeches but has a premium plan
    if ((profilePlan === 'premium' || profilePlan === 'pro') && !planLimits.canCreateSpeech) {
      return true;
    }
    return false;
  }, [user, profile, planLimits]);

  // Auto-refresh every 60 seconds if there's a potential sync issue
  useEffect(() => {
    if (!hasPotentialSyncIssue) return;
    const interval = setInterval(async () => {
      console.log('🔄 Auto-checking subscription sync due to potential issue');
      await handleRefresh();
    }, 60000);
    return () => clearInterval(interval);
  }, [hasPotentialSyncIssue]);
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      console.log('🔄 Refreshing subscription data due to sync alert');
      await refreshUserData(true);
      await planLimits.refreshPlanData();
      setLastCheck(new Date());
    } catch (error) {
      console.error('Error refreshing subscription data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };
  const handleDismiss = () => {
    setIsDismissed(true);
    // Auto-show again after 5 minutes if issue persists
    setTimeout(() => {
      if (hasPotentialSyncIssue) {
        setIsDismissed(false);
      }
    }, 5 * 60 * 1000);
  };

  // Don't show if dismissed or no potential issue
  if (isDismissed || !hasPotentialSyncIssue) {
    return null;
  }
  return;
};