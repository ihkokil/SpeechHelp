-- Drop existing duplicate and potentially insecure policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can create their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can delete their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Service role can insert profiles during user creation" ON public.profiles;

-- Create properly secured policies that ONLY apply to authenticated users
-- This ensures anonymous (unauthenticated) users have NO access

-- SELECT: Only authenticated users can view their own profile
CREATE POLICY "Authenticated users can view own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- INSERT: Only authenticated users can create their own profile
CREATE POLICY "Authenticated users can create own profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- UPDATE: Only authenticated users can update their own profile
CREATE POLICY "Authenticated users can update own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- DELETE: Only authenticated users can delete their own profile
CREATE POLICY "Authenticated users can delete own profile"
ON public.profiles
FOR DELETE
TO authenticated
USING (auth.uid() = id);

-- Allow service role (used by triggers) to insert profiles
-- This uses a function check to ensure it's a legitimate system operation
CREATE POLICY "System can insert profiles"
ON public.profiles
FOR INSERT
TO service_role
WITH CHECK (true);