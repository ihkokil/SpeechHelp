
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
	const { updateProfile } = useProfile();

	const handleStripeCheckout = useCallback(async () => {
		try {
			console.log('Starting checkout process for plan:', planType);
			
			// Handle free tier separately
			if (planType === SubscriptionPlan.FREE_TRIAL) {
				if (!user) {
					// Redirect to signup for non-authenticated users
					window.location.href = '/auth?plan=free_trial';
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
	}, [planType, pricingPeriod, user, price, toast, updateProfile]);

	const getButtonText = () => {
		if (isCurrentPlan) {
			return 'Current Plan';
		}
		if (planType === SubscriptionPlan.FREE_TRIAL) {
			return 'Start Free Trial';
		}
		return 'Choose Plan';
	};

	return (
		<Card className={`border rounded-xl h-full overflow-hidden hover:shadow-lg transition-shadow ${
			isCurrentPlan 
				? 'border-purple-500 bg-purple-50 shadow-lg' 
				: 'border-gray-200'
		}`}>
			<div className="p-6 md:p-8 h-full flex flex-col">
				<div className="flex items-center justify-between mb-2">
					<h3 className="text-2xl font-bold text-center text-gray-900">{name}</h3>
					{isCurrentPlan && (
						<Badge className="bg-purple-600 text-white">
							Your Plan
						</Badge>
					)}
				</div>
				<div className="flex items-end justify-center mb-6">
					<span className="text-4xl font-bold text-purple-600">
						{pricingPeriod === 'monthly' ? price.monthly.price : price.yearly.price}
					</span>
					{pricingPeriod === 'monthly' && planType !== SubscriptionPlan.FREE_TRIAL && (
						<span className="text-gray-500 ml-2">/month</span>
					)}
					{pricingPeriod === 'yearly' && planType !== SubscriptionPlan.FREE_TRIAL && (
						<span className="text-gray-500 ml-2">/year</span>
					)}
				</div>
				<p className="text-center text-gray-600 mb-6">{description}</p>

				<ul className="space-y-6 mb-8">
					{(features || []).map((feature, index) => (
						<PricingFeature
							key={index}
							text={feature.text}
							description={feature.description}
							icon={feature.icon}
						/>
					))}
				</ul>

				<Button
					className={`w-full mt-auto ${
						isCurrentPlan 
							? 'bg-purple-600 hover:bg-purple-700 cursor-default' 
							: 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700'
					}`}
					onClick={isCurrentPlan ? undefined : handleStripeCheckout}
					disabled={isCurrentPlan}
				>
					{getButtonText()}
				</Button>
			</div>
		</Card>
	);
};

export default PricingTier;
