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
	isSubscriptionExpired,
	getDaysRemaining,
	getEffectivePlanStatus
} from '@/lib/plan_rules';

/**
 * Interface representing a user's plan permissions and limitations
 */
export interface UserPlanLimits {
	loadingPlanLimits: boolean;
	// Plan status with enhanced expiration logic
	isActive: boolean;
	isExpired: boolean;
	currentPlan: SubscriptionPlan;
	effectivePlan: SubscriptionPlan; // Plan after considering expiration
	planDisplayName: string;
	daysRemaining: number | null;

	// Speech limits
	canCreateSpeech: boolean;
	reasonCannotCreate: string | undefined;
	speechesUsed: number;
	speechesLimit: number;
	speechesRemaining: number;

	// Features access (based on effective plan)
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
	refreshPlanData: () => Promise<void>;
}

/**
 * Hook to monitor a user's subscription plan limits with enhanced expiration logic
 */
export function usePlanLimits(): UserPlanLimits {
	const { user } = useAuth();
	const [loadingPlanLimits, setLoadingPlanLimits] = useState(true);
	const [refreshCounter, setRefreshCounter] = useState(0);
	const [userSubscription, setUserSubscription] = useState<{
		userId: string;
		planType: SubscriptionPlan;
		startDate: Date;
		endDate?: Date;
		subscriptionStatus?: string;
		usageStats: {
			speechesUsed: number;
			storageUsed: number;
			teamMembersAdded: number;
		};
		speechPermissions?: {
			allowed: boolean;
			reason?: string;
			credits_remaining?: number;
			credits_granted?: number;
			period_id?: string;
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

	// Function to force refresh plan data
	const refreshPlanData = useCallback(async () => {
		console.log('🔄 Force refreshing plan data');
		
		// Clear plan access cache
		const planAccessKeys = Object.keys(localStorage).filter(key => key.startsWith('planAccess_'));
		planAccessKeys.forEach(key => localStorage.removeItem(key));
		console.log('🧹 Cleared plan access cache keys:', planAccessKeys.length);
		
		// Trigger re-fetch by incrementing counter
		setRefreshCounter(prev => prev + 1);
	}, []);

	// Fetch user profile and subscription data from database
	useEffect(() => {
		const fetchUserSubscriptionData = async () => {
			if (!user) {
				setLoadingPlanLimits(false);
				return;
			}
			
			setLoadingPlanLimits(true);
			try {
				console.log('🔍 Fetching subscription data for user:', user.id);
				
				// Get the user's profile from the database
				const { data: profileData, error: profileError } = await supabase
					.from('profiles')
					.select('*')
					.eq('id', user.id)
					.single();

				if (profileError) {
					console.error('❌ Error fetching profile:', profileError);
					return;
				}

				console.log('📋 Profile data:', {
					plan: profileData?.subscription_plan,
					status: profileData?.subscription_status,
					startDate: profileData?.subscription_start_date,
					endDate: profileData?.subscription_end_date
				});

	// Check speech creation permissions using the credit system
	const { data: speechPermissionsRaw, error: speechError } = await supabase
		.rpc('can_create_speech_with_credits', { user_id_param: user.id });

	if (speechError) {
		console.error('❌ Error checking speech permissions:', speechError);
		return;
	}

	const speechPermissions = speechPermissionsRaw as {
		allowed: boolean;
		reason?: string;
		credits_remaining?: number;
		credits_granted?: number;
		period_id?: string;
	} | null;

	console.log('🎤 Speech permissions:', speechPermissions);

				// Map database values to our user subscription model
				const planType = (profileData?.subscription_plan as SubscriptionPlan) || SubscriptionPlan.FREE_TRIAL;
				const startDate = profileData?.subscription_start_date
					? new Date(profileData.subscription_start_date)
					: new Date();
				const endDate = profileData?.subscription_end_date
					? new Date(profileData.subscription_end_date)
					: undefined;
				const subscriptionStatus = profileData?.subscription_status || undefined;

				const newSubscription = {
					userId: user.id,
					planType,
					startDate,
					endDate,
					subscriptionStatus,
					usageStats: {
						speechesUsed: speechPermissions?.credits_remaining 
							? speechPermissions.credits_granted - speechPermissions.credits_remaining
							: 0,
						storageUsed: 0, // This would need to be calculated based on your storage model
						teamMembersAdded: 0, // This would need to be fetched from a team members table
					},
					speechPermissions, // Store the full permissions response
				};

				console.log('✅ Final subscription data:', {
					planType: newSubscription.planType,
					status: newSubscription.subscriptionStatus,
					isActive: isSubscriptionActive(newSubscription),
					isExpired: isSubscriptionExpired(newSubscription),
					daysRemaining: getDaysRemaining(newSubscription)
				});

				setUserSubscription(newSubscription);
			} catch (error) {
				console.error('❌ Error in fetchUserSubscriptionData:', error);
			} finally {
				setLoadingPlanLimits(false);
			}
		};

		fetchUserSubscriptionData();
	}, [user, refreshCounter]);

	// Check if feature is available using effective plan
	const checkFeatureAvailability = useCallback(
		(feature: 'aiAnalysis' | 'teamCollaboration' | 'customBranding' | 'exportOptions'): boolean | string[] => {
			if (feature === 'exportOptions') {
				return isFeatureAvailable(userSubscription, 'exportOptions');
			}
			return isFeatureAvailable(userSubscription, feature);
		},
		[userSubscription]
	);

	// Check if user has reached a specific limit using effective plan
	const hasReachedLimit = useCallback(
		(limitType: LimitType): boolean => {
			const { effectivePlan, isActive, isExpired } = getEffectivePlanStatus(userSubscription);
			
			// If expired or inactive, use most restrictive limits
			const planToCheck = (isExpired || !isActive) ? SubscriptionPlan.FREE_TRIAL : effectivePlan;
			const limit = PLAN_RULES[planToCheck].limits[limitType];

			switch (limitType) {
				case LimitType.SPEECHES_COUNT:
					return userSubscription.usageStats.speechesUsed >= limit;
				case LimitType.STORAGE_MB:
					return userSubscription.usageStats.storageUsed >= limit;
				case LimitType.TEAM_MEMBERS:
					return userSubscription.usageStats.teamMembersAdded >= limit;
				case LimitType.ACTIVE_DAYS:
					// For active days, we check if the subscription is expired
					return isExpired || !isActive;
				default:
					return false;
			}
		},
		[userSubscription]
	);

	// Get effective plan status
	const effectiveStatus = getEffectivePlanStatus(userSubscription);
	
	// Get plan display name (show original plan but indicate if expired)
	const planDisplayName = effectiveStatus.isExpired 
		? `${PLAN_RULES[userSubscription.planType].displayName} (Expired)`
		: PLAN_RULES[userSubscription.planType].displayName;

	// Get speech creation permission from credit system
	const speechCreationStatus = {
		allowed: userSubscription.speechPermissions?.allowed || false,
		reason: userSubscription.speechPermissions?.reason
	};

	// Calculate days remaining
	const daysRemaining = getDaysRemaining(userSubscription);

	// Calculate usage statistics and limits using credit system
	const speechesLimit = userSubscription.speechPermissions?.credits_granted === 999999 
		? Infinity 
		: userSubscription.speechPermissions?.credits_granted || 0;
	const speechesRemaining = userSubscription.speechPermissions?.credits_remaining || 0;

	const storageLimit = PLAN_RULES[effectiveStatus.effectivePlan].limits[LimitType.STORAGE_MB];
	const storageRemaining = storageLimit === Infinity
		? Infinity
		: storageLimit - userSubscription.usageStats.storageUsed;

	const teamMembersLimit = PLAN_RULES[effectiveStatus.effectivePlan].limits[LimitType.TEAM_MEMBERS];
	const teamMembersRemaining = teamMembersLimit === Infinity
		? Infinity
		: teamMembersLimit - userSubscription.usageStats.teamMembersAdded;

	return {
		loadingPlanLimits,
		// Plan status with enhanced logic
		isActive: effectiveStatus.isActive,
		isExpired: effectiveStatus.isExpired,
		currentPlan: userSubscription.planType,
		effectivePlan: effectiveStatus.effectivePlan,
		planDisplayName,
		daysRemaining: daysRemaining > 0 ? daysRemaining : null,

		// Speech limits
		canCreateSpeech: speechCreationStatus.allowed,
		reasonCannotCreate: speechCreationStatus.reason,
		speechesUsed: userSubscription.usageStats.speechesUsed,
		speechesLimit,
		speechesRemaining,

		// Features access (based on effective plan)
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
		shouldShowUpgradePrompt: effectiveStatus.shouldShowUpgrade,
		refreshPlanData,
	};
}