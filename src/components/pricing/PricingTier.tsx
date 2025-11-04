
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
		disabledReason,
		isRenewal,
		isUpgrade,
		isSwitch,
		effectiveStatus
	} = usePricingTierLogic(planType);

	// Use effective status to determine if this is the current plan
	const actuallyCurrentPlan = effectiveStatus?.isActive && 
		effectiveStatus.effectivePlan === planType;

	const { handleStripeCheckout } = usePricingTierCheckout({
		planType,
		pricingPeriod,
		price,
		user,
		isPlanDisabled,
		hasUsedFreeTrial
	});

	return (
		<PricingTierCard isCurrentPlan={actuallyCurrentPlan} isPlanDisabled={isPlanDisabled}>
			<PricingTierHeader 
				name={name}
				isCurrentPlan={actuallyCurrentPlan}
				isPlanDisabled={isPlanDisabled}
			/>
			
			<PricingTierPrice
				price={price}
				pricingPeriod={pricingPeriod}
				planType={planType}
				isCurrentPlan={actuallyCurrentPlan}
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
				isCurrentPlan={actuallyCurrentPlan}
				isPlanDisabled={isPlanDisabled}
				disabledReason={disabledReason}
			/>

			<PricingTierButton
				planType={planType}
				isCurrentPlan={actuallyCurrentPlan}
				isPlanDisabled={isPlanDisabled}
				cannotUseFreeTrialAgain={cannotUseFreeTrialAgain && !actuallyCurrentPlan}
				isRenewal={isRenewal}
				isUpgrade={isUpgrade}
				isSwitch={isSwitch}
				onClick={handleStripeCheckout}
			/>
		</PricingTierCard>
	);
};

export default PricingTier;
