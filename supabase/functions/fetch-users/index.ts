
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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
    
    // Get all profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*');
    
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
      
      // Extract metadata safely
      const metadata = authUser.raw_user_meta_data || {};
      
      // Get first and last names with priority: profile table > metadata > empty
      const firstName = safeString(profile.first_name) || safeString(metadata.first_name);
      const lastName = safeString(profile.last_name) || safeString(metadata.last_name);
      
      // Construct full name from first and last name components
      const fullName = constructFullName(firstName, lastName);
      const displayName = fullName || authUser.email?.split('@')[0] || 'User';
      
      // Extract address information from metadata
      const streetAddress = safeString(metadata.street_address);
      const city = safeString(metadata.city);
      const state = safeString(metadata.state);
      const zipCode = safeString(metadata.zip_code);
      const country = safeString(metadata.country);
      const countryCode = safeString(metadata.country_code);
      
      return {
        ...authUser,
        // Direct fields from profiles table
        first_name: firstName,
        last_name: lastName,
        is_active: profile.is_active !== false,
        is_admin: profile.is_admin || false,
        admin_role: safeString(profile.admin_role) || null,
        permissions: profile.permissions || [],
        subscription_plan: safeString(profile.subscription_plan) || null,
        subscription_end_date: profile.subscription_end_date || null,
        stripe_customer_id: safeString(profile.stripe_customer_id) || null,
        stripe_subscription_id: safeString(profile.stripe_subscription_id) || null,
        // Enhanced user_metadata with proper fallbacks and address fields
        user_metadata: {
          first_name: firstName,
          last_name: lastName,
          full_name: fullName,
          name: fullName,
          email: safeString(authUser.email),
          phone: safeString(metadata.phone) || safeString(profile.phone),
          street_address: streetAddress,
          city: city,
          state: state,
          zip_code: zipCode,
          country: country,
          country_code: countryCode,
        },
        profile: {
          username: safeString(profile.username) || fullName || authUser.email?.split('@')[0] || '',
          phone: safeString(profile.phone) || safeString(metadata.phone),
          is_active: profile.is_active !== false,
          is_admin: profile.is_admin || false,
          admin_role: safeString(profile.admin_role) || null,
          permissions: profile.permissions || [],
          subscription_plan: safeString(profile.subscription_plan) || null,
          subscription_end_date: profile.subscription_end_date || null,
          stripe_customer_id: safeString(profile.stripe_customer_id) || null,
          stripe_subscription_id: safeString(profile.stripe_subscription_id) || null,
          created_at: profile.created_at,
          updated_at: profile.updated_at
        }
      };
    });
    
    console.log('Successfully combined users with profiles');
    
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
