import React, { ReactNode } from 'react';
import { usePlanLimits } from '@/hooks/usePlanLimits';
import { LimitType, SubscriptionPlan } from '@/lib/plan_rules';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProtectedFeatureProps {
	/** The feature being protected */
	feature?: 'aiAnalysis' | 'teamCollaboration' | 'customBranding';
	/** The limit type to check */
	limitType?: LimitType;
	/** Minimum plan required to access this feature */
	minimumPlan?: SubscriptionPlan;
	/** Content to show when user has access */
	children: ReactNode;
	/** Custom message to show when access is denied */
	lockedMessage?: string;
	/** Whether to show upgrade button */
	showUpgradeButton?: boolean;
}

/**
 * Component that conditionally renders content based on the user's subscription plan
 */
export function ProtectedFeature({
	feature,
	limitType,
	minimumPlan,
	children,
	lockedMessage,
	showUpgradeButton = true,
}: ProtectedFeatureProps) {
	const planLimits = usePlanLimits();

	// Check feature availability if specified
	if (feature) {
		const hasFeatureAccess = planLimits.isFeatureAvailable(feature) as boolean;
		if (!hasFeatureAccess) {
			return <LockedFeatureMessage
				message={lockedMessage || `This feature requires a higher plan level.`}
				showUpgradeButton={showUpgradeButton}
			/>;
		}
	}

	// Check limit if specified
	if (limitType) {
		const hasReachedLimit = planLimits.hasReachedLimit(limitType);
		if (hasReachedLimit) {
			const limitMessages = {
				[LimitType.SPEECHES_COUNT]: `You've reached your speech limit for your ${planLimits.planDisplayName}.`,
				[LimitType.STORAGE_MB]: `You've reached your storage limit for your ${planLimits.planDisplayName}.`,
				[LimitType.TEAM_MEMBERS]: `You've reached your team member limit for your ${planLimits.planDisplayName}.`,
				[LimitType.ACTIVE_DAYS]: `Your subscription has expired.`,
			};

			return <LockedFeatureMessage
				message={lockedMessage || limitMessages[limitType]}
				showUpgradeButton={showUpgradeButton}
			/>;
		}
	}

	// Check minimum plan if specified
	if (minimumPlan) {
		const planOrder = [
			SubscriptionPlan.FREE_TRIAL,
			SubscriptionPlan.PREMIUM,
			SubscriptionPlan.PRO,
		];

		const currentPlanIndex = planOrder.indexOf(planLimits.currentPlan);
		const requiredPlanIndex = planOrder.indexOf(minimumPlan);

		if (currentPlanIndex < requiredPlanIndex) {
			return <LockedFeatureMessage
				message={lockedMessage || `This feature requires at least the ${minimumPlan} plan.`}
				showUpgradeButton={showUpgradeButton}
			/>;
		}
	}

	// All checks passed, render the children
	return <>{children}</>;
}

/**
 * Message shown when a feature is locked
 */
function LockedFeatureMessage({ message, showUpgradeButton }: { message: string, showUpgradeButton: boolean }) {
	return (
		<Alert className="border-amber-200 bg-amber-50">
			<Lock className="h-4 w-4 text-amber-500" />
			<AlertTitle>Upgrade Required</AlertTitle>
			<AlertDescription className="space-y-4">
				<p>{message}</p>

				{showUpgradeButton && (
					<Button
						variant="outline"
						className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 hover:opacity-90"
						onClick={() => {/* Handle upgrade click */ }}
					>
						Upgrade Now
					</Button>
				)}
			</AlertDescription>
		</Alert>
	);
} 