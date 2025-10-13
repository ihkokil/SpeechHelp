
/**
 * Subscription plan types and rules
 */
export enum SubscriptionPlan {
	FREE_TRIAL = 'free_trial',
	PREMIUM = 'premium',
	PRO = 'pro',
}

/**
 * Types of limits that can be enforced
 */
export enum LimitType {
	SPEECHES_COUNT = 'speeches_count',
	STORAGE_MB = 'storage_mb',
	TEAM_MEMBERS = 'team_members',
	ACTIVE_DAYS = 'active_days',
}

/**
 * User subscription interface
 */
export interface UserSubscription {
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
}

/**
 * Plan configuration interface
 */
interface PlanConfig {
	displayName: string;
	limits: {
		[LimitType.SPEECHES_COUNT]: number;
		[LimitType.STORAGE_MB]: number;
		[LimitType.TEAM_MEMBERS]: number;
		[LimitType.ACTIVE_DAYS]: number;
	};
	features: {
		aiAnalysis: boolean;
		teamCollaboration: boolean;
		customBranding: boolean;
		exportOptions: string[];
	};
}

/**
 * Plan rules configuration
 */
export const PLAN_RULES: Record<SubscriptionPlan, PlanConfig> = {
	[SubscriptionPlan.FREE_TRIAL]: {
		displayName: 'Free Trial',
		limits: {
			[LimitType.SPEECHES_COUNT]: 1,
			[LimitType.STORAGE_MB]: 100,
			[LimitType.TEAM_MEMBERS]: 1,
			[LimitType.ACTIVE_DAYS]: 7,
		},
		features: {
			aiAnalysis: true,
			teamCollaboration: false,
			customBranding: false,
			exportOptions: ['pdf'],
		},
	},
	[SubscriptionPlan.PREMIUM]: {
		displayName: 'Premium Plan',
		limits: {
			[LimitType.SPEECHES_COUNT]: 3,
			[LimitType.STORAGE_MB]: 1000,
			[LimitType.TEAM_MEMBERS]: 5,
			[LimitType.ACTIVE_DAYS]: Infinity,
		},
		features: {
			aiAnalysis: true,
			teamCollaboration: true,
			customBranding: false,
			exportOptions: ['pdf', 'docx', 'pptx'],
		},
	},
	[SubscriptionPlan.PRO]: {
		displayName: 'Pro Plan',
		limits: {
			[LimitType.SPEECHES_COUNT]: Infinity,
			[LimitType.STORAGE_MB]: Infinity,
			[LimitType.TEAM_MEMBERS]: Infinity,
			[LimitType.ACTIVE_DAYS]: Infinity,
		},
		features: {
			aiAnalysis: true,
			teamCollaboration: true,
			customBranding: true,
			exportOptions: ['pdf', 'docx', 'pptx', 'html'],
		},
	},
};

/**
 * Check if subscription is currently active
 */
export function isSubscriptionActive(subscription: UserSubscription): boolean {
	if (!subscription.subscriptionStatus) {
		return subscription.planType === SubscriptionPlan.FREE_TRIAL;
	}
	return subscription.subscriptionStatus === 'active';
}

/**
 * Check if subscription is expired
 */
export function isSubscriptionExpired(subscription: UserSubscription): boolean {
	if (!subscription.endDate) {
		return false;
	}
	return new Date() > subscription.endDate;
}

/**
 * Get days remaining in subscription
 */
export function getDaysRemaining(subscription: UserSubscription): number {
	if (!subscription.endDate) {
		return Infinity;
	}
	
	const now = new Date();
	const endDate = subscription.endDate;
	const diffInMs = endDate.getTime() - now.getTime();
	const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
	
	return Math.max(0, diffInDays);
}

/**
 * Check if a feature is available for the user's subscription
 */
export function isFeatureAvailable(
	subscription: UserSubscription,
	feature: 'aiAnalysis' | 'teamCollaboration' | 'customBranding' | 'exportOptions'
): boolean | string[] {
	const { effectivePlan } = getEffectivePlanStatus(subscription);
	const planConfig = PLAN_RULES[effectivePlan];
	
	if (feature === 'exportOptions') {
		return planConfig.features.exportOptions;
	}
	
	return planConfig.features[feature];
}

/**
 * Check if user can create a new speech
 */
