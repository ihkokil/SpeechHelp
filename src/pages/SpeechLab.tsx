
import React from 'react';
import SpeechLabLayout from '@/components/layouts/SpeechLabLayout';
import SpeechLabContent from '@/components/speech/SpeechLabContent';
import { LimitType } from '@/lib/plan_rules';
import { FeatureAccess } from '@/components/plan/FeatureAccess';
import { useCachedPlanAccess } from '@/hooks/useCachedPlanAccess';
import { Loader2 } from 'lucide-react';

const SpeechLab = () => {
	const {
		loadingPlanLimits,
		canCreateSpeech,
		reasonCannotCreate,
		shouldShowUpgradePrompt,
		hasCachedData
	} = useCachedPlanAccess(LimitType.SPEECHES_COUNT, 'Speech Lab');

	// Show loading only on initial visit (no cached data)
	if (loadingPlanLimits && !hasCachedData) {
		return (
			<SpeechLabLayout>
				<div className="flex items-center justify-center min-h-[400px]">
					<div className="flex flex-col items-center space-y-4">
						<Loader2 className="h-8 w-8 animate-spin text-magenta-500" />
						<p className="text-gray-600">Checking plan access...</p>
					</div>
				</div>
			</SpeechLabLayout>
		);
	}

	// If user doesn't have access, show upgrade prompt
	if (!canCreateSpeech) {
		return (
			<SpeechLabLayout>
				<FeatureAccess
					limitType={LimitType.SPEECHES_COUNT}
					featureName="Speech Lab"
					limitDescription={reasonCannotCreate || "Our Premium plan gives you access to 3 speeches per month, and our Pro plan offers unlimited speeches along with additional features."}
					blockClassName="max-w-xl mx-auto my-8"
					upgradeUrl="/pricing"
				>
					{/* This will show the upgrade prompt */}
					<div></div>
				</FeatureAccess>
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
