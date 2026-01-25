-- Add RLS policies to admin_users table to protect sensitive data
-- The table already has RLS enabled with a policy for super admins to manage admin users
-- We need to add SELECT policies for admin users to view their own data and for authentication

-- Allow admin users to view their own record
CREATE POLICY "Admin users can view their own record"
ON public.admin_users
FOR SELECT
USING (id = auth.uid());

-- Allow active admin users to view all admin users (needed for admin panel)
CREATE POLICY "Active admin users can view all admin users"
ON public.admin_users
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users au
    WHERE au.id = auth.uid() AND au.is_active = true
  )
);