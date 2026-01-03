
import { useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { createCheckoutSession } from '@/services/stripe';
import { useProfile } from '../../speech/hooks/useProfile';
import { SubscriptionPlan } from '@/lib/plan_rules';

type PricingPeriod = 'monthly' | 'yearly';

interface UsePricingTierCheckoutProps {
  planType: SubscriptionPlan;
  pricingPeriod: PricingPeriod;
  price: {
    monthly: { price: string; productId: string };
    yearly: { price: string; productId: string };
  };
  user: any;
  isPlanDisabled: boolean;
  hasUsedFreeTrial: boolean;
}

export const usePricingTierCheckout = ({
  planType,
  pricingPeriod,
  price,
  user,
  isPlanDisabled,
  hasUsedFreeTrial
}: UsePricingTierCheckoutProps) => {
  const { toast } = useToast();
  const { updateProfile } = useProfile();

  const handleStripeCheckout = useCallback(async () => {
    // Prevent action if plan is disabled
    if (isPlanDisabled) {
      return;
    }

    try {
      console.log('Starting checkout process for plan:', planType);
      
      // Handle free tier separately
      if (planType === SubscriptionPlan.FREE_TRIAL) {
        if (!user) {
          // Redirect to signup for non-authenticated users
          window.location.href = '/auth?plan=free_trial';
          return;
        }
        
        // Check if user already used free trial
        if (hasUsedFreeTrial) {
          toast({
            title: "Free Trial Already Used",
            description: "You have already used your free trial. Please choose a paid plan.",
            variant: "destructive"
          });
          return;
        }
        
        // Set up free trial for authenticated users
        const trialEndDate = new Date();
        trialEndDate.setDate(trialEndDate.getDate() + 7); // 7-day trial
        
        await updateProfile({
          subscription_plan: planType,
          subscription_start_date: new Date().toISOString(),
          subscription_end_date: trialEndDate.toISOString(),
          subscription_status: 'active',
        });
        
        toast({
          title: "Free Trial Activated",
          description: "Your 7-day free trial has started. Enjoy Speech Help!",
        });
        
        // Redirect to dashboard
        window.location.href = '/dashboard';
        return;
      }

      // Handle paid plans
      if (!user) {
        // Redirect to signup for non-authenticated users
        window.location.href = `/auth?plan=${planType.toLowerCase()}`;
        return;
      }

      // Show loading state
      toast({
        title: "Redirecting to checkout...",
        description: "Please wait while we set up your payment.",
      });

      console.log('Creating checkout session with params:', {
        plan: planType,
        priceId: pricingPeriod === 'monthly' ? price.monthly.productId : price.yearly.productId,
        userId: user?.id,
        pricingPeriod,
      });

      // Create checkout session with Supabase function
      const { url } = await createCheckoutSession({
        plan: planType,
        priceId: pricingPeriod === 'monthly' ? price.monthly.productId : price.yearly.productId,
        userId: user?.id,
        returnUrl: `${window.location.origin}/settings?tab=billing`,
        pricingPeriod,
      });

      console.log('Checkout session created, redirecting to:', url);

      // Redirect to Stripe Checkout
      if (url) {
        window.location.href = url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: 'Checkout Error',
        description: error instanceof Error ? error.message : 'There was a problem initiating checkout. Please try again.',
        variant: 'destructive',
      });
    }
  }, [planType, pricingPeriod, user, price, toast, updateProfile, isPlanDisabled, hasUsedFreeTrial]);

  return { handleStripeCheckout };
};
