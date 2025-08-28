
-- Add address fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS street_address TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS state TEXT,
ADD COLUMN IF NOT EXISTS zip_code TEXT,
ADD COLUMN IF NOT EXISTS country TEXT;

-- Add a comment to document the purpose of these fields
COMMENT ON COLUMN public.profiles.street_address IS 'User street address for billing and contact purposes';
COMMENT ON COLUMN public.profiles.city IS 'User city for billing and contact purposes';
COMMENT ON COLUMN public.profiles.state IS 'User state/province for billing and contact purposes';
COMMENT ON COLUMN public.profiles.zip_code IS 'User ZIP/postal code for billing and contact purposes';
COMMENT ON COLUMN public.profiles.country IS 'User country for billing and contact purposes';
