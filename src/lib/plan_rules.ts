/*
 * Regarding the respective plans we have, indeed, we would need to setup 
 * some type of user "permission" structure/system which recognizes the 
 * users selected plan, and then makes the system function accordingly... 
 * 
 * In other words (for example; if they select a free trial, the system 
 * needs to automatically "deactivate" the users account after 7 days and 
 * only allow a single speech etc., unless they upgrade their plan, if 
 * they select the premium plan, the system needs to only allow three (3) 
 * speeches per month etc. So indeed, I assume some type of permission/
 * restriction system should be implemented.
 * 
 * This said, I'm wondering (in your opinion), if we are perhaps making 
 * it too complicated? For your reference, I have attached the payment 
 * plan (though this may actually be too simple [so to speak] and maybe 
 * we should shoot for something in between what we have and their plan 
 * system), of a SaaS company that developed something similar.
 * 
 * FYI... if you want to check out their system, I have an account that 
 * you can use to review the Verble application, as follows:
 * 
 * URL: https://www.create.verble.app/login/
 */

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
	usageStats: {
		speechesUsed: number;
		storageUsed: number;
		teamMembersAdded: number;
	};
}

/**
 * Check if a user's subscription is active
 */
export function isSubscriptionActive(subscription: UserSubscription): boolean {
	const now = new Date();

	// If it's a free trial, check if within active days limit
	if (subscription.planType === SubscriptionPlan.FREE_TRIAL) {
		const trialDays = PLAN_RULES[SubscriptionPlan.FREE_TRIAL].limits[LimitType.ACTIVE_DAYS];
		const trialEndDate = new Date(subscription.startDate);
		trialEndDate.setDate(trialEndDate.getDate() + trialDays);
		console.log('trialEndDate', trialEndDate);

		return now < trialEndDate;
	}

	// For other plans, check if there's an end date and it's in the future
	if (subscription.endDate) {
		return now < subscription.endDate;
	}

	return true;
}

/**
 * Check if user can create a new speech based on their plan
 */
export function canCreateSpeech(subscription: UserSubscription): {
	allowed: boolean;
	reason?: string;
} {
	// Check if subscription is active
	if (!isSubscriptionActive(subscription)) {
		return {
			allowed: false,
			reason: 'Your subscription is not active. Please renew or upgrade.',
		};
	}

	// Get speech limit for current plan
	const speechLimit = PLAN_RULES[subscription.planType].limits[LimitType.SPEECHES_COUNT];

	// Check if user has reached their speech limit
	if (subscription.usageStats.speechesUsed >= speechLimit) {
		return {
			allowed: false,
			reason: `You've reached your limit of ${speechLimit} speeches for your ${PLAN_RULES[subscription.planType].displayName}.`,
		};
	}

	return { allowed: true };
}

/**
 * Check if feature is available for user's plan
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
	if (!isSubscriptionActive(subscription)) {
		return feature === 'exportOptions' ? [] : false;
	}

	return PLAN_RULES[subscription.planType].features[feature];
}

/**
 * Get days remaining in trial
 */
export function getTrialDaysRemaining(subscription: UserSubscription): number {
	if (subscription.planType !== SubscriptionPlan.FREE_TRIAL) {
		return 0;
	}

	const trialDays = PLAN_RULES[SubscriptionPlan.FREE_TRIAL].limits[LimitType.ACTIVE_DAYS];
	const trialEndDate = new Date(subscription.startDate);
	trialEndDate.setDate(trialEndDate.getDate() + trialDays);

	const now = new Date();
	const diffTime = trialEndDate.getTime() - now.getTime();
	const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

	return Math.max(0, diffDays);
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