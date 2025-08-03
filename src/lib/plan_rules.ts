
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
