import React, { useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePlanLimits } from './usePlanLimits';
import { SubscriptionCacheManager } from '@/lib/plan_rules';
import { supabase } from '@/integrations/supabase/client';

interface SubscriptionPollingOptions {
  /** Polling interval in milliseconds (default: 30 seconds) */
  intervalMs?: number;
  /** Whether to enable polling (default: true) */
  enabled?: boolean;
  /** Whether to poll more frequently when on speech-related pages */
  aggressiveOnSpeechPages?: boolean;
}

/**
 * Hook that periodically checks for subscription updates from the admin backend
 * This helps ensure that when admins update user subscriptions, the changes
 * are reflected on the frontend without requiring a page refresh
 */
export const useSubscriptionPolling = (options: SubscriptionPollingOptions = {}) => {
  const {
    intervalMs = 30 * 1000, // Reduced to 30 seconds default for faster admin update detection
    enabled = true,
    aggressiveOnSpeechPages = true
  } = options;

  const { user, profile, refreshUserData } = useAuth();
  const planLimits = usePlanLimits();
  const lastPollRef = useRef<Date>(new Date());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Determine if we're on a speech-related page for aggressive polling
  const isOnSpeechPage = React.useMemo(() => {
    if (!aggressiveOnSpeechPages) return false;
    const pathname = window.location.pathname;
    return pathname.includes('speech') || pathname.includes('create') || pathname.includes('edit');
  }, [aggressiveOnSpeechPages]);

  // Use more frequent polling on speech pages
  const effectiveInterval = isOnSpeechPage ? Math.min(intervalMs, 2 * 60 * 1000) : intervalMs;

  const checkForSubscriptionUpdates = async () => {
    if (!user || !profile) return;

    try {
      console.log('🔍 Polling for subscription updates...');
      
      // Get the latest profile data without clearing cache first
      const { data: latestProfile, error } = await supabase
        .from('profiles')
        .select('subscription_plan, subscription_status, subscription_end_date, updated_at')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error polling for subscription updates:', error);
        return;
      }

      // Check if the subscription data has changed
      const hasSubscriptionChanged = (
        latestProfile.subscription_plan !== profile.subscription_plan ||
        latestProfile.subscription_status !== profile.subscription_status ||
        latestProfile.subscription_end_date !== profile.subscription_end_date
      );

      // Check if the profile was updated more recently than our last poll
      const latestUpdateTime = new Date(latestProfile.updated_at);
      const wasUpdatedSinceLastPoll = latestUpdateTime > lastPollRef.current;

      // ADMIN UPDATE PROTECTION: If the profile was updated very recently (within last 2 minutes),
      // it might be an admin update, so we should refresh to show the new data
      const veryRecentUpdate = (Date.now() - latestUpdateTime.getTime()) < (2 * 60 * 1000);

      if (hasSubscriptionChanged || wasUpdatedSinceLastPoll || veryRecentUpdate) {
        console.log('📊 Subscription change detected, refreshing data...', {
          planChanged: latestProfile.subscription_plan !== profile.subscription_plan,
          statusChanged: latestProfile.subscription_status !== profile.subscription_status,
          endDateChanged: latestProfile.subscription_end_date !== profile.subscription_end_date,
          updatedSinceLastPoll: wasUpdatedSinceLastPoll,
          veryRecentUpdate: veryRecentUpdate,
          lastPoll: lastPollRef.current.toISOString(),
          latestUpdate: latestUpdateTime.toISOString()
        });

        // Clear caches and force refresh
        SubscriptionCacheManager.clearAllSubscriptionCache();
        await refreshUserData(true);
        await planLimits.refreshPlanData();
      } else {
        console.log('✅ No subscription changes detected');
      }

      lastPollRef.current = new Date();
    } catch (error) {
      console.error('Error in subscription polling:', error);
    }
  };

  useEffect(() => {
    if (!enabled || !user) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    console.log(`🔄 Starting subscription polling every ${effectiveInterval / 1000}s`);
    
    // Start polling
    intervalRef.current = setInterval(checkForSubscriptionUpdates, effectiveInterval);

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [enabled, user, effectiveInterval]);

  // Also check when the user first loads or changes
  useEffect(() => {
    if (user && enabled) {
      // Small delay to avoid race conditions with initial auth setup
      const timeoutId = setTimeout(checkForSubscriptionUpdates, 2000);
      return () => clearTimeout(timeoutId);
    }
  }, [user, enabled]);

  return {
    lastPollTime: lastPollRef.current,
    isPolling: enabled && !!user && !!intervalRef.current,
    forceCheck: checkForSubscriptionUpdates
  };
};