
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.26.0";
import * as speakeasy from "https://esm.sh/speakeasy@2.0.0";

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
  console.log('verify-2fa-setup function called');
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { code } = await req.json();
    console.log('Verification code received');
    
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

    console.log('Supabase client created, fetching 2FA data...');

    // Get the secret from database
    const { data: twoFactorData, error: fetchError } = await supabaseClient
      .from('user_2fa')
      .select('secret_key')
      .eq('user_id', userId)
      .single();

    if (fetchError || !twoFactorData) {
      console.error('Error fetching 2FA data:', fetchError);
      throw new Error("2FA setup not found");
    }

    console.log('2FA data fetched, verifying code...');

    // Verify the code
    const verified = speakeasy.totp.verify({
      secret: twoFactorData.secret_key,
      encoding: 'base32',
      token: code,
      window: 1,
    });

    if (!verified) {
      console.log('Code verification failed');
      return new Response(JSON.stringify({
        success: false,
        error: "Invalid verification code"
      }), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    console.log('Code verified, generating backup codes...');

    // Generate backup codes
    const { data: backupCodes, error: backupError } = await supabaseClient
      .rpc('generate_backup_codes');

    if (backupError) {
      console.error('Error generating backup codes:', backupError);
      throw backupError;
    }

    console.log('Backup codes generated, enabling 2FA...');

    // Enable 2FA and store backup codes
    const { error: updateError } = await supabaseClient
      .from('user_2fa')
      .update({
        is_enabled: true,
        backup_codes: backupCodes,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);

    if (updateError) {
      console.error('Error enabling 2FA:', updateError);
      throw updateError;
    }

    console.log('2FA setup completed successfully');

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
