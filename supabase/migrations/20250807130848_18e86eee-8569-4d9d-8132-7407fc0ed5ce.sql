-- Initialize speech credits for all existing users who don't have current periods
DO $$
DECLARE
    user_record RECORD;
    profile_record RECORD;
BEGIN
    -- Loop through all users and initialize credits if they don't have a current period
    FOR user_record IN 
        SELECT DISTINCT id as user_id FROM auth.users
    LOOP
        -- Get user's current plan from profiles
        SELECT subscription_plan, subscription_status 
        INTO profile_record
        FROM public.profiles 
        WHERE id = user_record.user_id;
        
        -- Check if user has a current credit period
        IF NOT EXISTS (
            SELECT 1 FROM public.speech_credits 
            WHERE user_id = user_record.user_id 
            AND is_active = true
            AND (period_end IS NULL OR period_end > now())
        ) THEN
            -- Initialize credits for this user with their current plan
            PERFORM public.initialize_speech_credits(
                user_record.user_id, 
                COALESCE(profile_record.subscription_plan, 'free_trial')
            );
            RAISE NOTICE 'Initialized credits for user: % with plan: %', 
                user_record.user_id, 
                COALESCE(profile_record.subscription_plan, 'free_trial');
        END IF;
    END LOOP;
END $$;