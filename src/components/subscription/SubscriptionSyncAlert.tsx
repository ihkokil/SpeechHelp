import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePlanLimits } from '@/hooks/usePlanLimits';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ButtonCustom } from '@/components/ui/button-custom';
import { RefreshCw, AlertTriangle, X } from 'lucide-react';

export const SubscriptionSyncAlert: React.FC = () => {
  const { user, profile, refreshUserData } = useAuth();
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

  return (
    <Alert className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
      <AlertTriangle className="h-4 w-4 text-orange-600" />
      <div className="flex-1">
        <AlertTitle className="text-orange-800 dark:text-orange-200">
          Subscription Sync Issue Detected
        </AlertTitle>
        <AlertDescription className="text-orange-700 dark:text-orange-300 mt-1">
          Your account shows a premium subscription in the admin panel, but the system is treating it as a trial account. 
          This might be due to caching. Click refresh to sync your subscription data.
          <div className="text-xs mt-1 text-orange-600 dark:text-orange-400">
            Last checked: {lastCheck.toLocaleTimeString()}
          </div>
        </AlertDescription>
      </div>
      <div className="flex items-center space-x-2 ml-4">
        <ButtonCustom
          onClick={handleRefresh}
          disabled={isRefreshing}
          size="sm"
          variant="outline"
          className="text-orange-700 border-orange-300 hover:bg-orange-100"
        >
          <RefreshCw className={`h-3 w-3 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </ButtonCustom>
        <button
          onClick={handleDismiss}
          className="text-orange-600 hover:text-orange-800"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </Alert>
  );
};