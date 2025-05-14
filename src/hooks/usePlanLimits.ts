
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import {
	SubscriptionPlan,
	LimitType,
	PLAN_RULES,
	isFeatureAvailable,
	canCreateSpeech,
	isSubscriptionActive,
	getTrialDaysRemaining
} from '@/lib/plan_rules';

/**
 * Interface representing a user's plan permissions and limitations
 */
export interface UserPlanLimits {
	loadingPlanLimits: boolean;
	// Plan status
	isActive: boolean;
	currentPlan: SubscriptionPlan;
	planDisplayName: string;
	daysRemaining: number | null;

	// Speech limits
	canCreateSpeech: boolean;
	reasonCannotCreate: string | undefined;
	speechesUsed: number;
	speechesLimit: number;
	speechesRemaining: number;

	// Features access
	canUseAiAnalysis: boolean;
	canUseTeamCollaboration: boolean;
	canUseCustomBranding: boolean;
	availableExportFormats: string[];

	// Storage limits
	storageUsed: number;
	storageLimit: number;
	storageRemaining: number;

	// Team limits
	teamMembersUsed: number;
	teamMembersLimit: number;
	teamMembersRemaining: number;

	// Utility methods
	isFeatureAvailable: (feature: 'aiAnalysis' | 'teamCollaboration' | 'customBranding' | 'exportOptions') => boolean | string[];
	hasReachedLimit: (limitType: LimitType) => boolean;
	shouldShowUpgradePrompt: boolean;
}

/**
 * Hook to monitor a user's subscription plan limits
 */
