
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
 * with enhanced expiration handling
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
	upgradeUrl = '/pricing',
	showUpgradeButton = true,
	blockClassName,
}: FeatureAccessProps) {
	const planLimits = usePlanLimits();

	// Show loading state if we're still loading plan data
	if (planLimits.loadingPlanLimits) {
		return (
			<div className="flex justify-center items-center py-8">
				<Loader2 className="h-8 w-8 animate-spin text-purple-500" />
				<span className="ml-2 text-gray-600">Checking plan access...</span>
			</div>
		);
	}

	// Check if the subscription is expired first
	if (planLimits.isExpired) {
		const expiredMessage = limitMessage || `Your subscription has expired. Please upgrade to continue using ${featureName}.`;
		const expiredDescription = limitDescription || `Your ${planLimits.planDisplayName.replace(' (Expired)', '')} has expired. Upgrade to restore access to ${featureName} and other premium features.`;
		
		return (
			<PlanLimitBlock
				title="Subscription Expired"
				message={expiredMessage}
				description={expiredDescription}
				requiredPlan={minimumPlan || getMinimumPlanForFeature(feature)}
				featureName={featureName}
				upgradeUrl={upgradeUrl}
				showUpgradeButton={showUpgradeButton}
				className={blockClassName}
			/>
		);
	}

	// Check if the user is active
	if (!planLimits.isActive) {
		return (
			<PlanLimitBlock
				title="Subscription Inactive"
				message={limitMessage || `Your subscription is not active. Please upgrade to continue using ${featureName}.`}
				description={limitDescription || `Upgrade to access ${featureName} and other premium features.`}
				requiredPlan={minimumPlan || getMinimumPlanForFeature(feature)}
				featureName={featureName}
				upgradeUrl={upgradeUrl}
				showUpgradeButton={showUpgradeButton}
				className={blockClassName}
			/>
		);
	}

	// Check feature availability if specified (uses effective plan)
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

	// Check limit if specified (uses effective plan)
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

	// Check minimum plan if specified (uses effective plan)
	if (minimumPlan) {
		const planOrder = [
			SubscriptionPlan.FREE_TRIAL,
			SubscriptionPlan.PREMIUM,
			SubscriptionPlan.PRO,
		];

		const effectivePlanIndex = planOrder.indexOf(planLimits.effectivePlan);
		const requiredPlanIndex = planOrder.indexOf(minimumPlan);

		if (effectivePlanIndex < requiredPlanIndex) {
			// Return custom fallback or the limit block
			if (fallback) return <>{fallback}</>;

			return (
				<PlanLimitBlock
					title="Plan Upgrade Required"
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

	// All checks passed, render the children
	return <>{children}</>;
}

/**
 * Helper function to determine the minimum plan required for a specific feature
 */
function getMinimumPlanForFeature(feature?: 'aiAnalysis' | 'teamCollaboration' | 'customBranding'): SubscriptionPlan {
	if (!feature) {
		return SubscriptionPlan.PREMIUM; // Default fallback
	}
	
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
