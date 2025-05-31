
CREATE OR REPLACE FUNCTION public.update_user_subscription_after_payment(
  user_id_param uuid, 
  plan_type_param text, 
  billing_period_param text, 
  stripe_customer_id_param text, 
  stripe_subscription_id_param text, 
  amount_param integer, 
  price_id_param text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  end_date_param TIMESTAMPTZ;
  result JSONB;
BEGIN
  -- Calculate subscription end date based on billing period
  IF billing_period_param = 'yearly' THEN
    end_date_param := now() + INTERVAL '1 year';
  ELSE
    end_date_param := now() + INTERVAL '1 month';
  END IF;

  -- Update the profiles table with subscription information
  UPDATE public.profiles
  SET 
    subscription_plan = plan_type_param,
    subscription_status = 'active', -- FIXED: Always set to active for successful payment
    subscription_period = billing_period_param,
    subscription_start_date = now(),
    subscription_end_date = end_date_param,
    subscription_price_id = price_id_param,
    subscription_amount = amount_param,
    stripe_customer_id = stripe_customer_id_param,
    stripe_subscription_id = stripe_subscription_id_param,
    updated_at = now()
  WHERE id = user_id_param;

  -- Return success response
  RETURN jsonb_build_object(
    'success', true,
    'user_id', user_id_param,
    'plan_type', plan_type_param,
    'billing_period', billing_period_param,
    'subscription_status', 'active',
    'end_date', end_date_param
  );

EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', SQLERRM
    );
END;
$$;
