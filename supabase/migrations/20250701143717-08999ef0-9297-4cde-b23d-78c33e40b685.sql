
-- Update the handle_new_user trigger function to properly handle subscription metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    first_name, 
    last_name, 
    username, 
    phone,
    country_code,
    is_active,
    subscription_plan,
    subscription_status,
    subscription_start_date,
    subscription_end_date
  )
  VALUES (
    new.id, 
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'last_name',
    COALESCE(
      new.raw_user_meta_data ->> 'full_name',
      (new.raw_user_meta_data ->> 'first_name') || ' ' || (new.raw_user_meta_data ->> 'last_name'),
      new.raw_user_meta_data ->> 'name',
      SPLIT_PART(new.email, '@', 1)
    ),
    new.raw_user_meta_data ->> 'phone',
    COALESCE(new.raw_user_meta_data ->> 'country_code', 'US'),
    COALESCE((new.raw_user_meta_data ->> 'is_active')::boolean, true),
    COALESCE(new.raw_user_meta_data ->> 'subscription_plan', 'free_trial'),
    COALESCE(new.raw_user_meta_data ->> 'subscription_status', 'active'),
    COALESCE(
      (new.raw_user_meta_data ->> 'subscription_start_date')::timestamp,
      now()
    ),
    COALESCE(
      (new.raw_user_meta_data ->> 'subscription_end_date')::timestamp,
      now() + interval '7 days'
    )
  )
  ON CONFLICT (id) DO UPDATE SET
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    username = EXCLUDED.username,
    phone = EXCLUDED.phone,
    country_code = EXCLUDED.country_code,
    is_active = EXCLUDED.is_active,
    subscription_plan = EXCLUDED.subscription_plan,
    subscription_status = EXCLUDED.subscription_status,
    subscription_start_date = EXCLUDED.subscription_start_date,
    subscription_end_date = EXCLUDED.subscription_end_date,
    updated_at = now();
  
  RETURN new;
EXCEPTION
  WHEN others THEN
    -- Log the error but don't block user creation
    RAISE WARNING 'Failed to create profile for user %: %', new.id, SQLERRM;
    RETURN new;
END;
$$;

-- Update default values in the profiles table to ensure active free trial
ALTER TABLE public.profiles 
ALTER COLUMN subscription_plan SET DEFAULT 'free_trial',
ALTER COLUMN subscription_status SET DEFAULT 'active';
