
import { useState, useEffect, useCallback } from 'react';
import { LimitType } from '@/lib/plan_rules';
import { usePlanLimits } from './usePlanLimits';
import { useAuth } from '@/contexts/AuthContext';

interface CachedPlanAccess {
  hasAccess: boolean;
  canCreateSpeech: boolean;
  reasonCannotCreate?: string;
  shouldShowUpgrade: boolean;
  isExpired: boolean;
  isActive: boolean;
  timestamp: number;
}

const CACHE_DURATION = 2 * 60 * 1000; // Reduced to 2 minutes for more frequent checks
const CACHE_KEY_PREFIX = 'planAccess_';

export const useCachedPlanAccess = (limitType: LimitType, featureName: string) => {
  const { user } = useAuth();
  const planLimits = usePlanLimits();
  const [cachedAccess, setCachedAccess] = useState<CachedPlanAccess | null>(null);
  const [isInitialCheck, setIsInitialCheck] = useState(true);

  const cacheKey = user ? `${CACHE_KEY_PREFIX}${user.id}_${limitType}` : null;

  // Load cached data on mount
  useEffect(() => {
    if (!cacheKey) return;

    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const parsedCache: CachedPlanAccess = JSON.parse(cached);
        const isExpired = Date.now() - parsedCache.timestamp > CACHE_DURATION;
        
        if (!isExpired) {
          setCachedAccess(parsedCache);
          setIsInitialCheck(false);
          console.log(`✅ Using cached plan access for ${featureName}`, {
            canCreate: parsedCache.canCreateSpeech,
            isExpired: parsedCache.isExpired,
            isActive: parsedCache.isActive
          });
        } else {
          localStorage.removeItem(cacheKey);
          console.log(`🗑️ Expired cache removed for ${featureName}`);
        }
      }
    } catch (error) {
      console.error('Error loading cached plan access:', error);
    }
  }, [cacheKey, featureName]);

  // Update cache when plan limits are loaded
  useEffect(() => {
    if (!planLimits.loadingPlanLimits && cacheKey && !cachedAccess) {
      const newCachedAccess: CachedPlanAccess = {
        hasAccess: planLimits.canCreateSpeech,
        canCreateSpeech: planLimits.canCreateSpeech,
        reasonCannotCreate: planLimits.reasonCannotCreate,
        shouldShowUpgrade: planLimits.shouldShowUpgradePrompt,
        isExpired: planLimits.isExpired,
        isActive: planLimits.isActive,
        timestamp: Date.now()
      };

      setCachedAccess(newCachedAccess);
      setIsInitialCheck(false);

      try {
        localStorage.setItem(cacheKey, JSON.stringify(newCachedAccess));
        console.log(`💾 Cached plan access for ${featureName}`, {
          canCreate: newCachedAccess.canCreateSpeech,
          isExpired: newCachedAccess.isExpired,
          isActive: newCachedAccess.isActive
        });
      } catch (error) {
        console.error('Error caching plan access:', error);
      }
    }
  }, [
    planLimits.loadingPlanLimits, 
    planLimits.canCreateSpeech, 
    planLimits.reasonCannotCreate, 
    planLimits.shouldShowUpgradePrompt,
    planLimits.isExpired,
    planLimits.isActive,
    cacheKey, 
    cachedAccess, 
    featureName
  ]);

  const clearCache = useCallback(() => {
    if (cacheKey) {
      localStorage.removeItem(cacheKey);
      setCachedAccess(null);
      setIsInitialCheck(true); // Reset to force fresh fetch
      console.log(`🧹 Cleared cache for ${featureName}`);
    }
  }, [cacheKey, featureName]);

  // If subscription is expired or inactive, always deny access regardless of cache
  const effectiveAccess = cachedAccess?.isExpired || !cachedAccess?.isActive ? false : 
    (cachedAccess?.canCreateSpeech ?? planLimits.canCreateSpeech);

  // Return cached data if available, otherwise use live data
  const isLoading = isInitialCheck && planLimits.loadingPlanLimits && !cachedAccess;
  
  return {
    loadingPlanLimits: isLoading,
    canCreateSpeech: effectiveAccess,
    reasonCannotCreate: cachedAccess?.reasonCannotCreate ?? planLimits.reasonCannotCreate,
    shouldShowUpgradePrompt: cachedAccess?.shouldShowUpgrade ?? planLimits.shouldShowUpgradePrompt,
    isExpired: cachedAccess?.isExpired ?? planLimits.isExpired,
    isActive: cachedAccess?.isActive ?? planLimits.isActive,
    clearCache,
    hasCachedData: !!cachedAccess
  };
};
