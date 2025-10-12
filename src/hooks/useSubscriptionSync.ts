import { useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePlanLimits } from './usePlanLimits';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook for synchronizing subscription data across the application
 * Use this when you need to force refresh subscription data after admin changes
 */
export const useSubscriptionSync = () => {
  const { refreshUserData } = useAuth();
  const { refreshPlanData } = usePlanLimits();
  const { toast } = useToast();

  const syncSubscriptionData = useCallback(async (showToast: boolean = false) => {
    try {
      console.log('🔄 Starting subscription data sync...');
      
      // Force refresh both auth context and plan data
      await Promise.all([
        refreshUserData(true), // Force refresh with cache clear
        refreshPlanData()       // Clear plan cache and refresh
      ]);
      
      console.log('✅ Subscription data sync completed');
      
      if (showToast) {
        toast({
          title: "Subscription Updated",
          description: "Your subscription data has been refreshed successfully.",
        });
      }
    } catch (error) {
      console.error('❌ Error syncing subscription data:', error);
      
      if (showToast) {
        toast({
          title: "Sync Error",
          description: "Failed to refresh subscription data. Please try again.",
          variant: "destructive",
        });
      }
    }
  }, [refreshUserData, refreshPlanData, toast]);

  return {
    syncSubscriptionData
  };
};