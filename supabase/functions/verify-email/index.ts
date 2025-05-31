
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.26.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  console.log('verify-email function called');
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();
    console.log('Verifying email:', email);
    
    if (!email) {
      throw new Error("Missing email");
    }

    // Create Supabase client with service role key
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    console.log('Checking if user exists...');

    // Check if user exists in auth.users
    const { data: userData, error: userError } = await supabaseClient.auth.admin.listUsers();
    
    if (userError) {
      console.error('Error fetching users:', userError);
      throw userError;
    }

    const user = userData.users.find(u => u.email === email);
    
    if (!user) {
      console.log('User not found with email:', email);
      return new Response(JSON.stringify({
        userExists: false
      }), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    console.log('User found, checking 2FA status...');

    // Check if user has 2FA enabled
    const { data: twoFactorData, error: fetchError } = await supabaseClient
      .from('user_2fa')
      .select('is_enabled')
      .eq('user_id', user.id)
      .eq('is_enabled', true)
      .maybeSingle();

    if (fetchError) {
      console.error('Error fetching 2FA data:', fetchError);
      // Don't throw error, just assume 2FA is disabled
    }

    const has2FA = twoFactorData?.is_enabled || false;
    
    console.log('Email verification result:', { userExists: true, has2FA, userId: user.id });

    return new Response(JSON.stringify({
      userExists: true,
      has2FA: has2FA,
      userId: user.id
    }), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error) {
    console.error("Error in verify-email function:", error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
