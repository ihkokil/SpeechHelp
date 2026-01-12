CREATE OR REPLACE FUNCTION public.can_create_speech_with_credits(user_id_param uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  active_credit_period RECORD;
  current_speeches_count INTEGER;
  user_profile RECORD;
  result JSONB;
BEGIN
  -- Get user profile to check subscription status
  SELECT subscription_plan, subscription_status, subscription_end_date
  INTO user_profile
  FROM public.profiles
  WHERE id = user_id_param;

  -- Get the most recent active credit period for this user
  SELECT * INTO active_credit_period
  FROM public.speech_credits
  WHERE user_id = user_id_param 
    AND is_active = true
  ORDER BY created_at DESC
  LIMIT 1;

  -- If no active period found, check if user ever had a trial
  IF active_credit_period IS NULL THEN
    -- Check if user had a free trial before
    IF EXISTS (
      SELECT 1 FROM public.speech_credits 
      WHERE user_id = user_id_param AND plan_type = 'free_trial'
    ) THEN
      RETURN jsonb_build_object(
        'allowed', false,
        'reason', 'Your free trial has ended. Upgrade to Premium or Pro to continue creating speeches.',
        'status', 'trial_ended'
      );
    ELSE
      RETURN jsonb_build_object(
        'allowed', false,
        'reason', 'No active subscription plan found. Please subscribe to start creating speeches.',
        'status', 'no_subscription'
      );
    END IF;
  END IF;

  -- Check if the credit period has expired (time-based)
  IF active_credit_period.period_end IS NOT NULL AND active_credit_period.period_end < now() THEN
    -- Different messages based on plan type
    IF active_credit_period.plan_type = 'free_trial' THEN
      RETURN jsonb_build_object(
        'allowed', false,
        'reason', 'Your 7-day free trial has expired. Upgrade to Premium or Pro to continue creating speeches.',
        'status', 'trial_expired',
        'plan_type', active_credit_period.plan_type
      );
    ELSE
      RETURN jsonb_build_object(
        'allowed', false,
        'reason', format('Your %s subscription has expired. Please renew to continue creating speeches.', 
          CASE active_credit_period.plan_type 
            WHEN 'premium' THEN 'Premium'
            WHEN 'pro' THEN 'Pro'
            ELSE active_credit_period.plan_type
          END),
        'status', 'subscription_expired',
        'plan_type', active_credit_period.plan_type
      );
    END IF;
  END IF;

  -- Count speeches created in current period
  SELECT COUNT(*) INTO current_speeches_count
  FROM public.speeches
  WHERE user_id = user_id_param
    AND deleted_at IS NULL
    AND created_at >= active_credit_period.period_start
    AND (
      active_credit_period.period_end IS NULL OR 
      created_at <= active_credit_period.period_end
    );

  -- For Pro plan (unlimited credits)
  IF active_credit_period.credits_granted >= 999999 THEN
    RETURN jsonb_build_object(
      'allowed', true,
      'credits_remaining', 999999,
      'period_id', active_credit_period.id,
      'plan_type', active_credit_period.plan_type,
      'billing_cycle', active_credit_period.billing_cycle,
      'current_usage', current_speeches_count,
      'status', 'unlimited'
    );
  END IF;

  -- For plans with limited credits
  IF current_speeches_count < active_credit_period.credits_granted THEN
    RETURN jsonb_build_object(
      'allowed', true,
      'credits_remaining', active_credit_period.credits_granted - current_speeches_count,
      'credits_granted', active_credit_period.credits_granted,
      'period_id', active_credit_period.id,
      'plan_type', active_credit_period.plan_type,
      'billing_cycle', active_credit_period.billing_cycle,
      'current_usage', current_speeches_count,
      'status', 'active'
    );
  ELSE
    -- Credits exhausted - different messages based on plan type
    IF active_credit_period.plan_type = 'free_trial' THEN
      RETURN jsonb_build_object(
        'allowed', false,
        'reason', 'You''ve used your 1 free trial speech. Upgrade to Premium for 3 speeches/month or Pro for unlimited speeches.',
        'status', 'trial_credits_used',
        'current_usage', current_speeches_count,
        'credits_granted', active_credit_period.credits_granted,
        'plan_type', active_credit_period.plan_type
      );
    ELSE
      -- Paid plan limit reached
      RETURN jsonb_build_object(
        'allowed', false,
        'reason', format(
          'You''ve reached your limit of %s speeches for this %s. %s',
          active_credit_period.credits_granted,
          CASE active_credit_period.billing_cycle 
            WHEN 'yearly' THEN 'month'
            ELSE 'billing period'
          END,
          CASE 
            WHEN active_credit_period.billing_cycle = 'yearly' 
            THEN 'Your credits will renew next month, or upgrade to Pro for unlimited speeches.'
            ELSE 'Upgrade to Pro for unlimited speeches.'
          END
        ),
        'status', 'limit_reached',
        'current_usage', current_speeches_count,
        'credits_granted', active_credit_period.credits_granted,
        'plan_type', active_credit_period.plan_type,
        'billing_cycle', active_credit_period.billing_cycle,
        'next_monthly_renewal', active_credit_period.next_monthly_renewal
      );
    END IF;
  END IF;
END;
$function$;