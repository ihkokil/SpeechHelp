import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useSubscriptionSync } from './useSubscriptionSync';

export const usePlanPurchaseNotification = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();
  const { syncSubscriptionData } = useSubscriptionSync();

  useEffect(() => {
    const purchaseComplete = searchParams.get('purchase_complete');
    const trialActivated = searchParams.get('trial_activated');

    if (purchaseComplete === 'true') {
      // Sync subscription data first
      syncSubscriptionData(false);
      
      // Show success message
      toast({
        title: "🎉 Plan Activated Successfully!",
        description: "Your new subscription is active and your speech allowance has been reset. You can now create speeches with your fresh credits!",
        duration: 6000,
      });

      // Remove the search param
      searchParams.delete('purchase_complete');
      setSearchParams(searchParams, { replace: true });
    }

    if (trialActivated === 'true') {
      toast({
        title: "🎉 Free Trial Started!",
        description: "Your 7-day free trial is now active. Enjoy exploring Speech Help!",
        duration: 5000,
      });

      // Remove the search param
      searchParams.delete('trial_activated');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams, toast, syncSubscriptionData]);
};