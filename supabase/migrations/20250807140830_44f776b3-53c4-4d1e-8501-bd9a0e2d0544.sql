-- Create or update the trigger function to initialize speech credits for new users
CREATE OR REPLACE FUNCTION public.initialize_user_speech_credits()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  credits_to_grant INTEGER;
  period_end_date TIMESTAMPTZ;
BEGIN
  -- Determine credits and period end based on plan type
  CASE NEW.subscription_plan
    WHEN 'free_trial' THEN 
      credits_to_grant := 1;
      period_end_date := COALESCE(NEW.subscription_end_date, now() + INTERVAL '7 days');
    WHEN 'premium' THEN 
      credits_to_grant := 3;
      period_end_date := NEW.subscription_end_date;
    WHEN 'pro' THEN 
      credits_to_grant := 999999; -- Effectively unlimited
      period_end_date := NEW.subscription_end_date;
    ELSE 
      credits_to_grant := 0;
      period_end_date := now();
  END CASE;

  -- Insert new credit period
  INSERT INTO public.speech_credits (
    user_id,
    plan_type,
    credits_granted,
    credits_used,
    period_start,
    period_end,
    is_active
  ) VALUES (
    NEW.id,
    NEW.subscription_plan,
    credits_to_grant,
    0,
    COALESCE(NEW.subscription_start_date, now()),
    period_end_date,
    true
  );

  RETURN NEW;
END;
$$;

-- Create trigger to initialize speech credits when a profile is created
DROP TRIGGER IF EXISTS initialize_speech_credits_on_profile_creation ON public.profiles;
CREATE TRIGGER initialize_speech_credits_on_profile_creation
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.initialize_user_speech_credits();

-- Create trigger to update speech credits when subscription plan changes
DROP TRIGGER IF EXISTS update_speech_credits_on_plan_change ON public.profiles;
CREATE TRIGGER update_speech_credits_on_plan_change
  AFTER UPDATE OF subscription_plan ON public.profiles
  FOR EACH ROW
  WHEN (OLD.subscription_plan IS DISTINCT FROM NEW.subscription_plan)
  EXECUTE FUNCTION public.initialize_user_speech_credits();

-- Initialize credits for existing users who don't have any
INSERT INTO public.speech_credits (
  user_id,
  plan_type,
  credits_granted,
  credits_used,
  period_start,
  period_end,
  is_active
)
SELECT 
  p.id,
  p.subscription_plan,
  CASE p.subscription_plan
    WHEN 'free_trial' THEN 1
    WHEN 'premium' THEN 3
    WHEN 'pro' THEN 999999
    ELSE 0
  END as credits_granted,
  0 as credits_used,
  COALESCE(p.subscription_start_date, now()) as period_start,
  CASE p.subscription_plan
    WHEN 'free_trial' THEN COALESCE(p.subscription_end_date, now() + INTERVAL '7 days')
    ELSE p.subscription_end_date
  END as period_end,
  true as is_active
FROM public.profiles p
LEFT JOIN public.speech_credits sc ON p.id = sc.user_id AND sc.is_active = true
WHERE sc.id IS NULL
  AND p.subscription_plan IS NOT NULL;