-- Add billing_cycle and monthly tracking fields to speech_credits table
ALTER TABLE public.speech_credits 
ADD COLUMN billing_cycle TEXT DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'yearly')),
ADD COLUMN monthly_credits_granted INTEGER DEFAULT 0,
ADD COLUMN next_monthly_renewal TIMESTAMPTZ NULL,
ADD COLUMN yearly_total_credits INTEGER DEFAULT 0;

-- Add billing_period to profiles table for better tracking
ALTER TABLE public.profiles 
ADD COLUMN billing_period TEXT DEFAULT 'monthly' CHECK (billing_period IN ('monthly', 'yearly'));

-- Create function to handle monthly credit renewal for yearly plans
CREATE OR REPLACE FUNCTION public.renew_monthly_credits_for_yearly_plans()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  credit_record RECORD;
  new_period_start TIMESTAMPTZ;
  new_period_end TIMESTAMPTZ;
BEGIN
  -- Find all active yearly plans that need monthly credit renewal
  FOR credit_record IN 
    SELECT * FROM public.speech_credits 
    WHERE billing_cycle = 'yearly' 
      AND is_active = true 
      AND next_monthly_renewal IS NOT NULL 
      AND next_monthly_renewal <= now()
      AND (period_end IS NULL OR period_end > now())
  LOOP
    -- Calculate new period dates
    new_period_start := credit_record.next_monthly_renewal;
    new_period_end := new_period_start + INTERVAL '1 month';
    
    -- Create new monthly credit period for yearly plan
    INSERT INTO public.speech_credits (
      user_id,
      plan_type,
      billing_cycle,
      credits_granted,
      credits_used,
      period_start,
      period_end,
      next_monthly_renewal,
      yearly_total_credits,
      is_active
    ) VALUES (
      credit_record.user_id,
      credit_record.plan_type,
      'yearly',
      CASE 
        WHEN credit_record.plan_type = 'premium' THEN 3
        ELSE 0
      END,
      0,
      new_period_start,
      new_period_end,
      new_period_start + INTERVAL '1 month',
      credit_record.yearly_total_credits,
      true
    );
    
    -- Update the next renewal date in the original record
    UPDATE public.speech_credits 
    SET next_monthly_renewal = new_period_start + INTERVAL '1 month'
    WHERE id = credit_record.id;
  END LOOP;
END;
$$;

-- Update the existing initialize_speech_credits function to handle yearly plans properly
CREATE OR REPLACE FUNCTION public.initialize_speech_credits(
  user_id_param uuid, 
  plan_type_param text, 
  period_start_param timestamp with time zone DEFAULT now(), 
  period_end_param timestamp with time zone DEFAULT NULL::timestamp with time zone,
  billing_cycle_param text DEFAULT 'monthly'
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  credits_to_grant INTEGER;
  new_credit_period_id UUID;
  next_renewal TIMESTAMPTZ;
  yearly_total INTEGER := 0;
BEGIN
  -- Deactivate any existing active credit periods for this user
  UPDATE public.speech_credits
  SET is_active = false, updated_at = now()
  WHERE user_id = user_id_param AND is_active = true;

  -- Determine credits based on plan type and billing cycle
  CASE plan_type_param
    WHEN 'free_trial' THEN 
      credits_to_grant := 1;
      yearly_total := 1;
    WHEN 'premium' THEN 
      IF billing_cycle_param = 'yearly' THEN
        credits_to_grant := 3; -- First month's credits
        yearly_total := 36; -- 3 credits × 12 months
        next_renewal := period_start_param + INTERVAL '1 month';
      ELSE
        credits_to_grant := 3;
        yearly_total := 3;
      END IF;
    WHEN 'pro' THEN 
      credits_to_grant := 999999; -- Effectively unlimited
      yearly_total := 999999;
    ELSE 
      credits_to_grant := 0;
      yearly_total := 0;
  END CASE;

  -- Create new credit period
  INSERT INTO public.speech_credits (
    user_id,
    plan_type,
    billing_cycle,
    credits_granted,
    credits_used,
    period_start,
    period_end,
    next_monthly_renewal,
    yearly_total_credits,
    is_active
  ) VALUES (
    user_id_param,
    plan_type_param,
    billing_cycle_param,
    credits_to_grant,
    0,
    period_start_param,
    CASE 
      WHEN billing_cycle_param = 'yearly' AND plan_type_param = 'premium' 
      THEN period_start_param + INTERVAL '1 month' -- Monthly periods within yearly plan
      ELSE period_end_param 
    END,
    next_renewal,
    yearly_total,
    true
  ) RETURNING id INTO new_credit_period_id;

  RETURN new_credit_period_id;
END;
$$;