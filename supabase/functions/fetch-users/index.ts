
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

    // Enhanced address field mapping - handle both camelCase and snake_case
    const extractAddressData = (metadata: any) => {
      console.log('🏠 Extracting address data from metadata:', metadata);
      
      const addressData = {
        // Street address - check multiple possible field names
        streetAddress: safeString(metadata.streetAddress) || 
                      safeString(metadata.street_address) || 
                      safeString(metadata.address) || '',
        
        // City
        city: safeString(metadata.city) || '',
        
        // State/Province - check multiple possible field names
        state: safeString(metadata.state) || 
               safeString(metadata.province) || 
               safeString(metadata.stateProvince) || '',
        
        // ZIP/Postal Code - check multiple possible field names
        zipCode: safeString(metadata.zipCode) || 
                 safeString(metadata.zip_code) || 
                 safeString(metadata.postal_code) || 
                 safeString(metadata.postalCode) || '',
        
        // Country - check multiple possible field names
        country: safeString(metadata.country) || 
                 safeString(metadata.country_code) || 
                 safeString(metadata.countryCode) || ''
      };

      console.log('🏠 Extracted address data:', addressData);
      return addressData;
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
      
      // Extract metadata safely - PRESERVE ALL ADDRESS FIELDS
      const metadata = authUser.raw_user_meta_data || {};
      
      // Enhanced address extraction
      const addressData = extractAddressData(metadata);
      
      // Get first and last names with priority: profile table > metadata > empty
      const firstName = safeString(profile.first_name) || safeString(metadata.first_name) || safeString(metadata.firstName);
      const lastName = safeString(profile.last_name) || safeString(metadata.last_name) || safeString(metadata.lastName);
      
      // Construct full name from first and last name components
      const fullName = constructFullName(firstName, lastName);
      const displayName = fullName || authUser.email?.split('@')[0] || 'User';
      
      // Debug logging for each user
      console.log(`📊 Processing user ${authUser.id}:`, {
        email: authUser.email,
        metadata: metadata,
        addressData: addressData,
        hasAddressData: Object.values(addressData).some(val => val !== '')
      });
      
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
        // Include phone and country_code from profiles table
        phone: safeString(profile.phone) || safeString(metadata.phone),
        country_code: safeString(profile.country_code) || safeString(metadata.country_code) || safeString(metadata.countryCode) || 'US',
        // Enhanced user_metadata with proper fallbacks AND comprehensive address mapping
        user_metadata: {
          first_name: firstName,
          last_name: lastName,
          full_name: fullName,
          name: fullName,
          email: safeString(authUser.email),
          phone: safeString(metadata.phone) || safeString(profile.phone),
          country_code: safeString(metadata.country_code) || safeString(metadata.countryCode) || safeString(profile.country_code) || 'US',
          // COMPREHENSIVE ADDRESS MAPPING - support both naming conventions
          street_address: addressData.streetAddress,
          streetAddress: addressData.streetAddress,
          address: addressData.streetAddress,
          city: addressData.city,
          state: addressData.state,
          province: addressData.state,
          stateProvince: addressData.state,
          zip_code: addressData.zipCode,
          zipCode: addressData.zipCode,
          postal_code: addressData.zipCode,
          postalCode: addressData.zipCode,
          country: addressData.country,
          countryCode: addressData.country,
        },
        // ENSURE raw_user_meta_data is preserved with ALL original fields PLUS normalized versions
        raw_user_meta_data: {
          ...metadata,
          // Ensure these specific fields are always present in both formats
          first_name: firstName,
          firstName: firstName,
          last_name: lastName,
          lastName: lastName,
          phone: safeString(metadata.phone),
          country_code: safeString(metadata.country_code) || safeString(metadata.countryCode),
          countryCode: safeString(metadata.countryCode) || safeString(metadata.country_code),
          // ADDRESS FIELDS - ensure both camelCase and snake_case versions exist
          street_address: addressData.streetAddress,
          streetAddress: addressData.streetAddress,
          address: addressData.streetAddress,
          city: addressData.city,
          state: addressData.state,
          province: addressData.state,
          stateProvince: addressData.state,
          zip_code: addressData.zipCode,
          zipCode: addressData.zipCode,
          postal_code: addressData.zipCode,
          postalCode: addressData.zipCode,
          country: addressData.country,
          countryCode: addressData.country,
        },
        profile: {
          username: safeString(profile.username) || fullName || authUser.email?.split('@')[0] || '',
          phone: safeString(profile.phone) || safeString(metadata.phone),
          country_code: safeString(profile.country_code) || safeString(metadata.country_code) || safeString(metadata.countryCode) || 'US',
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
    
    console.log('Successfully combined users with profiles');
    console.log('📈 Address data summary:', {
      totalUsers: usersWithProfiles.length,
      usersWithAddressData: usersWithProfiles.filter(user => 
        user.raw_user_meta_data && (
          user.raw_user_meta_data.street_address || 
          user.raw_user_meta_data.streetAddress ||
          user.raw_user_meta_data.city ||
          user.raw_user_meta_data.state ||
          user.raw_user_meta_data.zip_code ||
          user.raw_user_meta_data.zipCode
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
