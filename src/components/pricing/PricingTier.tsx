
import React from 'react';
import { SubscriptionPlan } from '@/lib/plan_rules';
import PricingTierCard from './components/PricingTierCard';
import PricingTierHeader from './components/PricingTierHeader';
import PricingTierPrice from './components/PricingTierPrice';
import PricingTierFeatures from './components/PricingTierFeatures';
import PricingTierDisabledMessage from './components/PricingTierDisabledMessage';
import PricingTierButton from './components/PricingTierButton';
import { usePricingTierLogic } from './hooks/usePricingTierLogic';
import { usePricingTierCheckout } from './hooks/usePricingTierCheckout';

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
	const {
		user,
		isPlanDisabled,
		cannotUseFreeTrialAgain,
		hasUsedFreeTrial,
		disabledReason
	} = usePricingTierLogic(planType);

	const { handleStripeCheckout } = usePricingTierCheckout({
		planType,
		pricingPeriod,
		price,
		user,
		isPlanDisabled,
		hasUsedFreeTrial
	});

	return (
		<PricingTierCard isCurrentPlan={isCurrentPlan} isPlanDisabled={isPlanDisabled}>
			<PricingTierHeader 
				name={name}
				isCurrentPlan={isCurrentPlan}
				isPlanDisabled={isPlanDisabled}
			/>
			
			<PricingTierPrice
				price={price}
				pricingPeriod={pricingPeriod}
				planType={planType}
				isCurrentPlan={isCurrentPlan}
				isPlanDisabled={isPlanDisabled}
			/>
			
			<p className={`text-center mb-6 ${isPlanDisabled ? 'text-gray-400' : 'text-gray-600'}`}>
				{description}
			</p>

			<PricingTierFeatures 
				features={features}
				isPlanDisabled={isPlanDisabled}
			/>

			<PricingTierDisabledMessage
				isCurrentPlan={isCurrentPlan}
				isPlanDisabled={isPlanDisabled}
				disabledReason={disabledReason}
			/>

			<PricingTierButton
				planType={planType}
				isCurrentPlan={isCurrentPlan}
				isPlanDisabled={isPlanDisabled}
				cannotUseFreeTrialAgain={cannotUseFreeTrialAgain && !isCurrentPlan}
				onClick={handleStripeCheckout}
			/>
		</PricingTierCard>
	);
};

export default PricingTier;