export function canCreateSpeech(subscription: UserSubscription): { allowed: boolean; reason?: string } {
	const { effectivePlan, isActive, isExpired } = getEffectivePlanStatus(subscription);
	
	// Check if subscription is expired or inactive
	if (isExpired) {
		return {
			allowed: false,
			reason: `Your ${PLAN_RULES[subscription.planType].displayName} has expired. Please upgrade to continue creating speeches.`
		};
	}
	
	if (!isActive) {
		return {
			allowed: false,
			reason: `Your subscription is not active. Please upgrade to continue creating speeches.`
		};
	}
	
	// Check speech limit
	const speechLimit = PLAN_RULES[effectivePlan].limits[LimitType.SPEECHES_COUNT];
	if (speechLimit !== Infinity && subscription.usageStats.speechesUsed >= speechLimit) {
		return {
			allowed: false,
			reason: `You've reached your limit of ${speechLimit} speeches on your ${PLAN_RULES[subscription.planType].displayName}. Upgrade to create more speeches.`
		};
	}
	
	return { allowed: true };
}

/**
 * Determine effective plan status considering both plan type and expiration
 */
export function getEffectivePlanStatus(subscription: UserSubscription): {
	effectivePlan: SubscriptionPlan;
	isActive: boolean;
	isExpired: boolean;
	shouldShowUpgrade: boolean;
} {
	const isActive = isSubscriptionActive(subscription);
	const isExpired = isSubscriptionExpired(subscription);
	const daysRemaining = getDaysRemaining(subscription);
	
	// If expired, effective plan is free trial (most restrictive)
	const effectivePlan = (isExpired || !isActive) ? SubscriptionPlan.FREE_TRIAL : subscription.planType;
	
	// Show upgrade if expired, inactive, or trial ending soon
	let shouldShowUpgrade = isExpired || !isActive || 
		(subscription.planType === SubscriptionPlan.FREE_TRIAL && daysRemaining <= 2);
	
	// Also show upgrade if user is close to speech limits on non-Pro plans
	if (!shouldShowUpgrade && subscription.planType === SubscriptionPlan.PREMIUM) {
		const speechLimit = PLAN_RULES[subscription.planType].limits[LimitType.SPEECHES_COUNT];
		if (speechLimit !== Infinity && subscription.usageStats.speechesUsed >= speechLimit - 1) {
			shouldShowUpgrade = true;
		}
	}
	
	return {
		effectivePlan,
		isActive,
		isExpired,
		shouldShowUpgrade
	};
}

/**
 * Cache management utilities for subscription data
 */
export const SubscriptionCacheManager = {
	/**
	 * Clear all subscription-related cache data
	 */
	clearAllSubscriptionCache: () => {
		const cacheKeys = Object.keys(localStorage).filter(key => 
			key.startsWith('planAccess_') ||
			key.startsWith('subscription_') ||
			key.includes('plan') ||
			key.includes('subscription') ||
			key.includes('speech_generation') ||
			key.includes('user_limits')
		);
		
		cacheKeys.forEach(key => localStorage.removeItem(key));
		console.log('🧹 Cleared subscription cache keys:', cacheKeys.length);
		return cacheKeys.length;
	},

	/**
	 * Force refresh subscription data by clearing cache and triggering reload
	 */
	forceRefreshSubscription: async () => {
		console.log('🔄 Force refreshing subscription data...');
		
		// Clear all relevant cache
		const clearedCount = SubscriptionCacheManager.clearAllSubscriptionCache();
		
		// Also clear any session storage related to subscriptions
		const sessionKeys = Object.keys(sessionStorage).filter(key => 
			key.includes('plan') || key.includes('subscription')
		);
		sessionKeys.forEach(key => sessionStorage.removeItem(key));
		
		// Trigger a page reload if needed (as last resort)
		if (clearedCount > 10) {
			console.log('⚠️ Large amount of cache cleared, consider page refresh');
		}
		
		return { clearedLocalStorage: clearedCount, clearedSessionStorage: sessionKeys.length };
	},

	/**
	 * Check if subscription cache might be stale
	 */
	isSubscriptionCacheStale: (lastUpdateTime?: Date): boolean => {
		if (!lastUpdateTime) return true;
		
		const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
		return lastUpdateTime < fiveMinutesAgo;
	}
};
