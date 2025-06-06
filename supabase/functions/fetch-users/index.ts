
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
      console.error('Missing environment variables');
      throw new Error('Missing environment variables');
    }
    
    // Use service role to fetch all users and profiles
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    
    console.log('Starting fresh user data fetch...');
    
    // Get all users from auth.users with pagination to handle large datasets
    let allAuthUsers: any[] = [];
    let page = 1;
    const perPage = 1000;
    
    while (true) {
      console.log(`Fetching auth users page ${page}...`);
      const { data: authUsersPage, error: authError } = await supabase.auth.admin.listUsers({
        page,
        perPage
      });
      
      if (authError) {
        console.error('Error fetching auth users page:', page, authError);
        throw new Error(`Failed to fetch auth users: ${authError.message}`);
      }
      
      if (!authUsersPage.users || authUsersPage.users.length === 0) {
        break;
      }
      
      allAuthUsers = allAuthUsers.concat(authUsersPage.users);
      page++;
      
      // Safety break to prevent infinite loops
      if (page > 100) {
        console.warn('Hit safety limit for user pagination');
        break;
      }
    }
    
    console.log(`Fetched ${allAuthUsers.length} auth users total`);
    
    // Get all profiles with complete data
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*');
    
    if (profilesError) {
      console.error('Error fetching profiles:', profilesError);
      throw new Error(`Failed to fetch user profiles: ${profilesError.message}`);
    }
    
    console.log(`Found ${profiles?.length || 0} profiles`);
    
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
    
    // Combine auth users with their profiles - prioritizing profile data
    const usersWithProfiles = allAuthUsers.map(authUser => {
      // Get the profile data
      const profile = profileMap.get(authUser.id) || {};
      
      // Extract metadata safely as fallback
      const metadata = authUser.raw_user_meta_data || {};
      
      // PRIORITIZE PROFILE DATA over auth metadata
      const firstName = safeString(profile.first_name) || safeString(metadata.first_name);
      const lastName = safeString(profile.last_name) || safeString(metadata.last_name);
      const phone = safeString(profile.phone) || safeString(metadata.phone);
      const countryCode = safeString(profile.country_code) || safeString(metadata.country_code) || 'US';
      
      // Construct full name from first and last name components
      const fullName = constructFullName(firstName, lastName);
      const displayName = fullName || authUser.email?.split('@')[0] || 'User';
      
      return {
        ...authUser,
        // Direct fields from profiles table (PRIORITIZED)
        first_name: firstName,
        last_name: lastName,
        phone: phone,
        country_code: countryCode,
        is_active: profile.is_active !== false,
        is_admin: profile.is_admin || false,
        admin_role: safeString(profile.admin_role) || null,
        permissions: profile.permissions || [],
        // Complete subscription fields
        subscription_plan: safeString(profile.subscription_plan) || null,
        subscription_period: safeString(profile.subscription_period) || null,
        subscription_amount: profile.subscription_amount || null,
        subscription_status: safeString(profile.subscription_status) || null,
        subscription_start_date: profile.subscription_start_date || null,
        subscription_end_date: profile.subscription_end_date || null,
        subscription_price_id: safeString(profile.subscription_price_id) || null,
        subscription_currency: safeString(profile.subscription_currency) || 'usd',
        stripe_customer_id: safeString(profile.stripe_customer_id) || null,
        stripe_subscription_id: safeString(profile.stripe_subscription_id) || null,
        // Enhanced user_metadata with proper fallbacks
        user_metadata: {
          first_name: firstName,
          last_name: lastName,
          full_name: fullName,
          name: fullName,
          email: safeString(authUser.email),
          phone: phone,
          country_code: countryCode,
        },
        profile: {
          username: safeString(profile.username) || fullName || authUser.email?.split('@')[0] || '',
          phone: phone,
          country_code: countryCode,
          is_active: profile.is_active !== false,
          is_admin: profile.is_admin || false,
          admin_role: safeString(profile.admin_role) || null,
          permissions: profile.permissions || [],
          // Complete subscription data in profile object
          subscription_plan: safeString(profile.subscription_plan) || null,
          subscription_period: safeString(profile.subscription_period) || null,
          subscription_amount: profile.subscription_amount || null,
          subscription_status: safeString(profile.subscription_status) || null,
          subscription_start_date: profile.subscription_start_date || null,
          subscription_end_date: profile.subscription_end_date || null,
          subscription_price_id: safeString(profile.subscription_price_id) || null,
          subscription_currency: safeString(profile.subscription_currency) || 'usd',
          stripe_customer_id: safeString(profile.stripe_customer_id) || null,
          stripe_subscription_id: safeString(profile.stripe_subscription_id) || null,
          created_at: profile.created_at,
          updated_at: profile.updated_at
        }
      };
    });
    
    console.log(`Successfully processed ${usersWithProfiles.length} users with profile data`);
    
    return new Response(
      JSON.stringify({ 
        users: usersWithProfiles,
        total: usersWithProfiles.length,
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
          ...corsHeaders
        } 
      }
    );
  } catch (error: any) {
    console.error('Error in fetch-users function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to fetch users',
        details: error.toString(),
        timestamp: new Date().toISOString()
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
