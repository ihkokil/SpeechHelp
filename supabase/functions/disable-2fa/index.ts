
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.26.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper function to decode JWT and get user ID
function getUserIdFromToken(authHeader: string): string | null {
  try {
    const token = authHeader.replace('Bearer ', '');
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.sub || null;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}

serve(async (req) => {
  console.log('disable-2fa function called');
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      console.error('No authorization header found');
      throw new Error("No authorization header");
    }

    // Extract user ID from JWT token
    const userId = getUserIdFromToken(authHeader);
    if (!userId) {
      console.error('Could not extract user ID from token');
      throw new Error("Invalid token");
    }

    console.log('User ID extracted from token:', userId);

    // Create Supabase client with service role key
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    console.log('Supabase client created, disabling 2FA...');

    // Delete 2FA settings for the user
    const { error: deleteError } = await supabaseClient
      .from('user_2fa')
      .delete()
      .eq('user_id', userId);

    if (deleteError) {
      console.error('Error disabling 2FA:', deleteError);
      throw deleteError;
    }

    console.log('2FA disabled successfully');

    return new Response(JSON.stringify({
      success: true
    }), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error) {
    console.error("Error in disable-2fa function:", error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