export function usePlanLimits(): UserPlanLimits {
	const { user } = useAuth();
	const [loadingPlanLimits, setLoadingPlanLimits] = useState(true);
	const [userSubscription, setUserSubscription] = useState<{
		userId: string;
		planType: SubscriptionPlan;
		startDate: Date;
		endDate?: Date;
		usageStats: {
			speechesUsed: number;
			storageUsed: number;
			teamMembersAdded: number;
		};
	}>({
		userId: '',
		planType: SubscriptionPlan.FREE_TRIAL,
		startDate: new Date(),
		usageStats: {
			speechesUsed: 0,
			storageUsed: 0,
			teamMembersAdded: 0,
		}
	});

	// Fetch user profile and subscription data from database
	useEffect(() => {
		const fetchUserSubscriptionData = async () => {
			if (!user) {
				setLoadingPlanLimits(false);
				return;
			}
			
			setLoadingPlanLimits(true);
			try {
				// Get the user's profile from the database
				const { data: profileData, error: profileError } = await supabase
					.from('profiles')
					.select('*')
					.eq('id', user.id)
					.single();

				if (profileError) {
					console.error('Error fetching profile:', profileError);
					return;
				}

				// Get speech count for the user
				const { count: speechCount, error: speechError } = await supabase
					.from('speeches')
					.select('*', { count: 'exact', head: true })
					.eq('user_id', user.id);

				if (speechError) {
					console.error('Error fetching speech count:', speechError);
					return;
				}

				// Map database values to our user subscription model
				const planType = (profileData?.subscription_plan as SubscriptionPlan) || SubscriptionPlan.FREE_TRIAL;
				const startDate = profileData?.subscription_start_date
					? new Date(profileData.subscription_start_date)
					: new Date();
				const endDate = profileData?.subscription_end_date
					? new Date(profileData.subscription_end_date)
					: undefined;

				setUserSubscription({
					userId: user.id,
					planType,
					startDate,
					endDate,
					usageStats: {
						speechesUsed: speechCount || 0,
						storageUsed: 0, // This would need to be calculated based on your storage model
						teamMembersAdded: 0, // This would need to be fetched from a team members table
					},
				});
			} catch (error) {
				console.error('Error in fetchUserSubscriptionData:', error);
			} finally {
				setLoadingPlanLimits(false);
			}
		};

		fetchUserSubscriptionData();
	}, [user]);

	// Check if feature is available
	const checkFeatureAvailability = useCallback(
		(feature: 'aiAnalysis' | 'teamCollaboration' | 'customBranding' | 'exportOptions'): boolean | string[] => {
			if (feature === 'exportOptions') {
				return isFeatureAvailable(userSubscription, 'exportOptions');
			}
			return isFeatureAvailable(userSubscription, feature);
		},
		[userSubscription]
	);

	// Check if user has reached a specific limit
	const hasReachedLimit = useCallback(
		(limitType: LimitType): boolean => {
			const limit = PLAN_RULES[userSubscription.planType].limits[limitType];

			switch (limitType) {
				case LimitType.SPEECHES_COUNT:
					return userSubscription.usageStats.speechesUsed >= limit;
				case LimitType.STORAGE_MB:
					return userSubscription.usageStats.storageUsed >= limit;
				case LimitType.TEAM_MEMBERS:
					return userSubscription.usageStats.teamMembersAdded >= limit;
				case LimitType.ACTIVE_DAYS:
					// For active days, we check if the subscription is active
					return !isSubscriptionActive(userSubscription);
				default:
					return false;
			}
		},
		[userSubscription]
	);

	// Get plan display name
	const planDisplayName = PLAN_RULES[userSubscription.planType].displayName;

	// Check if subscription is active
	const isActive = isSubscriptionActive(userSubscription);

	// Get speech creation permission
	const speechCreationStatus = canCreateSpeech(userSubscription);

	// Calculate days remaining (for trial or time-limited plans)
	let daysRemaining: number | null = null;
	if (userSubscription.planType === SubscriptionPlan.FREE_TRIAL) {
		daysRemaining = getTrialDaysRemaining(userSubscription);
	} else if (userSubscription.endDate) {
		const now = new Date();
		const diffTime = userSubscription.endDate.getTime() - now.getTime();
		daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
	}

	// Calculate usage statistics and limits
	const speechesLimit = PLAN_RULES[userSubscription.planType].limits[LimitType.SPEECHES_COUNT];
	const speechesRemaining = speechesLimit === Infinity
		? Infinity
		: speechesLimit - userSubscription.usageStats.speechesUsed;

	const storageLimit = PLAN_RULES[userSubscription.planType].limits[LimitType.STORAGE_MB];
	const storageRemaining = storageLimit === Infinity
		? Infinity
		: storageLimit - userSubscription.usageStats.storageUsed;

	const teamMembersLimit = PLAN_RULES[userSubscription.planType].limits[LimitType.TEAM_MEMBERS];
	const teamMembersRemaining = teamMembersLimit === Infinity
		? Infinity
		: teamMembersLimit - userSubscription.usageStats.teamMembersAdded;

	// Determine if we should show upgrade prompt
	// Show if: close to speech limit or trial ending soon or storage running low
	const shouldShowUpgradePrompt = (
		(typeof speechesRemaining === 'number' && speechesRemaining <= 1) ||
		(daysRemaining !== null && daysRemaining <= 2) ||
		(typeof storageRemaining === 'number' && storageRemaining <= 50)
	);

	return {
		loadingPlanLimits,
		// Plan status
		isActive,
		currentPlan: userSubscription.planType,
		planDisplayName,
		daysRemaining,

		// Speech limits
		canCreateSpeech: speechCreationStatus.allowed,
		reasonCannotCreate: speechCreationStatus.reason,
		speechesUsed: userSubscription.usageStats.speechesUsed,
		speechesLimit,
		speechesRemaining,

		// Features access
		canUseAiAnalysis: checkFeatureAvailability('aiAnalysis') as boolean,
		canUseTeamCollaboration: checkFeatureAvailability('teamCollaboration') as boolean,
		canUseCustomBranding: checkFeatureAvailability('customBranding') as boolean,
		availableExportFormats: checkFeatureAvailability('exportOptions') as string[],

		// Storage limits
		storageUsed: userSubscription.usageStats.storageUsed,
		storageLimit,
		storageRemaining,

		// Team limits
		teamMembersUsed: userSubscription.usageStats.teamMembersAdded,
		teamMembersLimit,
		teamMembersRemaining,

		// Utility methods
		isFeatureAvailable: checkFeatureAvailability,
		hasReachedLimit,
		shouldShowUpgradePrompt,
	};
}
