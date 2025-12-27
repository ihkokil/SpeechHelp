-- Fix data integrity by updating speeches with null plan_period_id
-- First, let's create a function to fix existing data
CREATE OR REPLACE FUNCTION public.fix_speech_plan_period_ids()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  fixed_count INTEGER := 0;
  speech_record RECORD;
  active_period_id UUID;
BEGIN
  -- Loop through speeches with null plan_period_id
  FOR speech_record IN 
    SELECT s.id, s.user_id, s.created_at 
    FROM public.speeches s
    WHERE s.plan_period_id IS NULL AND s.deleted_at IS NULL
  LOOP
    -- Find the active credit period for this user at the time the speech was created
    SELECT sc.id INTO active_period_id
    FROM public.speech_credits sc
    WHERE sc.user_id = speech_record.user_id
      AND sc.is_active = true
      AND sc.period_start <= speech_record.created_at
      AND (sc.period_end IS NULL OR sc.period_end > speech_record.created_at)
    ORDER BY sc.created_at DESC
    LIMIT 1;
    
    -- If no specific period found, get the most recent active period
    IF active_period_id IS NULL THEN
      SELECT sc.id INTO active_period_id
      FROM public.speech_credits sc
      WHERE sc.user_id = speech_record.user_id
        AND sc.is_active = true
      ORDER BY sc.created_at DESC
      LIMIT 1;
    END IF;
    
    -- Update the speech with the found period_id
    IF active_period_id IS NOT NULL THEN
      UPDATE public.speeches
      SET plan_period_id = active_period_id, updated_at = now()
      WHERE id = speech_record.id;
      
      fixed_count := fixed_count + 1;
    END IF;
  END LOOP;
  
  RETURN jsonb_build_object(
    'success', true,
    'fixed_speeches', fixed_count,
    'message', format('Fixed %s speeches with missing plan_period_id', fixed_count)
  );
END;
$function$;

-- Improve the can_create_speech_with_credits function with better validation
CREATE OR REPLACE FUNCTION public.can_create_speech_with_credits(user_id_param uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  active_credit_period RECORD;
  current_speeches_count INTEGER;
  result JSONB;
BEGIN
  -- Get active credit period with better validation
  SELECT * INTO active_credit_period
  FROM public.speech_credits
  WHERE user_id = user_id_param 
    AND is_active = true
    AND (period_end IS NULL OR period_end > now())
  ORDER BY created_at DESC
  LIMIT 1;

  -- If no active period found, return specific error
  IF active_credit_period IS NULL THEN
    RETURN jsonb_build_object(
      'allowed', false,
      'reason', 'No active subscription plan found. Please contact support.',
      'debug_info', jsonb_build_object(
        'user_id', user_id_param,
        'timestamp', now()
      )
    );
  END IF;

  -- Count speeches created in current period with better filtering
  -- Only count non-deleted speeches that belong to this specific period
  SELECT COUNT(*) INTO current_speeches_count
  FROM public.speeches
  WHERE user_id = user_id_param
    AND deleted_at IS NULL
    AND plan_period_id = active_credit_period.id;

  -- For Pro plan (unlimited credits)
  IF active_credit_period.credits_granted >= 999999 THEN
    RETURN jsonb_build_object(
      'allowed', true,
      'credits_remaining', 999999,
      'period_id', active_credit_period.id,
      'plan_type', active_credit_period.plan_type,
      'current_usage', current_speeches_count,
      'debug_info', jsonb_build_object(
        'period_start', active_credit_period.period_start,
        'period_end', active_credit_period.period_end,
        'is_unlimited', true
      )
    );
  END IF;

  -- For plans with limited credits
  IF current_speeches_count < active_credit_period.credits_granted THEN
    RETURN jsonb_build_object(
      'allowed', true,
      'credits_remaining', active_credit_period.credits_granted - current_speeches_count,
      'period_id', active_credit_period.id,
      'plan_type', active_credit_period.plan_type,
      'current_usage', current_speeches_count,
      'debug_info', jsonb_build_object(
        'credits_granted', active_credit_period.credits_granted,
        'period_start', active_credit_period.period_start,
        'period_end', active_credit_period.period_end
      )
    );
  ELSE
    RETURN jsonb_build_object(
      'allowed', false,
      'reason', format(
        'You have reached your limit of %s speeches for your %s plan. Upgrade to create more speeches.',
        active_credit_period.credits_granted,
        active_credit_period.plan_type
      ),
      'current_usage', current_speeches_count,
      'credits_granted', active_credit_period.credits_granted,
      'plan_type', active_credit_period.plan_type
    );
  END IF;
END;
$function$;