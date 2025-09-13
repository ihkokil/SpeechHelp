
-- Add dedicated address columns to the profiles table
ALTER TABLE public.profiles 
ADD COLUMN address_street_address TEXT,
ADD COLUMN address_city TEXT,
ADD COLUMN address_state TEXT,
ADD COLUMN address_zip_code TEXT,
ADD COLUMN address_country_code TEXT DEFAULT 'US';

-- Create an index on address_country_code for better query performance
CREATE INDEX idx_profiles_address_country_code ON public.profiles(address_country_code);

-- Create a function to migrate existing address data from raw_user_meta_data to dedicated columns
CREATE OR REPLACE FUNCTION migrate_address_data_to_columns()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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
$$;

-- Execute the migration function
SELECT migrate_address_data_to_columns();

-- Update the handle_new_user trigger function to populate address columns
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
    subscription_end_date,
    -- New address columns
    address_street_address,
    address_city,
    address_state,
    address_zip_code,
    address_country_code
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
    ),
    -- Address data from metadata
    COALESCE(
      new.raw_user_meta_data ->> 'street_address',
      new.raw_user_meta_data ->> 'streetAddress',
      new.raw_user_meta_data ->> 'address'
    ),
    new.raw_user_meta_data ->> 'city',
    COALESCE(
      new.raw_user_meta_data ->> 'state',
      new.raw_user_meta_data ->> 'province'
    ),
    COALESCE(
      new.raw_user_meta_data ->> 'zip_code',
      new.raw_user_meta_data ->> 'zipCode',
      new.raw_user_meta_data ->> 'postal_code'
    ),
    COALESCE(
      new.raw_user_meta_data ->> 'country',
      new.raw_user_meta_data ->> 'countryCode',
      'US'
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
    address_street_address = EXCLUDED.address_street_address,
    address_city = EXCLUDED.address_city,
    address_state = EXCLUDED.address_state,
    address_zip_code = EXCLUDED.address_zip_code,
    address_country_code = EXCLUDED.address_country_code,
    updated_at = now();
  
  RETURN new;
EXCEPTION
  WHEN others THEN
    -- Log the error but don't block user creation
    RAISE WARNING 'Failed to create profile for user %: %', new.id, SQLERRM;
    RETURN new;
END;
$$;
