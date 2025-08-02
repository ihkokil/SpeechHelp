
/**
 * Enum representing available subscription plans
 */
export enum SubscriptionPlan {
	FREE_TRIAL = 'free_trial',
	PREMIUM = 'premium',
	PRO = 'pro',
}

/**
 * Plan limit types
 */
export enum LimitType {
	SPEECHES_COUNT = 'speeches_count',
	ACTIVE_DAYS = 'active_days',
	STORAGE_MB = 'storage_mb',
	TEAM_MEMBERS = 'team_members',
}

/**
 * Interface for subscription plan rules
 */
export interface PlanRules {
	planType: SubscriptionPlan;
	displayName: string;
	limits: Record<LimitType, number>;
	features: {
		aiAnalysis: boolean;
		exportOptions: string[];
		teamCollaboration: boolean;
		customBranding: boolean;
	};
}

/**
 * Define plan rules for each subscription tier
 */
export const PLAN_RULES: Record<SubscriptionPlan, PlanRules> = {
	[SubscriptionPlan.FREE_TRIAL]: {
		planType: SubscriptionPlan.FREE_TRIAL,
		displayName: 'Free Trial',
		limits: {
			[LimitType.SPEECHES_COUNT]: 1,
			[LimitType.ACTIVE_DAYS]: 7,
			[LimitType.STORAGE_MB]: 50,
			[LimitType.TEAM_MEMBERS]: 1,
		},
		features: {
			aiAnalysis: true,
			exportOptions: ['pdf'],
			teamCollaboration: false,
			customBranding: false,
		},
	},
	[SubscriptionPlan.PREMIUM]: {
		planType: SubscriptionPlan.PREMIUM,
		displayName: 'Premium',
		limits: {
			[LimitType.SPEECHES_COUNT]: 3,
			[LimitType.ACTIVE_DAYS]: Infinity,
			[LimitType.STORAGE_MB]: 500,
			[LimitType.TEAM_MEMBERS]: 3,
		},
		features: {
			aiAnalysis: true,
			exportOptions: ['pdf', 'docx', 'pptx'],
			teamCollaboration: true,
			customBranding: false,
		},
	},
	[SubscriptionPlan.PRO]: {
		planType: SubscriptionPlan.PRO,
		displayName: 'Pro',
		limits: {
			[LimitType.SPEECHES_COUNT]: Infinity,
			[LimitType.ACTIVE_DAYS]: Infinity,
			[LimitType.STORAGE_MB]: 2000,
			[LimitType.TEAM_MEMBERS]: 10,
		},
		features: {
			aiAnalysis: true,
			exportOptions: ['pdf', 'docx', 'pptx', 'html'],
			teamCollaboration: true,
			customBranding: true,
		},
	},
};

/**
 * User subscription data interface
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
 * Enhanced subscription status check with detailed expiration logic
 */
export function isSubscriptionActive(subscription: UserSubscription): boolean {
	const now = new Date();

	// Check subscription status first
	if (subscription.subscriptionStatus) {
		const status = subscription.subscriptionStatus.toLowerCase();
		
		// Explicitly inactive statuses
		if (['canceled', 'cancelled', 'inactive', 'expired', 'past_due'].includes(status)) {
			return false;
		}
		
		// If status is active but we have an end date, check expiration
		if (status === 'active' && subscription.endDate) {
			return now < subscription.endDate;
		}
		
		// If status is active and no end date, it's active
		if (status === 'active') {
			return true;
		}
	}

	// If it's a free trial, check if within active days limit and not expired
	if (subscription.planType === SubscriptionPlan.FREE_TRIAL) {
		const trialDays = PLAN_RULES[SubscriptionPlan.FREE_TRIAL].limits[LimitType.ACTIVE_DAYS];
		const trialEndDate = new Date(subscription.startDate);
		trialEndDate.setDate(trialEndDate.getDate() + trialDays);
		
		return now < trialEndDate;
	}

	// For other plans, check if there's an end date and it's in the future
	if (subscription.endDate) {
		return now < subscription.endDate;
	}

	// If no end date and no clear status, assume active for paid plans
	return subscription.planType !== SubscriptionPlan.FREE_TRIAL;
}

/**
 * Check if subscription is expired specifically
 */
export function isSubscriptionExpired(subscription: UserSubscription): boolean {
	const now = new Date();
	
	// Check status-based expiration
	if (subscription.subscriptionStatus) {
		const status = subscription.subscriptionStatus.toLowerCase();
		if (['expired', 'canceled', 'cancelled', 'inactive'].includes(status)) {
			return true;
		}
	}
	
	// Check date-based expiration
	if (subscription.endDate && now >= subscription.endDate) {
		return true;
	}
	
	// Check free trial expiration
	if (subscription.planType === SubscriptionPlan.FREE_TRIAL) {
		const trialDays = PLAN_RULES[SubscriptionPlan.FREE_TRIAL].limits[LimitType.ACTIVE_DAYS];
		const trialEndDate = new Date(subscription.startDate);
		trialEndDate.setDate(trialEndDate.getDate() + trialDays);
		
		return now >= trialEndDate;
	}
	
	return false;
}

