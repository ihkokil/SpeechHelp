import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, cache-control',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing environment variables');
    }
    
    // Use service role to fetch all users and profiles
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    
    console.log('Fetching users from auth and profiles...');
    
    // Get all users from auth.users
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('Error fetching auth users:', authError);
      throw new Error('Failed to fetch users from auth');
    }
    
    // Get all profiles with complete subscription data AND country_code
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select(`
        *,
        subscription_plan,
        subscription_period,
        subscription_amount,
        subscription_status,
        subscription_start_date,
        subscription_end_date,
        subscription_price_id,
        subscription_currency,
        stripe_customer_id,
        stripe_subscription_id,
        country_code
      `);
    
    if (profilesError) {
      console.error('Error fetching profiles:', profilesError);
      throw new Error('Failed to fetch user profiles');
    }
    
    console.log(`Found ${authUsers.users.length} auth users and ${profiles?.length || 0} profiles`);
    
    // Helper function to safely extract string values
    const safeString = (value: any): string => {
      if (typeof value === 'string') return value.trim();
      if (value === null || value === undefined) return '';
      return String(value).trim();
    };

    // Helper function to construct full name from first and last name
    const constructFullName = (firstName: string, lastName: string): string => {
      const first = safeString(firstName);
      const last = safeString(lastName);
      if (first && last) {
        return `${first} ${last}`;
      }
      if (first) return first;
      if (last) return last;
      return '';
    };
    
    // Create a map of profiles for quick lookup
    const profileMap = new Map();
    profiles?.forEach(profile => {
      profileMap.set(profile.id, profile);
    });
    
    // Combine auth users with their profiles
    const usersWithProfiles = authUsers.users.map(authUser => {
      // Get the profile data
      const profile = profileMap.get(authUser.id) || {};
      
      // PRESERVE the original raw_user_meta_data exactly as it is
      const originalRawMetadata = authUser.raw_user_meta_data || {};
      
      console.log(`📊 Processing user ${authUser.id}:`, {
        email: authUser.email,
        original_raw_metadata: originalRawMetadata,
        has_address_in_raw: !!(originalRawMetadata.street_address || originalRawMetadata.city || originalRawMetadata.state || originalRawMetadata.zip_code)
      });
      
      // Get first and last names with priority: profile table > metadata > empty
      const firstName = safeString(profile.first_name) || safeString(originalRawMetadata.first_name) || safeString(originalRawMetadata.firstName);
      const lastName = safeString(profile.last_name) || safeString(originalRawMetadata.last_name) || safeString(originalRawMetadata.lastName);
      
      // Construct full name from first and last name components
      const fullName = constructFullName(firstName, lastName);
      
      return {
        ...authUser,
        // Direct fields from profiles table
        first_name: firstName,
        last_name: lastName,
        is_active: profile.is_active !== false,
        is_admin: profile.is_admin || false,
        admin_role: safeString(profile.admin_role) || null,
        permissions: profile.permissions || [],
        // Complete subscription fields
        subscription_plan: safeString(profile.subscription_plan) || safeString(originalRawMetadata.subscription_plan) || null,
        subscription_period: safeString(profile.subscription_period) || null,
        subscription_amount: profile.subscription_amount || null,
        subscription_status: safeString(profile.subscription_status) || safeString(originalRawMetadata.subscription_status) || null,
        subscription_start_date: profile.subscription_start_date || originalRawMetadata.subscription_start_date || null,
        subscription_end_date: profile.subscription_end_date || originalRawMetadata.subscription_end_date || null,
        subscription_price_id: safeString(profile.subscription_price_id) || null,
        subscription_currency: safeString(profile.subscription_currency) || 'usd',
        stripe_customer_id: safeString(profile.stripe_customer_id) || null,
        stripe_subscription_id: safeString(profile.stripe_subscription_id) || null,
        // Include phone and country_code from profiles table
        phone: safeString(profile.phone) || safeString(originalRawMetadata.phone),
        country_code: safeString(profile.country_code) || safeString(originalRawMetadata.country_code) || safeString(originalRawMetadata.countryCode) || 'US',
        // Enhanced user_metadata with proper fallbacks
        user_metadata: {
          first_name: firstName,
          last_name: lastName,
          full_name: fullName,
          name: fullName,
          email: safeString(authUser.email),
          phone: safeString(originalRawMetadata.phone) || safeString(profile.phone),
          country_code: safeString(originalRawMetadata.country_code) || safeString(originalRawMetadata.countryCode) || safeString(profile.country_code) || 'US',
          // Address fields from original metadata
          street_address: safeString(originalRawMetadata.street_address),
          streetAddress: safeString(originalRawMetadata.street_address), // Also provide camelCase version
          city: safeString(originalRawMetadata.city),
          state: safeString(originalRawMetadata.state),
          zip_code: safeString(originalRawMetadata.zip_code),
          zipCode: safeString(originalRawMetadata.zip_code), // Also provide camelCase version
          country: safeString(originalRawMetadata.country),
        },
        // CRITICAL: Keep the original raw_user_meta_data exactly as stored in the database
        raw_user_meta_data: originalRawMetadata,
        profile: {
          username: safeString(profile.username) || fullName || authUser.email?.split('@')[0] || '',
          phone: safeString(profile.phone) || safeString(originalRawMetadata.phone),
          country_code: safeString(profile.country_code) || safeString(originalRawMetadata.country_code) || safeString(originalRawMetadata.countryCode) || 'US',
          is_active: profile.is_active !== false,
          is_admin: profile.is_admin || false,
          admin_role: safeString(profile.admin_role) || null,
          permissions: profile.permissions || [],
          // Complete subscription data in profile object
          subscription_plan: safeString(profile.subscription_plan) || safeString(originalRawMetadata.subscription_plan) || null,
          subscription_period: safeString(profile.subscription_period) || null,
          subscription_amount: profile.subscription_amount || null,
          subscription_status: safeString(profile.subscription_status) || safeString(originalRawMetadata.subscription_status) || null,
          subscription_start_date: profile.subscription_start_date || originalRawMetadata.subscription_start_date || null,
          subscription_end_date: profile.subscription_end_date || originalRawMetadata.subscription_end_date || null,
          subscription_price_id: safeString(profile.subscription_price_id) || null,
          subscription_currency: safeString(profile.subscription_currency) || 'usd',
          stripe_customer_id: safeString(profile.stripe_customer_id) || null,
          stripe_subscription_id: safeString(profile.stripe_subscription_id) || null,
          created_at: profile.created_at,
          updated_at: profile.updated_at
        }
      };
    });
    
    console.log('Successfully combined users with profiles');
    console.log('📈 Address data summary:', {
      totalUsers: usersWithProfiles.length,
      usersWithAddressData: usersWithProfiles.filter(user => 
        user.raw_user_meta_data && (
          user.raw_user_meta_data.street_address || 
          user.raw_user_meta_data.city ||
          user.raw_user_meta_data.state ||
          user.raw_user_meta_data.zip_code
        )
      ).length
    });
    
    return new Response(
      JSON.stringify({ users: usersWithProfiles }),
      { 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        } 
      }
    );
  } catch (error: any) {
    console.error('Error in fetch-users function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to fetch users'
      }),
      { 
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        } 
      }
    );
  }
});
