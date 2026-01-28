-- First, create a helper function to check if user is an active admin
-- This avoids infinite recursion in RLS policies
CREATE OR REPLACE FUNCTION public.is_active_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE id = user_id AND is_active = true
  );
$$;

-- activity_logs: Only admins can view/insert activity logs
-- These are system logs, not user-accessible
CREATE POLICY "Admins can view activity logs"
ON public.activity_logs
FOR SELECT
TO authenticated
USING (public.is_active_admin(auth.uid()));

CREATE POLICY "Admins can insert activity logs"
ON public.activity_logs
FOR INSERT
TO authenticated
WITH CHECK (public.is_active_admin(auth.uid()));

-- admin_2fa: Only the admin can manage their own 2FA settings
CREATE POLICY "Admins can view their own 2FA settings"
ON public.admin_2fa
FOR SELECT
TO authenticated
USING (admin_user_id = auth.uid());

CREATE POLICY "Admins can insert their own 2FA settings"
ON public.admin_2fa
FOR INSERT
TO authenticated
WITH CHECK (admin_user_id = auth.uid());

CREATE POLICY "Admins can update their own 2FA settings"
ON public.admin_2fa
FOR UPDATE
TO authenticated
USING (admin_user_id = auth.uid());

CREATE POLICY "Admins can delete their own 2FA settings"
ON public.admin_2fa
FOR DELETE
TO authenticated
USING (admin_user_id = auth.uid());

-- admin_permissions: Read-only for active admins (managed by super admins via edge functions)
CREATE POLICY "Active admins can view permissions"
ON public.admin_permissions
FOR SELECT
TO authenticated
USING (public.is_active_admin(auth.uid()));

-- admin_roles: Read-only for active admins (managed by super admins via edge functions)
CREATE POLICY "Active admins can view roles"
ON public.admin_roles
FOR SELECT
TO authenticated
USING (public.is_active_admin(auth.uid()));

-- admin_role_permissions: Read-only for active admins (managed by super admins via edge functions)
CREATE POLICY "Active admins can view role permissions"
ON public.admin_role_permissions
FOR SELECT
TO authenticated
USING (public.is_active_admin(auth.uid()));

-- admin_user_roles: Admins can view their own roles, super admins manage via edge functions
CREATE POLICY "Admins can view their own user roles"
ON public.admin_user_roles
FOR SELECT
TO authenticated
USING (admin_user_id = auth.uid() OR public.is_active_admin(auth.uid()));

-- password_reset_otps: No direct access - managed entirely by edge functions
-- Deny all direct access, service role will handle operations
CREATE POLICY "No direct access to password reset OTPs"
ON public.password_reset_otps
FOR SELECT
TO authenticated
USING (false);

CREATE POLICY "No direct insert to password reset OTPs"
ON public.password_reset_otps
FOR INSERT
TO authenticated
WITH CHECK (false);

CREATE POLICY "No direct update to password reset OTPs"
ON public.password_reset_otps
FOR UPDATE
TO authenticated
USING (false);

CREATE POLICY "No direct delete to password reset OTPs"
ON public.password_reset_otps
FOR DELETE
TO authenticated
USING (false);