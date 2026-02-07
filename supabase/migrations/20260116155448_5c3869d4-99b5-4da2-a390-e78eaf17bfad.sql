-- =============================================
-- FIX 1: admin_users - Hide sensitive credentials
-- =============================================

-- Create a public view that excludes hashed_password
CREATE OR REPLACE VIEW public.admin_users_public
WITH (security_invoker=on) AS
  SELECT 
    id, 
    username, 
    email, 
    is_active, 
    is_super_admin, 
    last_login, 
    failed_login_attempts,
    allowed_ip_addresses,
    created_at, 
    updated_at
  FROM public.admin_users;
  -- Excludes: hashed_password

-- Drop existing policies and recreate with proper restrictions
DROP POLICY IF EXISTS "Active admin users can view all admin users" ON public.admin_users;
DROP POLICY IF EXISTS "Admin users can view their own record" ON public.admin_users;
DROP POLICY IF EXISTS "Super admins can manage admin users" ON public.admin_users;

-- Deny direct SELECT access to the base table (force use of view)
CREATE POLICY "No direct SELECT on admin_users"
ON public.admin_users
FOR SELECT
TO authenticated
USING (false);

-- Super admins can still manage (INSERT, UPDATE, DELETE) admin users
CREATE POLICY "Super admins can manage admin users"
ON public.admin_users
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users au 
    WHERE au.id = auth.uid() 
    AND au.is_super_admin = true 
    AND au.is_active = true
  )
);

-- =============================================
-- FIX 2: payment_methods - Restrict to authenticated only
-- =============================================

DROP POLICY IF EXISTS "Users can view their own payment methods" ON public.payment_methods;
DROP POLICY IF EXISTS "Users can insert their own payment methods" ON public.payment_methods;
DROP POLICY IF EXISTS "Users can update their own payment methods" ON public.payment_methods;
DROP POLICY IF EXISTS "Users can delete their own payment methods" ON public.payment_methods;

CREATE POLICY "Authenticated users can view own payment methods"
ON public.payment_methods
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can insert own payment methods"
ON public.payment_methods
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can update own payment methods"
ON public.payment_methods
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can delete own payment methods"
ON public.payment_methods
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- =============================================
-- FIX 3: profiles - Remove overly permissive system insert policy
-- =============================================

DROP POLICY IF EXISTS "System can insert profiles" ON public.profiles;