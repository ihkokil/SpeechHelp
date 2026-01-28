-- Fix speech_credits: Remove overly permissive service role policy
-- The service role already bypasses RLS by default, so we don't need an explicit policy
DROP POLICY IF EXISTS "Service role can manage speech credits" ON public.speech_credits;

-- Add INSERT policy for speech_credits (was missing)
CREATE POLICY "Users can insert their own speech credits"
ON public.speech_credits
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Fix payment_methods: Add proper RLS policies
-- Enable RLS if not already enabled
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;

-- Users can only view their own payment methods
CREATE POLICY "Users can view their own payment methods"
ON public.payment_methods
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Users can insert their own payment methods
CREATE POLICY "Users can insert their own payment methods"
ON public.payment_methods
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can update their own payment methods
CREATE POLICY "Users can update their own payment methods"
ON public.payment_methods
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Users can delete their own payment methods
CREATE POLICY "Users can delete their own payment methods"
ON public.payment_methods
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);