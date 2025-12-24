-- Add new tables for speech credits and plan periods tracking
CREATE TABLE IF NOT EXISTS public.speech_credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_type TEXT NOT NULL,
  credits_granted INTEGER NOT NULL DEFAULT 0,
  credits_used INTEGER NOT NULL DEFAULT 0,
  period_start TIMESTAMPTZ NOT NULL,
  period_end TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add plan transitions tracking table
CREATE TABLE IF NOT EXISTS public.plan_transitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  from_plan TEXT,
  to_plan TEXT NOT NULL,
  transition_type TEXT NOT NULL CHECK (transition_type IN ('signup', 'upgrade', 'downgrade', 'renewal', 'expiration')),
  transition_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  grandfathered_content INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add speech period tracking to speeches table
ALTER TABLE public.speeches 
ADD COLUMN IF NOT EXISTS plan_period_id UUID REFERENCES public.speech_credits(id),
ADD COLUMN IF NOT EXISTS is_grandfathered BOOLEAN DEFAULT false;

-- Enable RLS on new tables
ALTER TABLE public.speech_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plan_transitions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for speech_credits
CREATE POLICY "Users can view their own speech credits" 
ON public.speech_credits 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own speech credits" 
ON public.speech_credits 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage speech credits" 
ON public.speech_credits 
FOR ALL 
USING (true);

-- Create RLS policies for plan_transitions
CREATE POLICY "Users can view their own plan transitions" 
ON public.plan_transitions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage plan transitions" 
ON public.plan_transitions 
FOR ALL 
USING (true);

-- Create function to initialize speech credits for a new plan
CREATE OR REPLACE FUNCTION public.initialize_speech_credits(
  user_id_param UUID,
  plan_type_param TEXT,
  period_start_param TIMESTAMPTZ DEFAULT now(),
  period_end_param TIMESTAMPTZ DEFAULT NULL
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  credits_to_grant INTEGER;
  new_credit_period_id UUID;
BEGIN
  -- Determine credits based on plan type
  CASE plan_type_param
    WHEN 'free_trial' THEN credits_to_grant := 1;
    WHEN 'premium' THEN credits_to_grant := 3;
    WHEN 'pro' THEN credits_to_grant := 999999; -- Effectively unlimited
    ELSE credits_to_grant := 0;
  END CASE;

  -- Create new credit period
  INSERT INTO public.speech_credits (
    user_id,
    plan_type,
    credits_granted,
    credits_used,
    period_start,
    period_end
  ) VALUES (
    user_id_param,
    plan_type_param,
    credits_to_grant,
    0,
    period_start_param,
    period_end_param
  ) RETURNING id INTO new_credit_period_id;

  RETURN new_credit_period_id;
END;
$$;

-- Create function to handle plan transitions with grandfathering
CREATE OR REPLACE FUNCTION public.handle_plan_transition(
  user_id_param UUID,
  from_plan_param TEXT,
  to_plan_param TEXT,
  transition_type_param TEXT,
  grandfathered_content_param INTEGER DEFAULT 0
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_credits_used INTEGER := 0;
  new_credit_period_id UUID;
  result JSONB;
BEGIN
  -- Get current usage if transitioning from an existing plan
  IF from_plan_param IS NOT NULL THEN
    SELECT COALESCE(SUM(credits_used), 0) INTO current_credits_used
    FROM public.speech_credits
    WHERE user_id = user_id_param AND is_active = true;
    
    -- Deactivate old credit periods
    UPDATE public.speech_credits
    SET is_active = false, updated_at = now()
    WHERE user_id = user_id_param AND is_active = true;
  END IF;

  -- Record the transition
  INSERT INTO public.plan_transitions (
    user_id,
    from_plan,
    to_plan,
    transition_type,
    grandfathered_content
  ) VALUES (
    user_id_param,
    from_plan_param,
    to_plan_param,
    transition_type_param,
    grandfathered_content_param
  );

  -- Initialize new credit period
  SELECT public.initialize_speech_credits(
    user_id_param,
    to_plan_param,
    now(),
    CASE 
      WHEN to_plan_param = 'free_trial' THEN now() + INTERVAL '7 days'
      ELSE NULL
    END
  ) INTO new_credit_period_id;

  -- Mark existing speeches as grandfathered if this is an upgrade/renewal
  IF transition_type_param IN ('upgrade', 'renewal') AND grandfathered_content_param > 0 THEN
    UPDATE public.speeches
    SET is_grandfathered = true, updated_at = now()
    WHERE user_id = user_id_param 
      AND deleted_at IS NULL
      AND is_grandfathered IS NOT TRUE;
  END IF;

  result := jsonb_build_object(
    'success', true,
    'new_credit_period_id', new_credit_period_id,
    'grandfathered_content', grandfathered_content_param,
    'previous_usage', current_credits_used
  );

  RETURN result;
END;
$$;

-- Create function to check if user can create speech with new credit system
CREATE OR REPLACE FUNCTION public.can_create_speech_with_credits(user_id_param UUID) 
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  active_credit_period RECORD;
  current_speeches_count INTEGER;
  result JSONB;
BEGIN
  -- Get active credit period
  SELECT * INTO active_credit_period
  FROM public.speech_credits
  WHERE user_id = user_id_param 
    AND is_active = true
    AND (period_end IS NULL OR period_end > now())
  ORDER BY created_at DESC
  LIMIT 1;

  IF active_credit_period IS NULL THEN
    RETURN jsonb_build_object(
      'allowed', false,
      'reason', 'No active subscription plan found'
    );
  END IF;

  -- Count non-grandfathered speeches created in current period
  SELECT COUNT(*) INTO current_speeches_count
  FROM public.speeches
  WHERE user_id = user_id_param
    AND deleted_at IS NULL
    AND plan_period_id = active_credit_period.id;

  -- Check if user has credits remaining
  IF active_credit_period.credits_granted = 999999 THEN -- Pro plan (unlimited)
    RETURN jsonb_build_object(
      'allowed', true,
      'credits_remaining', 999999,
      'period_id', active_credit_period.id
    );
  ELSIF current_speeches_count < active_credit_period.credits_granted THEN
    RETURN jsonb_build_object(
      'allowed', true,
      'credits_remaining', active_credit_period.credits_granted - current_speeches_count,
      'period_id', active_credit_period.id
    );
  ELSE
    RETURN jsonb_build_object(
      'allowed', false,
      'reason', format(
        'You have reached your limit of %s speeches for your %s plan. Upgrade to create more speeches.',
        active_credit_period.credits_granted,
        active_credit_period.plan_type
      )
    );
  END IF;
END;
$$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_speech_credits_user_active ON public.speech_credits(user_id, is_active, period_end);
CREATE INDEX IF NOT EXISTS idx_plan_transitions_user_date ON public.plan_transitions(user_id, transition_date);
CREATE INDEX IF NOT EXISTS idx_speeches_period_grandfathered ON public.speeches(plan_period_id, is_grandfathered, deleted_at);