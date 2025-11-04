
import React from 'react';
import { Check, Sparkle, Unlock, Clock, Mail, Edit, MessageCircle, Star } from 'lucide-react';
import PricingTier from './PricingTier';
import { SubscriptionPlan, getEffectivePlanStatus } from '@/lib/plan_rules';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '../speech/hooks/useProfile';

type PricingPeriod = 'monthly' | 'yearly';

interface PricingTiersProps {
	pricingPeriod: PricingPeriod;
}

const productIds = {
	price_premium_monthly: 'price_1RAP4ARpjThCjn22l1gJgbj7',
	price_premium_yearly: 'price_1RAP4ARpjThCjn22ndn40xT2',
	price_pro_monthly: 'price_1RAP4ARpjThCjn220EX7m28A',
	price_pro_yearly: 'price_1RAP4ARpjThCjn22OYzdydQi'
};

const PricingTiers: React.FC<PricingTiersProps> = ({ pricingPeriod }) => {
	const { user } = useAuth();
	const { profile } = useProfile();

	const isCurrentPlan = (planType: SubscriptionPlan) => {
		if (!user || !profile) return false;
		
		// Use effective plan status to determine current plan
		const userSubscription = {
			id: profile.id,
			userId: user.id,
			planType: profile.subscription_plan as SubscriptionPlan,
			status: profile.subscription_status || 'inactive',
			startDate: profile.subscription_start_date ? new Date(profile.subscription_start_date) : new Date(),
			endDate: profile.subscription_end_date ? new Date(profile.subscription_end_date) : null,
			usageStats: {
				speechesUsed: 0,
				storageUsed: 0,
				teamMembersAdded: 0
			}
		};

		const effectiveStatus = getEffectivePlanStatus(userSubscription);
		return effectiveStatus.isActive && effectiveStatus.effectivePlan === planType;
	};

	const pricingTiers = [
		{
			name: 'Basic / Free Trial',
			planType: SubscriptionPlan.FREE_TRIAL,
			price: {
				monthly: {
					price: '$0.00',
					productId: 'price_1RAP4ARpjThCjn222BclPsS7',
				},
				yearly: {
					price: 'Free Trial',
					productId: 'price_1RAP4ARpjThCjn222BclPsS7',
				},
			},
			description: 'Perfect for individuals starting their speaking journey',
			features: [
				{
					text: 'One Speech: Create a single speech for any occasion',
					description: 'Perfect for those special moments that need the perfect words.',
					icon: <Sparkle className="h-5 w-5 text-pink-500 mr-2 mt-0.5 flex-shrink-0" />
				},
				{
					text: 'Unlock Expert Tips: Explore Our Speech Writing Secrets',
					description: 'Access valuable insights to enhance your speech-writing skills.',
					icon: <Unlock className="h-5 w-5 text-pink-500 mr-2 mt-0.5 flex-shrink-0" />
				},
				{
					text: '7-Day Access: Revisit and Refine Your Speech Anytime',
					description: 'Enjoy a full week to access your speech file and our robust system.',
					icon: <Clock className="h-5 w-5 text-pink-500 mr-2 mt-0.5 flex-shrink-0" />
				}
			],
		},
		{
			name: 'Premium Plan',
			planType: SubscriptionPlan.PREMIUM,
			price: {
				monthly: {
					price: '$9.99',
					productId: productIds.price_premium_monthly,
				},
				yearly: {
					price: '$99.99',
					productId: productIds.price_premium_yearly,
				},
			},
			description: 'For serious speakers who need more power',
			features: [
				{
					text: 'Craft Up to 3 Speeches per Month',
					description: 'Enjoy the freedom to create up to 3 speeches for any occasion each month.',
					icon: <Star className="h-5 w-5 text-pink-500 mr-2 mt-0.5 flex-shrink-0" />
				},
				{
					text: 'Advanced Speech Writing Insights',
					description: 'Dive deeper with advanced tips and techniques to enhance your speech-writing prowess.',
					icon: <Edit className="h-5 w-5 text-pink-500 mr-2 mt-0.5 flex-shrink-0" />
				},
				{
					text: 'Continuous Access: Manage and Modify Speeches Anytime',
					description: 'Keep your speeches handy with ongoing access, allowing you to update and refine whenever needed.',
					icon: <Clock className="h-5 w-5 text-pink-500 mr-2 mt-0.5 flex-shrink-0" />
				},
				{
					text: 'Personalized Feedback: Expert Guidance at Your Fingertips',
					description: 'Receive tailored feedback from our AI to ensure your speeches are impactful and engaging.',
					icon: <MessageCircle className="h-5 w-5 text-pink-500 mr-2 mt-0.5 flex-shrink-0" />
				},
				{
					text: 'Priority Email Support',
					description: 'Access our dedicated support team for quick assistance and guidance.',
					icon: <Mail className="h-5 w-5 text-pink-500 mr-2 mt-0.5 flex-shrink-0" />
				}
			],
		},
		{
			name: 'Pro Plan',
			planType: SubscriptionPlan.PRO,
			price: {
				monthly: {
					price: '$29.99',
					productId: productIds.price_pro_monthly,
				},
				yearly: {
					price: '$299.99',
					productId: productIds.price_pro_yearly,
				},
			},
			description: 'Full-featured plan for professional speakers',
			features: [
				{
					text: 'Unlimited Speech Creations',
					description: 'Create an unlimited number of speeches for any event, ensuring you\'re always prepared.',
					icon: <Star className="h-5 w-5 text-pink-500 mr-2 mt-0.5 flex-shrink-0" />
				},
				{
					text: 'Comprehensive Speech Toolkit',
					description: 'Access an extensive library of resources and templates tailored for various speech types.',
					icon: <Edit className="h-5 w-5 text-pink-500 mr-2 mt-0.5 flex-shrink-0" />
				},
				{
					text: 'Ongoing Access: Your Speech Vault',
					description: 'Maintain continuous access to all your speeches and materials, allowing for updates and refinements anytime.',
					icon: <Clock className="h-5 w-5 text-pink-500 mr-2 mt-0.5 flex-shrink-0" />
				},
				{
					text: 'Enhanced Personalized Feedback',
					description: 'Benefit from advanced, tailored feedback from our AI to maximize the impact of your speeches.',
					icon: <MessageCircle className="h-5 w-5 text-pink-500 mr-2 mt-0.5 flex-shrink-0" />
				},
				{
					text: 'Fast-Track Support: Direct Assistance, Anytime',
					description: 'Experience expedited support for immediate assistance and a seamless experience.',
					icon: <Mail className="h-5 w-5 text-pink-500 mr-2 mt-0.5 flex-shrink-0" />
				}
			],
		},
	];

	return (
		<div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
			{pricingTiers.map((tier) => (
				<PricingTier
					key={tier.name}
					planType={tier.planType}
					name={tier.name}
					price={tier.price}
					description={tier.description}
					features={tier.features}
					pricingPeriod={pricingPeriod}
					isCurrentPlan={isCurrentPlan(tier.planType)}
				/>
			))}
		</div>
	);
};

export default PricingTiers;
