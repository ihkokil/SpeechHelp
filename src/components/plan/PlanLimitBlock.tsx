import React from 'react';
import { LimitType, SubscriptionPlan, PLAN_RULES } from '@/lib/plan_rules';
import { usePlanLimits } from '@/hooks/usePlanLimits';
import {
	Lock,
	CalendarDays,
	FileText,
	Database,
	Users,
	ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface PlanLimitBlockProps {
	/** Title displayed at the top of the component */
	title?: string;
	/** Primary message explaining the limitation */
	message?: string;
	/** Secondary/detailed explanation */
	description?: string;
	/** The type of limit that's been reached */
	limitType?: LimitType;
	/** Target plan needed for access */
	requiredPlan?: SubscriptionPlan;
	/** Name of the feature being blocked */
	featureName?: string;
	/** Custom button text */
	buttonText?: string;
	/** Redirect URL when upgrade button is clicked */
	upgradeUrl?: string;
	/** Whether to show the upgrade button */
	showUpgradeButton?: boolean;
	/** Optional custom class for the container */
	className?: string;
}

/**
 * Component that displays an informative and visually appealing message
 * when a user is blocked from accessing a feature due to plan limitations
 */
export function PlanLimitBlock({
	title,
	message,
	description,
	limitType,
	requiredPlan,
	featureName = 'this feature',
	buttonText = 'Upgrade Plan',
	upgradeUrl = '/pricing',
	showUpgradeButton = true,
	className = '',
}: PlanLimitBlockProps) {
	const planLimits = usePlanLimits();

	// Set default title based on limit type if not provided
	if (!title) {
		if (limitType === LimitType.SPEECHES_COUNT) {
			title = 'Speech Limit Reached';
		} else if (limitType === LimitType.ACTIVE_DAYS) {
			title = 'Subscription Expired';
		} else if (limitType === LimitType.STORAGE_MB) {
			title = 'Storage Limit Reached';
		} else if (limitType === LimitType.TEAM_MEMBERS) {
			title = 'Team Member Limit Reached';
		} else if (requiredPlan) {
			title = 'Plan Upgrade Required';
		} else {
			title = 'Access Restricted';
		}
	}

	// Set default message based on limit type if not provided
	if (!message) {
		if (limitType === LimitType.SPEECHES_COUNT) {
			message = `You've reached your limit of ${planLimits.speechesLimit} speeches on your ${planLimits.planDisplayName}.`;
		} else if (limitType === LimitType.ACTIVE_DAYS) {
			message = `Your ${planLimits.planDisplayName} has expired.`;
		} else if (limitType === LimitType.STORAGE_MB) {
			message = `You've reached your storage limit of ${planLimits.storageLimit}MB.`;
		} else if (limitType === LimitType.TEAM_MEMBERS) {
			message = `You've reached your team member limit of ${planLimits.teamMembersLimit} users.`;
		} else if (requiredPlan) {
			message = `The ${featureName} requires at least the ${PLAN_RULES[requiredPlan].displayName} plan.`;
		}
	}

	// Choose icon based on limit type
	const IconComponent = limitType === LimitType.SPEECHES_COUNT
		? FileText
		: limitType === LimitType.ACTIVE_DAYS
			? CalendarDays
			: limitType === LimitType.STORAGE_MB
				? Database
				: limitType === LimitType.TEAM_MEMBERS
					? Users
					: Lock;

	// Handle upgrade button click
	const handleUpgradeClick = () => {
		window.location.href = upgradeUrl;
	};

	return (
		<Card className={`overflow-hidden ${className}`}>
			<div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-purple-50 to-transparent" />

			<CardHeader className="relative">
				<div className="flex items-center gap-3">
					<div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
						<IconComponent className="h-5 w-5 text-purple-700" />
					</div>
					<CardTitle>{title}</CardTitle>
				</div>
			</CardHeader>

			<CardContent className="relative space-y-4">
				<p className="text-lg font-medium text-gray-700">{message}</p>

				{description && (
					<p className="text-sm text-gray-500">{description}</p>
				)}

				{/* Current vs Required Plan Comparison */}
				{requiredPlan && (
					<div className="mt-4 rounded-lg bg-gray-50 p-4">
						<div className="mb-2 text-sm font-medium text-gray-500">
							Plan Comparison
						</div>

						<div className="flex items-center justify-between">
							<div className="flex flex-col items-center">
								<div className="h-12 w-12 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center">
									<span className="text-sm font-medium text-gray-500">Current</span>
								</div>
								<span className="mt-1 text-sm font-medium">{planLimits.planDisplayName}</span>
							</div>

							<ArrowRight className="h-4 w-4 text-gray-400" />

							<div className="flex flex-col items-center">
								<div className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
									<span className="text-xs font-medium text-white">Required</span>
								</div>
								<span className="mt-1 text-sm font-medium">{PLAN_RULES[requiredPlan].displayName}</span>
							</div>
						</div>
					</div>
				)}
			</CardContent>

			{showUpgradeButton && (
				<CardFooter className="relative pb-6">
					<Button
						className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white"
						onClick={handleUpgradeClick}
					>
						{buttonText}
					</Button>
				</CardFooter>
			)}
		</Card>
	);
} 