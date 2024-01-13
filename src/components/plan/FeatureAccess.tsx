import React, { ReactNode } from 'react';
import { usePlanLimits } from '@/hooks/usePlanLimits';
import { LimitType, SubscriptionPlan, PLAN_RULES } from '@/lib/plan_rules';
import { PlanLimitBlock } from './PlanLimitBlock';
import { Loader2 } from 'lucide-react';

interface FeatureAccessProps {
	/**
	 * The feature being protected
	 * Checks if the user's plan includes this feature
	 */
	feature?: 'aiAnalysis' | 'teamCollaboration' | 'customBranding';

	/**
	 * The limit type to check
	 * Verifies the user hasn't reached this specific limit
	 */
	limitType?: LimitType;

	/**
	 * Minimum plan required to access this feature
	 * Ensures the user has at least this plan level
	 */
	minimumPlan?: SubscriptionPlan;

	/**
	 * Content to show when user has access to the feature
	 */
	children: ReactNode;

	/**
	 * Content to show when access is denied
	 * If not provided, will show a PlanLimitBlock
	 */
	fallback?: ReactNode;

	/**
	 * Name of the feature being protected
	 * Used in default error messages
	 */
	featureName?: string;

	/**
	 * Custom message to show when access is denied
	 */
	limitMessage?: string;

	/**
	 * Detailed explanation for upgrading
	 */
	limitDescription?: string;

	/**
	 * Custom URL for the upgrade button
	 */
	upgradeUrl?: string;

	/**
	 * Whether to show upgrade button in the block message
	 */
	showUpgradeButton?: boolean;

	/**
	 * Custom class for the limit block
	 */
	blockClassName?: string;
}

/**
 * Component that conditionally renders content based on the user's subscription plan
 * with improved UI for denied access cases
 */
export function FeatureAccess({
	feature,
	limitType,
	minimumPlan,
	children,
	fallback,
	featureName = 'this feature',
	limitMessage,
	limitDescription,
	upgradeUrl,
	showUpgradeButton = true,
	blockClassName,
}: FeatureAccessProps) {
	const planLimits = usePlanLimits();


	// 0. Check if the user is active
	if (!planLimits.isActive) {
		return (
			<PlanLimitBlock
				title={`Subscription Expired`}
				message={limitMessage || `Your subscription has expired. Please upgrade to continue using ${featureName}.`}
				description={limitDescription || `Upgrade to access ${featureName} and other premium features.`}
				requiredPlan={minimumPlan || getMinimumPlanForFeature(feature)}
				featureName={featureName}
				upgradeUrl={upgradeUrl}
				showUpgradeButton={showUpgradeButton}
				className={blockClassName}
			/>
		);
	}

	// 1. Check feature availability if specified
	if (feature) {
		const hasFeatureAccess = planLimits.isFeatureAvailable(feature) as boolean;
		if (!hasFeatureAccess) {
			// Return custom fallback or the limit block
			if (fallback) return <>{fallback}</>;

			return (
				<PlanLimitBlock
					title={`Premium Feature: ${featureName}`}
					message={limitMessage || `${featureName} requires a higher subscription plan.`}
					description={limitDescription || `Upgrade to access ${featureName} and other premium features.`}
					requiredPlan={minimumPlan || getMinimumPlanForFeature(feature)}
					featureName={featureName}
					upgradeUrl={upgradeUrl}
					showUpgradeButton={showUpgradeButton}
					className={blockClassName}
				/>
			);
		}
	}

	// 2. Check limit if specified
	if (limitType) {
		const hasReachedLimit = planLimits.hasReachedLimit(limitType);
		if (hasReachedLimit) {
			// Return custom fallback or the limit block
			if (fallback) return <>{fallback}</>;

			return (
				<PlanLimitBlock
					limitType={limitType}
					message={limitMessage}
					description={limitDescription}
					featureName={featureName}
					upgradeUrl={upgradeUrl}
					showUpgradeButton={showUpgradeButton}
					className={blockClassName}
				/>
			);
		}
	}

	// 3. Check minimum plan if specified
	if (minimumPlan) {
		const planOrder = [
			SubscriptionPlan.FREE_TRIAL,
			SubscriptionPlan.PREMIUM,
			SubscriptionPlan.PRO,
		];

		const currentPlanIndex = planOrder.indexOf(planLimits.currentPlan);
		const requiredPlanIndex = planOrder.indexOf(minimumPlan);

		if (currentPlanIndex < requiredPlanIndex) {
			// Return custom fallback or the limit block
			if (fallback) return <>{fallback}</>;

			return (
				<PlanLimitBlock
					title={`Plan Upgrade Required`}
					message={limitMessage || `${featureName} requires at least the ${PLAN_RULES[minimumPlan].displayName} plan.`}
					description={limitDescription || `Upgrade to access ${featureName} and other premium features.`}
					requiredPlan={minimumPlan}
					featureName={featureName}
					upgradeUrl={upgradeUrl}
					showUpgradeButton={showUpgradeButton}
					className={blockClassName}
				/>
			);
		}
	}

	if (planLimits.loadingPlanLimits) {
		return <div className="flex justify-center items-center h-full">
			<Loader2 className="h-4 w-4 animate-spin" />
		</div>
	}
	// All checks passed, render the children
	return <>{children}</>;
}

/**
 * Helper function to determine the minimum plan required for a specific feature
 */
function getMinimumPlanForFeature(feature: 'aiAnalysis' | 'teamCollaboration' | 'customBranding'): SubscriptionPlan {
	// aiAnalysis is available on all plans
	if (feature === 'aiAnalysis') {
		return SubscriptionPlan.FREE_TRIAL;
	}

	// teamCollaboration is available on Premium and above
	if (feature === 'teamCollaboration') {
		return SubscriptionPlan.PREMIUM;
	}

	// customBranding is only available on Pro
	if (feature === 'customBranding') {
		return SubscriptionPlan.PRO;
	}

	return SubscriptionPlan.PREMIUM; // Default fallback
} 