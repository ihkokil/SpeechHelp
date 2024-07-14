
import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
}

const PricingTier: React.FC<PricingTierProps> = ({
	name,
	planType,
	price,
	description,
	features,
	pricingPeriod,
}) => {
	const { toast } = useToast();
	const { user } = useAuth();
	const { updateProfile } = useProfile();

	const handleStripeCheckout = useCallback(async () => {
		try {
			// Handle free tier separately
			if (planType === SubscriptionPlan.FREE_TRIAL) {
				if (!user) {
					// Redirect to signup for non-authenticated users
					window.location.href = '/signup?plan=free_trial';
					return;
				}
				
				// Set up free trial for authenticated users
				const trialEndDate = new Date();
				trialEndDate.setDate(trialEndDate.getDate() + 7); // 7-day trial
				
				await updateProfile({
					subscription_plan: planType,
					subscription_start_date: new Date().toISOString(),
					subscription_end_date: trialEndDate.toISOString(),
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
				window.location.href = `/signup?plan=${planType.toLowerCase()}`;
				return;
			}

			// Create checkout session with Supabase function
			const { url } = await createCheckoutSession({
				plan: planType,
				priceId: pricingPeriod === 'monthly' ? price.monthly.productId : price.yearly.productId,
				userId: user?.id,
				returnUrl: `${window.location.origin}/account`,
				pricingPeriod,
			});

			// Redirect to Stripe Checkout
			window.location.href = url;
		} catch (error) {
			console.error('Checkout error:', error);
			toast({
				title: 'Checkout Error',
				description: 'There was a problem initiating checkout. Please try again.',
				variant: 'destructive',
			});
		}
	}, [name, planType, pricingPeriod, user, price, toast, updateProfile]);

	return (
		<Card className="border border-gray-200 rounded-xl h-full overflow-hidden hover:shadow-lg transition-shadow">
			<div className="p-6 md:p-8 h-full flex flex-col">
				<h3 className="text-2xl font-bold text-center text-gray-900 mb-2">{name}</h3>
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
					className="w-full bg-gradient-to-r mt-auto from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
					onClick={handleStripeCheckout}
				>
					{planType === SubscriptionPlan.FREE_TRIAL ? 'Start Free Trial' : 'Choose Plan'}
				</Button>
			</div>
		</Card>
	);
};

export default PricingTier;
