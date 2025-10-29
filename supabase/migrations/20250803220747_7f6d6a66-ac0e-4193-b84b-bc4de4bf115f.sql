-- Fix update_user_subscription function to set subscription_status to active
-- This ensures that when admins update user subscriptions, the status is properly activated

CREATE OR REPLACE FUNCTION public.update_user_subscription(user_id uuid, plan text, end_date timestamp with time zone)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  result JSONB;
BEGIN
  -- Check if profile exists
  IF EXISTS (SELECT 1 FROM public.profiles WHERE id = user_id) THEN
    -- Update existing profile with subscription_status set to active
    UPDATE public.profiles
    SET 
      subscription_plan = plan,
      subscription_status = 'active',
      subscription_end_date = end_date,
      updated_at = now()
    WHERE id = user_id;
  ELSE
    -- Insert new profile with subscription_status set to active
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
  
  -- Return the updated data
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
$function$