-- Fix admin_settings table constraints for proper upsert operations
-- Add unique constraint if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'admin_settings_admin_user_id_setting_key_key' 
    AND table_name = 'admin_settings'
  ) THEN
    ALTER TABLE public.admin_settings 
    ADD CONSTRAINT admin_settings_admin_user_id_setting_key_key 
    UNIQUE (admin_user_id, setting_key);
  END IF;
END $$;

-- Fix RLS policies for admin_activity_logs to prevent violations
DROP POLICY IF EXISTS "Admin activity logs policy" ON public.admin_activity_logs;

CREATE POLICY "Admin users can insert activity logs"
ON public.admin_activity_logs
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE id = auth.uid() AND is_active = true
  )
);

CREATE POLICY "Admin users can view activity logs"
ON public.admin_activity_logs
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE id = auth.uid() AND is_active = true
  )
);

-- Ensure admin_settings has proper RLS policies
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin users can manage their settings" ON public.admin_settings;

CREATE POLICY "Admin users can manage their settings"
ON public.admin_settings
FOR ALL
TO authenticated
USING (
  admin_user_id = auth.uid() AND
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE id = auth.uid() AND is_active = true
  )
)
WITH CHECK (
  admin_user_id = auth.uid() AND
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE id = auth.uid() AND is_active = true
  )
);