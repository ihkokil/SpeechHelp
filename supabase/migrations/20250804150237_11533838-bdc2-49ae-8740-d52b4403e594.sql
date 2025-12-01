-- Update the toggle_user_admin_access function to sync profile data when creating an admin
CREATE OR REPLACE FUNCTION public.toggle_user_admin_access(user_id_param uuid, enable_admin boolean)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
    user_email TEXT;
    user_password_hash TEXT;
    existing_admin_id UUID;
    profile_data RECORD;
    result JSONB;
BEGIN
    -- Get user's email from auth.users
    SELECT email INTO user_email
    FROM auth.users
    WHERE id = user_id_param;
    
    IF user_email IS NULL THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'User not found'
        );
    END IF;
    
    -- Get user's existing password hash from auth.users
    SELECT encrypted_password INTO user_password_hash
    FROM auth.users
    WHERE id = user_id_param;
    
    IF enable_admin THEN
        -- Get profile data for syncing to admin settings
        SELECT 
            first_name,
            last_name,
            phone,
            country_code,
            address_street_address,
            address_city,
            address_state,
            address_zip_code,
            address_country_code
        INTO profile_data
        FROM public.profiles
        WHERE id = user_id_param;
        
        -- Update profiles table to set admin status
        UPDATE public.profiles
        SET 
            is_admin = true,
            updated_at = now()
        WHERE id = user_id_param;
        
        -- Check if admin user already exists
        SELECT id INTO existing_admin_id
        FROM public.admin_users
        WHERE email = user_email;
        
        IF existing_admin_id IS NULL THEN
            -- Create new admin user with the same password hash
            INSERT INTO public.admin_users (
                email,
                username,
                hashed_password,
                is_active,
                is_super_admin
            )
            VALUES (
                user_email,
                user_email,
                user_password_hash,
                true,
                false
            )
            RETURNING id INTO existing_admin_id;
        ELSE
            -- Reactivate existing admin user
            UPDATE public.admin_users
            SET 
                is_active = true,
                hashed_password = user_password_hash,
                updated_at = now()
            WHERE id = existing_admin_id;
        END IF;
        
        -- Sync profile data to admin settings (only for non-speechhelpmaster users)
        IF user_email != 'speechhelpmaster@example.com' AND profile_data IS NOT NULL THEN
            -- Insert admin settings with profile data
            INSERT INTO public.admin_settings (admin_user_id, setting_key, setting_value, setting_category)
            VALUES 
                (existing_admin_id, 'first_name', to_jsonb(profile_data.first_name), 'profile'),
                (existing_admin_id, 'last_name', to_jsonb(profile_data.last_name), 'profile'),
                (existing_admin_id, 'phone', to_jsonb(COALESCE(profile_data.phone, '')), 'profile'),
                (existing_admin_id, 'country_code', to_jsonb(COALESCE(profile_data.country_code, 'US')), 'profile'),
                (existing_admin_id, 'street_address', to_jsonb(COALESCE(profile_data.address_street_address, '')), 'profile'),
                (existing_admin_id, 'city', to_jsonb(COALESCE(profile_data.address_city, '')), 'profile'),
                (existing_admin_id, 'state', to_jsonb(COALESCE(profile_data.address_state, '')), 'profile'),
                (existing_admin_id, 'zip_code', to_jsonb(COALESCE(profile_data.address_zip_code, '')), 'profile'),
                (existing_admin_id, 'country', to_jsonb(COALESCE(profile_data.address_country_code, 'US')), 'profile')
            ON CONFLICT (admin_user_id, setting_key) 
            DO UPDATE SET
                setting_value = EXCLUDED.setting_value,
                updated_at = now();
        END IF;
        
        result := jsonb_build_object(
            'success', true,
            'message', 'Admin access enabled successfully',
            'admin_enabled', true
        );
    ELSE
        -- Update profiles table to remove admin status
        UPDATE public.profiles
        SET 
            is_admin = false,
            updated_at = now()
        WHERE id = user_id_param;
        
        -- Deactivate admin user
        UPDATE public.admin_users
        SET 
            is_active = false,
            updated_at = now()
        WHERE email = user_email;
        
        result := jsonb_build_object(
            'success', true,
            'message', 'Admin access disabled successfully',
            'admin_enabled', false
        );
    END IF;
    
    RETURN result;
    
EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', SQLERRM
        );
END;
$function$;

-- Create a function to get user profile data for admin settings
CREATE OR REPLACE FUNCTION public.get_admin_profile_from_user_profile(admin_user_id_param uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
    admin_email TEXT;
    user_profile RECORD;
    result JSONB;
BEGIN
    -- Get admin user email
    SELECT email INTO admin_email
    FROM public.admin_users
    WHERE id = admin_user_id_param;
    
    IF admin_email IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Admin user not found');
    END IF;
    
    -- Get corresponding user profile by email
    SELECT 
        p.first_name,
        p.last_name,
        p.phone,
        p.country_code,
        p.address_street_address,
        p.address_city,
        p.address_state,
        p.address_zip_code,
        p.address_country_code,
        p.avatar_url,
        u.email
    INTO user_profile
    FROM public.profiles p
    JOIN auth.users u ON p.id = u.id
    WHERE u.email = admin_email;
    
    IF user_profile IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'User profile not found');
    END IF;
    
    -- Return profile data
    RETURN jsonb_build_object(
        'success', true,
        'data', jsonb_build_object(
            'first_name', user_profile.first_name,
            'last_name', user_profile.last_name,
            'email', user_profile.email,
            'phone', COALESCE(user_profile.phone, ''),
            'country_code', COALESCE(user_profile.country_code, 'US'),
            'street_address', COALESCE(user_profile.address_street_address, ''),
            'city', COALESCE(user_profile.address_city, ''),
            'state', COALESCE(user_profile.address_state, ''),
            'zip_code', COALESCE(user_profile.address_zip_code, ''),
            'country', COALESCE(user_profile.address_country_code, 'US'),
            'avatar_url', COALESCE(user_profile.avatar_url, '')
        )
    );
END;
$function$;