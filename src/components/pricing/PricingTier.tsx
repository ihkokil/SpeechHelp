import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import PricingFeature from './PricingFeature';
import { createCheckoutSession } from '@/services/stripe';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '../speech/hooks/useProfile';
import { SubscriptionPlan } from '@/lib/plan_rules';

type PricingPeriod = 'monthly' | 'yearly';

interface PricingTierProps {
	name: string;
	planType: SubscriptionPlan;
	price: {
		monthly: { price: string; productId: string };
		yearly: { price: string; productId: string };
	};
	description: string;
	features: {
		text: string;
		description?: string;
		icon?: React.ReactNode;
	}[];
	pricingPeriod: PricingPeriod;
	isCurrentPlan?: boolean;
}

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

const PricingTier: React.FC<PricingTierProps> = ({
	name,
	planType,
	price,
	description,
	features,
	pricingPeriod,
	isCurrentPlan = false,
}) => {
	const { toast } = useToast();
	const { user } = useAuth();
	const { profile, updateProfile } = useProfile();

	// Check if user has a higher tier plan
	const currentPlanLevel = profile?.subscription_plan ? getPlanHierarchyLevel(profile.subscription_plan as SubscriptionPlan) : 0;
	const targetPlanLevel = getPlanHierarchyLevel(planType);
	const isLowerTierPlan = currentPlanLevel > targetPlanLevel;

	// Check if user has already used free trial
	const hasUsedFreeTrial = profile?.subscription_plan === 'free_trial' || 
		(profile?.subscription_start_date && profile?.subscription_plan !== null);
	const isFreeTrial = planType === SubscriptionPlan.FREE_TRIAL;
	const cannotUseFreeTrialAgain = isFreeTrial && hasUsedFreeTrial && !isCurrentPlan;

	// Determine if this plan should be disabled
	const isPlanDisabled = isLowerTierPlan || cannotUseFreeTrialAgain;

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

	const getButtonText = () => {
		if (isCurrentPlan) {
			return 'Current Plan';
		}
		if (cannotUseFreeTrialAgain) {
			return 'Already Used';
		}
		if (planType === SubscriptionPlan.FREE_TRIAL) {
			return 'Start Free Trial';
		}
		return 'Choose Plan';
	};

	const getDisabledReason = () => {
		if (isLowerTierPlan) {
			return `You already have a ${profile?.subscription_plan} plan, which is higher than this plan.`;
		}
		if (cannotUseFreeTrialAgain) {
			return 'You have already used your free trial. Please choose a paid plan to continue.';
		}
		return '';
	};

	return (
		<Card className={`border rounded-xl h-full overflow-hidden transition-all duration-300 ${
			isCurrentPlan 
				? 'border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 shadow-xl ring-2 ring-purple-200' 
				: isPlanDisabled
				? 'border-gray-200 bg-gray-50 opacity-60'
				: 'border-gray-200 hover:border-purple-300 hover:shadow-lg'
		}`}>
			<div className="p-6 md:p-8 h-full flex flex-col relative">
				{isCurrentPlan && (
					<div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center py-2 text-sm font-medium">
						Your Current Plan
					</div>
				)}
				
				<div className={`text-center mb-2 ${isCurrentPlan ? 'mt-8' : ''}`}>
					<h3 className={`text-2xl font-bold mb-2 ${isPlanDisabled ? 'text-gray-500' : 'text-gray-900'}`}>
						{name}
					</h3>
					{isCurrentPlan && (
						<div className="flex justify-center">
							<Badge className="bg-purple-600 text-white">
								Active
							</Badge>
						</div>
					)}
				</div>
				<div className="flex items-end justify-center mb-6">
					<span className={`text-4xl font-bold ${
						isCurrentPlan ? 'text-purple-700' : 
						isPlanDisabled ? 'text-gray-500' : 'text-purple-600'
					}`}>
						{pricingPeriod === 'monthly' ? price.monthly.price : price.yearly.price}
					</span>
					{pricingPeriod === 'monthly' && planType !== SubscriptionPlan.FREE_TRIAL && (
						<span className={`ml-2 ${isPlanDisabled ? 'text-gray-400' : 'text-gray-500'}`}>
							/month
						</span>
					)}
					{pricingPeriod === 'yearly' && planType !== SubscriptionPlan.FREE_TRIAL && (
						<span className={`ml-2 ${isPlanDisabled ? 'text-gray-400' : 'text-gray-500'}`}>
							/year
						</span>
					)}
				</div>
				<p className={`text-center mb-6 ${isPlanDisabled ? 'text-gray-400' : 'text-gray-600'}`}>
					{description}
				</p>

				<ul className="space-y-6 mb-8">
					{(features || []).map((feature, index) => (
						<PricingFeature
							key={index}
							text={feature.text}
							description={feature.description}
							icon={feature.icon}
							disabled={isPlanDisabled}
						/>
					))}
				</ul>

				{isPlanDisabled && !isCurrentPlan && (
					<div className="mb-4 p-3 bg-gray-100 rounded-lg">
						<p className="text-sm text-gray-600 text-center">
							{getDisabledReason()}
						</p>
					</div>
				)}

				<Button
					className={`w-full mt-auto ${
						isCurrentPlan 
							? 'bg-purple-600 hover:bg-purple-700 cursor-default opacity-75' 
							: isPlanDisabled
							? 'bg-gray-400 text-gray-600 cursor-not-allowed opacity-60'
							: 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700'
					}`}
					onClick={isCurrentPlan || isPlanDisabled ? undefined : handleStripeCheckout}
					disabled={isCurrentPlan || isPlanDisabled}
				>
					{getButtonText()}
				</Button>
			</div>
		</Card>
	);
};

export default PricingTier;
