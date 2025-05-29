
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.26.0";
import * as speakeasy from "https://esm.sh/speakeasy@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { code } = await req.json();
    
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: req.headers.get("Authorization")! } } }
    );

    // Get current user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      throw new Error("Unauthorized");
    }

    // Get the secret from database
    const { data: twoFactorData, error: fetchError } = await supabaseClient
      .from('user_2fa')
      .select('secret_key')
      .eq('user_id', user.id)
      .single();

    if (fetchError || !twoFactorData) {
      throw new Error("2FA setup not found");
    }

    // Verify the code
    const verified = speakeasy.totp.verify({
      secret: twoFactorData.secret_key,
      encoding: 'base32',
      token: code,
      window: 1,
    });

    if (!verified) {
      return new Response(JSON.stringify({
        success: false,
        error: "Invalid verification code"
      }), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Generate backup codes
    const { data: backupCodes, error: backupError } = await supabaseClient
      .rpc('generate_backup_codes');

    if (backupError) {
      console.error('Error generating backup codes:', backupError);
      throw backupError;
    }

    // Enable 2FA and store backup codes
    const { error: updateError } = await supabaseClient
      .from('user_2fa')
      .update({
        is_enabled: true,
        backup_codes: backupCodes,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.id);

    if (updateError) {
      console.error('Error enabling 2FA:', updateError);
      throw updateError;
    }

    return new Response(JSON.stringify({
      success: true,
      backupCodes: backupCodes
    }), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error) {
    console.error("Error in verify-2fa-setup function:", error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
