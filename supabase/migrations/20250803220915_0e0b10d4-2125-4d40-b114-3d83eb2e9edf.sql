-- Fix existing users who have premium plans but inactive subscription status
-- This addresses the immediate issue where admins already updated plans but status wasn't set

UPDATE public.profiles 
SET subscription_status = 'active', updated_at = now()
WHERE (subscription_plan = 'pro' OR subscription_plan = 'premium' OR subscription_plan = 'business')
  AND (subscription_status IS NULL OR subscription_status != 'active');

-- Also ensure free trial users have proper status
UPDATE public.profiles 
SET subscription_status = 'active', updated_at = now()
WHERE subscription_plan = 'free_trial'
  AND (subscription_status IS NULL OR subscription_status = 'inactive');