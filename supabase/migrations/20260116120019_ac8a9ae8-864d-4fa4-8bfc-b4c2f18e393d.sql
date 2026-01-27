-- Fix SECURITY DEFINER functions missing search_path
-- This prevents search_path injection attacks

-- First drop functions that need return type changes or have multiple overloads
DROP FUNCTION IF EXISTS public.can_create_speech_with_credits(uuid);
DROP FUNCTION IF EXISTS public.initialize_speech_credits(uuid, text);
DROP FUNCTION IF EXISTS public.admin_update_user_profile(uuid, text, text, text, text, text, text, text, text, text, boolean);
DROP FUNCTION IF EXISTS public.admin_update_user_profile(uuid, text, text, text, boolean, jsonb);
DROP FUNCTION IF EXISTS public.admin_update_user_profile(uuid, text, text, text, text, boolean, jsonb);
DROP FUNCTION IF EXISTS public.get_admin_settings(text);
DROP FUNCTION IF EXISTS public.upsert_admin_setting(text, jsonb, text);
DROP FUNCTION IF EXISTS public.toggle_user_admin_status(uuid, boolean, text);
DROP FUNCTION IF EXISTS public.update_user_admin_status(uuid, boolean, text, jsonb);

-- Now recreate functions with proper search_path

-- Fix soft_delete_speech
CREATE OR REPLACE FUNCTION public.soft_delete_speech(speech_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  result JSONB;
BEGIN
  UPDATE public.speeches
  SET 
    deleted_at = now(),
    updated_at = now()
  WHERE id = speech_id AND user_id = auth.uid() AND deleted_at IS NULL;
  
  IF FOUND THEN
    result := jsonb_build_object(
      'success', true,
      'message', 'Speech soft deleted successfully',
      'deleted_at', now()
    );
  ELSE
    result := jsonb_build_object(
      'success', false,
      'error', 'Speech not found or already deleted'
    );
  END IF;
  
  RETURN result;
END;
$function$;

-- Fix can_create_speech_with_credits
CREATE OR REPLACE FUNCTION public.can_create_speech_with_credits(user_id_param uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  active_credit_period RECORD;
  current_speeches_count INTEGER;
  user_profile RECORD;
  result JSONB;
BEGIN
  SELECT subscription_plan, subscription_status, subscription_end_date
  INTO user_profile
  FROM public.profiles
  WHERE id = user_id_param;

  SELECT * INTO active_credit_period
  FROM public.speech_credits
  WHERE user_id = user_id_param 
    AND is_active = true
  ORDER BY created_at DESC
  LIMIT 1;

  IF active_credit_period IS NULL THEN
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

  IF active_credit_period.period_end IS NOT NULL AND active_credit_period.period_end < now() THEN
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

  SELECT COUNT(*) INTO current_speeches_count
  FROM public.speeches
  WHERE user_id = user_id_param
    AND deleted_at IS NULL
    AND created_at >= active_credit_period.period_start
    AND (
      active_credit_period.period_end IS NULL OR 
      created_at <= active_credit_period.period_end
    );

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
      RETURN jsonb_build_object(
        'allowed', false,
        'reason', format(
          'You''ve reached your limit of %s speeches for this billing period. Upgrade to Pro for unlimited speeches.',
          active_credit_period.credits_granted
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

-- Fix cleanup_expired_otps
CREATE OR REPLACE FUNCTION public.cleanup_expired_otps()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  DELETE FROM public.password_reset_otps 
  WHERE expires_at < now() OR is_used = true;
END;
$function$;

-- Fix admin_has_permission
CREATE OR REPLACE FUNCTION public.admin_has_permission(permission_name text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users au
    JOIN public.admin_user_roles aur ON au.id = aur.admin_user_id
    JOIN public.admin_role_permissions arp ON aur.role_id = arp.role_id
    JOIN public.admin_permissions ap ON arp.permission_id = ap.id
    WHERE au.id = auth.uid() AND ap.name = permission_name
  );
$function$;

-- Fix is_admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE id = auth.uid()
  );
$function$;

-- Fix log_admin_activity
CREATE OR REPLACE FUNCTION public.log_admin_activity(admin_id_input uuid, action_input text, entity_type_input text, entity_id_input uuid, details_input jsonb, ip_address_input text DEFAULT NULL, user_agent_input text DEFAULT NULL)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  log_id UUID;
BEGIN
  INSERT INTO public.activity_logs (
    admin_id, action, entity_type, entity_id, details, ip_address, user_agent
  ) VALUES (
    admin_id_input, action_input, entity_type_input, entity_id_input, details_input, ip_address_input, user_agent_input
  ) RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$function$;

-- Fix generate_backup_codes
CREATE OR REPLACE FUNCTION public.generate_backup_codes()
RETURNS text[]
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  codes TEXT[] := '{}';
  i INTEGER;
BEGIN
  FOR i IN 1..8 LOOP
    codes := array_append(codes, LPAD(FLOOR(RANDOM() * 100000000)::TEXT, 8, '0'));
  END LOOP;
  RETURN codes;
END;
$function$;

-- Fix get_admin_dashboard_stats
CREATE OR REPLACE FUNCTION public.get_admin_dashboard_stats()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  total_users INTEGER;
  active_sessions INTEGER;
  new_users_last_day INTEGER;
  total_speeches INTEGER;
  recent_activities JSON;
  system_status JSON;
BEGIN
  SELECT COUNT(*) INTO total_users FROM auth.users;
  SELECT 35 INTO active_sessions;
  SELECT COUNT(*) INTO new_users_last_day 
  FROM auth.users 
  WHERE created_at > now() - interval '1 day';
  SELECT COUNT(*) INTO total_speeches FROM public.speeches;
  
  SELECT json_agg(recent) INTO recent_activities FROM (
    SELECT 
      u.email as user_email,
      s.title,
      s.speech_type,
      s.created_at
    FROM public.speeches s
    JOIN auth.users u ON s.user_id = u.id
    ORDER BY s.created_at DESC
    LIMIT 5
  ) AS recent;
  
  SELECT json_build_object(
    'uptime', '99.98%',
    'avg_response_time', '297ms',
    'error_rate', '0.05%',
    'active_warnings', 2
  ) INTO system_status;
  
  RETURN json_build_object(
    'total_users', total_users,
    'active_sessions', active_sessions,
    'new_users_last_day', new_users_last_day,
    'total_speeches', total_speeches,
    'recent_activities', recent_activities,
    'system_status', system_status
  );
END;
$function$;

-- Fix create_first_admin
CREATE OR REPLACE FUNCTION public.create_first_admin(email_input text, username_input text, password_input text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  admin_count INTEGER;
  new_admin_id UUID;
BEGIN
  SELECT COUNT(*) INTO admin_count FROM public.admin_users;
  
  IF admin_count > 0 THEN
    RAISE EXCEPTION 'Cannot create first admin: Admin users already exist';
  END IF;
  
  INSERT INTO public.admin_users (
    email, 
    username, 
    hashed_password, 
    is_super_admin
  ) VALUES (
    email_input,
    username_input,
    crypt(password_input, gen_salt('bf')),
    true
  ) RETURNING id INTO new_admin_id;
  
  RETURN new_admin_id;
END;
$function$;

-- Fix authenticate_admin
CREATE OR REPLACE FUNCTION public.authenticate_admin(email_input text, password_input text)
RETURNS TABLE(id uuid, email text, username text, is_super_admin boolean)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    au.id,
    au.email,
    au.username,
    au.is_super_admin
  FROM public.admin_users au
  WHERE 
    au.email = email_input 
    AND au.hashed_password = crypt(password_input, au.hashed_password)
    AND au.is_active = true;
    
  UPDATE public.admin_users au
  SET 
    last_login = now(),
    failed_login_attempts = 0
  WHERE au.email = email_input AND au.hashed_password = crypt(password_input, au.hashed_password);
END;
$function$;

-- Fix renew_monthly_credits_for_yearly_plans
CREATE OR REPLACE FUNCTION public.renew_monthly_credits_for_yearly_plans()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  credit_record RECORD;
  new_period_start TIMESTAMPTZ;
  new_period_end TIMESTAMPTZ;
BEGIN
  FOR credit_record IN 
    SELECT * FROM public.speech_credits 
    WHERE billing_cycle = 'yearly' 
      AND is_active = true 
      AND next_monthly_renewal IS NOT NULL 
      AND next_monthly_renewal <= now()
      AND (period_end IS NULL OR period_end > now())
  LOOP
    new_period_start := credit_record.next_monthly_renewal;
    new_period_end := new_period_start + INTERVAL '1 month';
    
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
    
    UPDATE public.speech_credits 
    SET next_monthly_renewal = new_period_start + INTERVAL '1 month'
    WHERE id = credit_record.id;
  END LOOP;
END;
$function$;

-- Fix migrate_address_data_to_columns
CREATE OR REPLACE FUNCTION public.migrate_address_data_to_columns()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  UPDATE public.profiles
  SET 
    address_street_address = COALESCE(
      (SELECT raw_user_meta_data->>'street_address' FROM auth.users WHERE id = profiles.id),
      (SELECT raw_user_meta_data->>'streetAddress' FROM auth.users WHERE id = profiles.id),
      (SELECT raw_user_meta_data->>'address' FROM auth.users WHERE id = profiles.id)
    ),
    address_city = (SELECT raw_user_meta_data->>'city' FROM auth.users WHERE id = profiles.id),
    address_state = COALESCE(
      (SELECT raw_user_meta_data->>'state' FROM auth.users WHERE id = profiles.id),
      (SELECT raw_user_meta_data->>'province' FROM auth.users WHERE id = profiles.id)
    ),
    address_zip_code = COALESCE(
      (SELECT raw_user_meta_data->>'zip_code' FROM auth.users WHERE id = profiles.id),
      (SELECT raw_user_meta_data->>'zipCode' FROM auth.users WHERE id = profiles.id),
      (SELECT raw_user_meta_data->>'postal_code' FROM auth.users WHERE id = profiles.id)
    ),
    address_country_code = COALESCE(
      (SELECT raw_user_meta_data->>'country' FROM auth.users WHERE id = profiles.id),
      (SELECT raw_user_meta_data->>'countryCode' FROM auth.users WHERE id = profiles.id),
      'US'
    ),
    updated_at = now()
  WHERE EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = profiles.id 
    AND (
      raw_user_meta_data ? 'street_address' OR
      raw_user_meta_data ? 'streetAddress' OR
      raw_user_meta_data ? 'address' OR
      raw_user_meta_data ? 'city' OR
      raw_user_meta_data ? 'state' OR
      raw_user_meta_data ? 'province' OR
      raw_user_meta_data ? 'zip_code' OR
      raw_user_meta_data ? 'zipCode' OR
      raw_user_meta_data ? 'postal_code' OR
      raw_user_meta_data ? 'country' OR
      raw_user_meta_data ? 'countryCode'
    )
  );
END;
$function$;

-- Fix update_user_subscription
CREATE OR REPLACE FUNCTION public.update_user_subscription(user_id uuid, plan text, end_date timestamp with time zone)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  result JSONB;
BEGIN
  IF EXISTS (SELECT 1 FROM public.profiles WHERE id = user_id) THEN
    UPDATE public.profiles
    SET 
      subscription_plan = plan,
      subscription_status = 'active',
      subscription_end_date = end_date,
      updated_at = now()
    WHERE id = user_id;
  ELSE
    INSERT INTO public.profiles (
      id,
      subscription_plan,
      subscription_status, 
      subscription_end_date
    )
    VALUES (
      user_id,
      plan,
      'active',
      end_date
    );
  END IF;
  
  SELECT jsonb_build_object(
    'id', id,
    'subscription_plan', subscription_plan,
    'subscription_status', subscription_status,
    'subscription_end_date', subscription_end_date,
    'updated_at', updated_at
  ) INTO result
  FROM public.profiles
  WHERE id = user_id;
  
  RETURN result;
EXCEPTION
  WHEN others THEN
    RETURN jsonb_build_object(
      'error', SQLERRM,
      'detail', SQLSTATE
    );
END;
$function$;

-- Fix update_user_subscription_after_payment
CREATE OR REPLACE FUNCTION public.update_user_subscription_after_payment(user_id_param uuid, plan_type_param text, billing_period_param text, stripe_customer_id_param text, stripe_subscription_id_param text, amount_param integer, price_id_param text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  end_date_param TIMESTAMPTZ;
  result JSONB;
BEGIN
  IF billing_period_param = 'yearly' THEN
    end_date_param := now() + INTERVAL '1 year';
  ELSE
    end_date_param := now() + INTERVAL '1 month';
  END IF;

  UPDATE public.profiles
  SET 
    subscription_plan = plan_type_param,
    subscription_status = 'active',
    subscription_period = billing_period_param,
    subscription_start_date = now(),
    subscription_end_date = end_date_param,
    subscription_price_id = price_id_param,
    subscription_amount = amount_param,
    stripe_customer_id = stripe_customer_id_param,
    stripe_subscription_id = stripe_subscription_id_param,
    updated_at = now()
  WHERE id = user_id_param;

  RETURN jsonb_build_object(
    'success', true,
    'user_id', user_id_param,
    'plan_type', plan_type_param,
    'billing_period', billing_period_param,
    'end_date', end_date_param
  );

EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', SQLERRM
    );
END;
$function$;

-- Fix handle_plan_transition
CREATE OR REPLACE FUNCTION public.handle_plan_transition(user_id_param uuid, from_plan_param text, to_plan_param text, transition_type_param text, grandfathered_content_param integer DEFAULT 0)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  current_credits_used INTEGER := 0;
  new_credit_period_id UUID;
  result JSONB;
BEGIN
  IF from_plan_param IS NOT NULL THEN
    SELECT COALESCE(SUM(credits_used), 0) INTO current_credits_used
    FROM public.speech_credits
    WHERE user_id = user_id_param AND is_active = true;
    
    UPDATE public.speech_credits
    SET is_active = false, updated_at = now()
    WHERE user_id = user_id_param AND is_active = true;
  END IF;

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

  SELECT public.initialize_speech_credits(
    user_id_param,
    to_plan_param,
    now(),
    CASE 
      WHEN to_plan_param = 'free_trial' THEN now() + INTERVAL '7 days'
      ELSE NULL
    END
  ) INTO new_credit_period_id;

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
$function$;

-- Fix fix_speech_plan_period_ids
CREATE OR REPLACE FUNCTION public.fix_speech_plan_period_ids()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  fixed_count INTEGER := 0;
  speech_record RECORD;
  active_period_id UUID;
BEGIN
  FOR speech_record IN 
    SELECT s.id, s.user_id, s.created_at 
    FROM public.speeches s
    WHERE s.plan_period_id IS NULL AND s.deleted_at IS NULL
  LOOP
    SELECT sc.id INTO active_period_id
    FROM public.speech_credits sc
    WHERE sc.user_id = speech_record.user_id
      AND sc.is_active = true
      AND sc.period_start <= speech_record.created_at
      AND (sc.period_end IS NULL OR sc.period_end > speech_record.created_at)
    ORDER BY sc.created_at DESC
    LIMIT 1;
    
    IF active_period_id IS NULL THEN
      SELECT sc.id INTO active_period_id
      FROM public.speech_credits sc
      WHERE sc.user_id = speech_record.user_id
        AND sc.is_active = true
      ORDER BY sc.created_at DESC
      LIMIT 1;
    END IF;
    
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

-- Fix get_admin_profile_from_user_profile
CREATE OR REPLACE FUNCTION public.get_admin_profile_from_user_profile(admin_user_id_param uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
    admin_email TEXT;
    user_profile RECORD;
    result JSONB;
BEGIN
    SELECT email INTO admin_email
    FROM public.admin_users
    WHERE id = admin_user_id_param;
    
    IF admin_email IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Admin user not found');
    END IF;
    
    SELECT 
        p.first_name,
        p.last_name,
        p.phone,
        p.country_code,
        p.address_street_address,
        p.address_city,
        p.address_state,
        p.address_zip_code,
        p.address_country_code,
        p.avatar_url,
        u.email
    INTO user_profile
    FROM public.profiles p
    JOIN auth.users u ON p.id = u.id
    WHERE u.email = admin_email;
    
    IF user_profile IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'User profile not found');
    END IF;
    
    RETURN jsonb_build_object(
        'success', true,
        'data', jsonb_build_object(
            'first_name', user_profile.first_name,
            'last_name', user_profile.last_name,
            'email', user_profile.email,
            'phone', COALESCE(user_profile.phone, ''),
            'country_code', COALESCE(user_profile.country_code, 'US'),
            'street_address', COALESCE(user_profile.address_street_address, ''),
            'city', COALESCE(user_profile.address_city, ''),
            'state', COALESCE(user_profile.address_state, ''),
            'zip_code', COALESCE(user_profile.address_zip_code, ''),
            'country', COALESCE(user_profile.address_country_code, 'US'),
            'avatar_url', COALESCE(user_profile.avatar_url, '')
        )
    );
END;
$function$;

-- Fix toggle_user_admin_access
CREATE OR REPLACE FUNCTION public.toggle_user_admin_access(user_id_param uuid, enable_admin boolean)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
    user_email TEXT;
    user_password_hash TEXT;
    existing_admin_id UUID;
    profile_data RECORD;
    result JSONB;
BEGIN
    SELECT email INTO user_email
    FROM auth.users
    WHERE id = user_id_param;
    
    IF user_email IS NULL THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'User not found'
        );
    END IF;
    
    SELECT encrypted_password INTO user_password_hash
    FROM auth.users
    WHERE id = user_id_param;
    
    IF enable_admin THEN
        SELECT 
            first_name,
            last_name,
            phone,
            country_code,
            address_street_address,
            address_city,
            address_state,
            address_zip_code,
            address_country_code
        INTO profile_data
        FROM public.profiles
        WHERE id = user_id_param;
        
        UPDATE public.profiles
        SET 
            is_admin = true,
            updated_at = now()
        WHERE id = user_id_param;
        
        SELECT id INTO existing_admin_id
        FROM public.admin_users
        WHERE email = user_email;
        
        IF existing_admin_id IS NULL THEN
            INSERT INTO public.admin_users (
                email,
                username,
                hashed_password,
                is_active,
                is_super_admin
            )
            VALUES (
                user_email,
                user_email,
                user_password_hash,
                true,
                false
            )
            RETURNING id INTO existing_admin_id;
        ELSE
            UPDATE public.admin_users
            SET 
                is_active = true,
                hashed_password = user_password_hash,
                updated_at = now()
            WHERE id = existing_admin_id;
        END IF;
        
        IF user_email != 'speechhelpmaster@example.com' AND profile_data IS NOT NULL THEN
            INSERT INTO public.admin_settings (admin_user_id, setting_key, setting_value, setting_category)
            VALUES 
                (existing_admin_id, 'first_name', to_jsonb(profile_data.first_name), 'profile'),
                (existing_admin_id, 'last_name', to_jsonb(profile_data.last_name), 'profile'),
                (existing_admin_id, 'phone', to_jsonb(COALESCE(profile_data.phone, '')), 'profile'),
                (existing_admin_id, 'country_code', to_jsonb(COALESCE(profile_data.country_code, 'US')), 'profile'),
                (existing_admin_id, 'street_address', to_jsonb(COALESCE(profile_data.address_street_address, '')), 'profile'),
                (existing_admin_id, 'city', to_jsonb(COALESCE(profile_data.address_city, '')), 'profile'),
                (existing_admin_id, 'state', to_jsonb(COALESCE(profile_data.address_state, '')), 'profile'),
                (existing_admin_id, 'zip_code', to_jsonb(COALESCE(profile_data.address_zip_code, '')), 'profile'),
                (existing_admin_id, 'country', to_jsonb(COALESCE(profile_data.address_country_code, 'US')), 'profile')
            ON CONFLICT (admin_user_id, setting_key) 
            DO UPDATE SET
                setting_value = EXCLUDED.setting_value,
                updated_at = now();
        END IF;
        
        result := jsonb_build_object(
            'success', true,
            'message', 'Admin access enabled successfully',
            'admin_enabled', true
        );
    ELSE
        UPDATE public.profiles
        SET 
            is_admin = false,
            updated_at = now()
        WHERE id = user_id_param;
        
        UPDATE public.admin_users
        SET 
            is_active = false,
            updated_at = now()
        WHERE email = user_email;
        
        result := jsonb_build_object(
            'success', true,
            'message', 'Admin access disabled successfully',
            'admin_enabled', false
        );
    END IF;
    
    RETURN result;
    
EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', SQLERRM
        );
END;
$function$;