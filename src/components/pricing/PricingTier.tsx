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
import { Crown, CheckCircle } from 'lucide-react';

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

	// Determine if this is a popular/recommended plan
	const isPopular = planType === SubscriptionPlan.PREMIUM;

	return (
		<Card className={`relative border rounded-2xl h-full overflow-hidden transition-all duration-300 ${
			isCurrentPlan 
				? 'border-4 border-gradient-to-r from-pink-500 to-purple-600 bg-gradient-to-br from-purple-50 to-pink-50 shadow-2xl scale-105 ring-4 ring-purple-200 ring-opacity-50' 
				: isPopular
				? 'border-2 border-purple-300 shadow-xl hover:shadow-2xl hover:scale-105'
				: 'border-2 border-gray-200 shadow-lg hover:shadow-xl hover:scale-102'
		}`}>
			{/* Current Plan Badge */}
			{isCurrentPlan && (
				<div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
					<Badge className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-2 text-sm font-bold shadow-lg">
						<Crown className="w-4 h-4 mr-2" />
						Your Plan
					</Badge>
				</div>
			)}

			{/* Popular Badge */}
			{isPopular && !isCurrentPlan && (
				<div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
					<Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 text-sm font-bold shadow-lg">
						Most Popular
					</Badge>
				</div>
			)}

			<div className="p-8 h-full flex flex-col relative">
				{/* Plan Header */}
				<div className="text-center mb-6">
					<h3 className={`text-2xl font-bold mb-2 ${
						isCurrentPlan ? 'text-purple-700' : 'text-gray-900'
					}`}>
						{name}
					</h3>
					<div className="flex items-end justify-center mb-4">
						<span className={`text-5xl font-bold ${
							isCurrentPlan ? 'text-purple-600' : 'text-gray-900'
						}`}>
							{pricingPeriod === 'monthly' ? price.monthly.price : price.yearly.price}
						</span>
						{pricingPeriod === 'monthly' && planType !== SubscriptionPlan.FREE_TRIAL && (
							<span className="text-gray-500 ml-2 text-lg">/month</span>
						)}
						{pricingPeriod === 'yearly' && planType !== SubscriptionPlan.FREE_TRIAL && (
							<span className="text-gray-500 ml-2 text-lg">/year</span>
						)}
					</div>
					<p className={`text-center mb-6 ${
						isCurrentPlan ? 'text-purple-600' : 'text-gray-600'
					}`}>
						{description}
					</p>
				</div>

				{/* Features List */}
				<ul className="space-y-4 mb-8 flex-grow">
					{(features || []).map((feature, index) => (
						<li key={index} className="flex items-start">
							{feature.icon || (
								<CheckCircle className={`h-5 w-5 mr-3 mt-0.5 flex-shrink-0 ${
									isCurrentPlan ? 'text-purple-500' : 'text-green-500'
								}`} />
							)}
							<div>
								<span className={`font-medium ${
									isCurrentPlan ? 'text-purple-700' : 'text-gray-700'
								}`}>
									{feature.text}
								</span>
								{feature.description && (
									<p className={`text-sm mt-1 ${
										isCurrentPlan ? 'text-purple-600' : 'text-gray-500'
									}`}>
										{feature.description}
									</p>
								)}
							</div>
						</li>
					))}
				</ul>

				{/* Action Button */}
				<Button
					className={`w-full py-4 text-lg font-semibold transition-all duration-300 ${
						isCurrentPlan 
							? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white cursor-default shadow-lg' 
							: planType === SubscriptionPlan.FREE_TRIAL
							? 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white'
							: 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl'
					}`}
					onClick={isCurrentPlan ? undefined : handleStripeCheckout}
					disabled={isCurrentPlan}
				>
					{isCurrentPlan && <CheckCircle className="w-5 h-5 mr-2" />}
					{getButtonText()}
				</Button>
			</div>
		</Card>
	);
};

export default PricingTier;
