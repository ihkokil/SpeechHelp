
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
    // Create a Supabase client with the Admin API key
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing environment variables for Supabase connection');
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Query auth.users (only possible with service_role key)
    const { data: users, error } = await supabase.auth.admin.listUsers();
    
    if (error) {
      throw error;
    }
    
    console.log(`Fetched ${users.users.length} users from auth.users`);
    
    // Fetch all profiles to join with users
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*');
      
    if (profilesError) {
      console.error('Error fetching profiles:', profilesError);
      // We'll continue but with empty profiles
    }
    
    console.log(`Fetched ${profiles?.length || 0} profiles`);
    
    // Create a map of profiles by id for faster lookup
    const profilesMap = new Map();
    if (profiles) {
      profiles.forEach(profile => {
        profilesMap.set(profile.id, profile);
      });
    }
    
    // Enhance users with their profile data
    const enhancedUsers = users.users.map(user => {
      // Find the corresponding profile or use default empty profile
      const profile = profilesMap.get(user.id) || {
        username: null,
        phone: null,
        is_active: true,
        subscription_plan: null,
        subscription_end_date: null
      };
      
      return {
        ...user,
        profile
      };
    });
    
    console.log(`Returning ${enhancedUsers.length} enhanced users`);
    
    // Return the enhanced users
    return new Response(
      JSON.stringify({ users: enhancedUsers }),
      { 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        } 
      }
    );
  } catch (error) {
    console.error('Error fetching users:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
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
