import React from 'react';
import SpeechLabLayout from '@/components/layouts/SpeechLabLayout';
import SpeechLabContent from '@/components/speech/SpeechLabContent';
import { LimitType } from '@/lib/plan_rules';
import { PlanLimitBlock } from '@/components/plan/PlanLimitBlock';
import { useCachedPlanAccess } from '@/hooks/useCachedPlanAccess';
import { Loader2 } from 'lucide-react';
import Translate from '@/components/Translate';

const SpeechLab = () => {
	const {
		loadingPlanLimits,
		canCreateSpeech,
		reasonCannotCreate,
		shouldShowUpgradePrompt,
		hasCachedData,
		isExpired,
		isActive
	} = useCachedPlanAccess(LimitType.SPEECHES_COUNT, 'Speech Lab');

	// Show loading only on initial visit (no cached data)
	if (loadingPlanLimits && !hasCachedData) {
		return (
			<SpeechLabLayout>
				<div className="flex items-center justify-center min-h-[400px]">
					<div className="flex flex-col items-center space-y-4">
						<Loader2 className="h-8 w-8 animate-spin text-magenta-500" />
						<p className="text-gray-600">
							<Translate text="plan.checkingAccess" fallback="Checking plan access..." />
						</p>
					</div>
				</div>
			</SpeechLabLayout>
		);
	}

	// If user doesn't have access, show upgrade prompt directly with PlanLimitBlock
	if (!canCreateSpeech) {
		// Determine the appropriate title and description based on the reason
		let title = "Speech Limit Reached";
		let description = "Our Premium plan gives you access to 3 speeches per month, and our Pro plan offers unlimited speeches along with additional features.";
		
		// Check for expired trial/subscription
		if (isExpired || reasonCannotCreate?.toLowerCase().includes('expired')) {
			title = "Subscription Expired";
			description = "Your subscription has expired. Renew or upgrade your plan to continue creating speeches.";
		} else if (!isActive) {
			title = "Subscription Inactive";
			description = "Your subscription is not active. Please subscribe to a plan to start creating speeches.";
		} else if (reasonCannotCreate?.toLowerCase().includes('no active subscription')) {
			title = "No Active Plan";
			description = "You don't have an active plan. Subscribe to start creating speeches.";
		}

		return (
			<SpeechLabLayout>
				<div className="max-w-xl mx-auto my-8">
					<PlanLimitBlock
						title={title}
						limitType={LimitType.SPEECHES_COUNT}
						message={reasonCannotCreate || "You've reached your speech creation limit."}
						description={description}
						upgradeUrl="/pricing"
						showUpgradeButton={true}
					/>
				</div>
			</SpeechLabLayout>
		);
	}

	return (
		<SpeechLabLayout>
			<SpeechLabContent />
		</SpeechLabLayout>
	);
};

export default SpeechLab;
