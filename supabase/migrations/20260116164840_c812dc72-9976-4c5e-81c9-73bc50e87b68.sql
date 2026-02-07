-- Fix overly permissive RLS policies on payment_history and plan_transitions

-- =============================================
-- FIX payment_history table
-- =============================================

-- Drop the overly permissive policies (service role bypasses RLS anyway)
DROP POLICY IF EXISTS "Service role can insert payment history" ON public.payment_history;
DROP POLICY IF EXISTS "Service role can update payment history" ON public.payment_history;

-- The SELECT policy "Users can view their own payment history" is already correct

-- =============================================
-- FIX plan_transitions table
-- =============================================

-- Drop the overly permissive ALL policy
DROP POLICY IF EXISTS "Service role can manage plan transitions" ON public.plan_transitions;

-- The SELECT policy "Users can view their own plan transitions" is already correct