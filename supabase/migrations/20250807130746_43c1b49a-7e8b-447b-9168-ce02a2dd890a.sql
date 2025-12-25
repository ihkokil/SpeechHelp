-- Initialize speech credits for all existing users who don't have current periods
DO $$
DECLARE
    user_record RECORD;
BEGIN
    -- Loop through all users and initialize credits if they don't have a current period
    FOR user_record IN 
        SELECT DISTINCT id as user_id FROM auth.users
    LOOP
        -- Check if user has a current credit period
        IF NOT EXISTS (
            SELECT 1 FROM public.speech_credit_periods 
            WHERE user_id = user_record.user_id 
            AND period_start <= CURRENT_DATE 
            AND period_end >= CURRENT_DATE
        ) THEN
            -- Initialize credits for this user
            PERFORM public.initialize_speech_credits(user_record.user_id);
            RAISE NOTICE 'Initialized credits for user: %', user_record.user_id;
        END IF;
    END LOOP;
END $$;