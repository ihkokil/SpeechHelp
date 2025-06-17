
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.26.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  console.log('Admin speeches function called');
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, getAllSpeeches } = await req.json();
    
    // Create Supabase client with service role key to bypass RLS
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    if (getAllSpeeches) {
      console.log('Fetching all speeches for admin view');
      
      // Fetch all speeches with user information
      const { data: speeches, error: speechesError } = await supabaseAdmin
        .from('speeches')
        .select(`
          *,
          profiles:user_id (
            first_name,
            last_name,
            username
          )
        `)
        .order('created_at', { ascending: false });

      if (speechesError) {
        console.error('Error fetching all speeches:', speechesError);
        return new Response(JSON.stringify({
          success: false,
          error: speechesError.message
        }), {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      // Get user emails from auth.users for speeches where profile data might be missing
      const userIds = speeches?.map(speech => speech.user_id) || [];
      const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers();
      
      if (authError) {
        console.error('Error fetching auth users:', authError);
      }

      // Enhance speeches with user information
      const enhancedSpeeches = speeches?.map(speech => {
        const profile = speech.profiles;
        const authUser = authUsers?.users?.find(user => user.id === speech.user_id);
        
        return {
          ...speech,
          user_email: authUser?.email || 'Unknown',
          user_name: profile?.first_name && profile?.last_name 
            ? `${profile.first_name} ${profile.last_name}`
            : profile?.username || authUser?.email || 'Unknown User'
        };
      }) || [];

      console.log('Successfully fetched all speeches:', enhancedSpeeches.length);
      
      return new Response(JSON.stringify({
        success: true,
        speeches: enhancedSpeeches
      }), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    } else {
      // Original functionality for fetching speeches by user ID
      console.log('Fetching speeches for user ID:', userId);

      if (!userId) {
        console.error('No user ID provided');
        return new Response(JSON.stringify({
          success: false,
          error: 'User ID is required'
        }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      // Fetch speeches directly using admin client
      const { data: speeches, error } = await supabaseAdmin
        .from('speeches')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching speeches:', error);
        return new Response(JSON.stringify({
          success: false,
          error: error.message
        }), {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      console.log('Successfully fetched speeches:', speeches?.length || 0);
      
      return new Response(JSON.stringify({
        success: true,
        speeches: speeches || []
      }), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

  } catch (error) {
    console.error("Error in admin-speeches function:", error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Internal server error'
    }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