/**
 * Check if user can create a new speech based on their plan with enhanced logic
 */
export function canCreateSpeech(subscription: UserSubscription): {
	allowed: boolean;
	reason?: string;
} {
	// First check if subscription is expired
	if (isSubscriptionExpired(subscription)) {
		return {
			allowed: false,
			reason: `Your ${PLAN_RULES[subscription.planType].displayName} has expired. Please upgrade or renew to continue.`,
		};
	}

	// Check if subscription is active
	if (!isSubscriptionActive(subscription)) {
		return {
			allowed: false,
			reason: 'Your subscription is not active. Please upgrade or contact support.',
		};
	}

	// Get speech limit for current plan
	const speechLimit = PLAN_RULES[subscription.planType].limits[LimitType.SPEECHES_COUNT];

	// Check if user has reached their speech limit
	if (speechLimit !== Infinity && subscription.usageStats.speechesUsed >= speechLimit) {
		return {
			allowed: false,
			reason: `You've reached your limit of ${speechLimit} speeches for your ${PLAN_RULES[subscription.planType].displayName} plan.`,
		};
	}

	return { allowed: true };
}

/**
 * Check if feature is available for user's plan with expiration check
 */
export function isFeatureAvailable(
	subscription: UserSubscription,
	feature: 'aiAnalysis' | 'teamCollaboration' | 'customBranding'
): boolean;
export function isFeatureAvailable(
	subscription: UserSubscription,
	feature: 'exportOptions'
): string[];
export function isFeatureAvailable(
	subscription: UserSubscription,
	feature: keyof PlanRules['features']
): boolean | string[] {
	// Check if subscription is active first
	if (!isSubscriptionActive(subscription) || isSubscriptionExpired(subscription)) {
		return feature === 'exportOptions' ? [] : false;
	}

	return PLAN_RULES[subscription.planType].features[feature];
}

/**
 * Get days remaining in subscription (for trials or time-limited plans)
 */
export function getDaysRemaining(subscription: UserSubscription): number {
	const now = new Date();
	
	if (subscription.planType === SubscriptionPlan.FREE_TRIAL) {
		const trialDays = PLAN_RULES[SubscriptionPlan.FREE_TRIAL].limits[LimitType.ACTIVE_DAYS];
		const trialEndDate = new Date(subscription.startDate);
		trialEndDate.setDate(trialEndDate.getDate() + trialDays);

		const diffTime = trialEndDate.getTime() - now.getTime();
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

		return Math.max(0, diffDays);
	}
	
	// For other plans with end dates
	if (subscription.endDate) {
		const diffTime = subscription.endDate.getTime() - now.getTime();
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		return Math.max(0, diffDays);
	}
	
	return 0;
}

/**
 * Get trial days remaining specifically
 */
export function getTrialDaysRemaining(subscription: UserSubscription): number {
	if (subscription.planType !== SubscriptionPlan.FREE_TRIAL) {
		return 0;
	}

	return getDaysRemaining(subscription);
}

/**
 * Record speech usage for a user
 */
export function recordSpeechUsage(subscription: UserSubscription): UserSubscription {
	return {
		...subscription,
		usageStats: {
			...subscription.usageStats,
			speechesUsed: subscription.usageStats.speechesUsed + 1,
		},
	};
}

/**
 * Get upgrade options for current plan
 */
export function getUpgradeOptions(currentPlan: SubscriptionPlan): SubscriptionPlan[] {
	const allPlans = Object.values(SubscriptionPlan);
	const currentIndex = allPlans.indexOf(currentPlan);

	return allPlans.slice(currentIndex + 1);
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
	
	// Show upgrade if expired, inactive, trial ending soon, or close to limits
	const shouldShowUpgrade = isExpired || 
		(!isActive) ||
		(subscription.planType === SubscriptionPlan.FREE_TRIAL && daysRemaining <= 2) ||
		(subscription.planType !== SubscriptionPlan.PRO && 
		 PLAN_RULES[subscription.planType].limits[LimitType.SPEECHES_COUNT] !== Infinity && 
		 subscription.usageStats.speechesUsed >= PLAN_RULES[subscription.planType].limits[LimitType.SPEECHES_COUNT] - 1);
	
	return {
		effectivePlan,
		isActive,
		isExpired,
		shouldShowUpgrade
	};
}
