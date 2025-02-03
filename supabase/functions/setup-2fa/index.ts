
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.26.0";
import * as speakeasy from "https://esm.sh/speakeasy@2.0.0";
import * as qrcode from "https://esm.sh/qrcode@1.5.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  console.log('setup-2fa function called');
  console.log('Request method:', req.method);
  console.log('Request headers:', Object.fromEntries(req.headers.entries()));

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get("Authorization");
    console.log('Authorization header:', authHeader ? 'present' : 'missing');
    
    if (!authHeader) {
      console.error('No authorization header found');
      throw new Error("No authorization header");
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { 
        global: { 
          headers: { 
            Authorization: authHeader,
          } 
        } 
      }
    );

    console.log('Supabase client created, getting user...');

    // Get current user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      console.error('User error:', userError);
      throw new Error("Unauthorized");
    }

    console.log('User authenticated:', user.id);

    // Generate secret
    const secret = speakeasy.generateSecret({
      name: `SpeechHelp (${user.email})`,
      issuer: "SpeechHelp",
      length: 32,
    });

    console.log('Secret generated, creating QR code...');

    // Generate QR code
    const qrCodeDataURL = await qrcode.toDataURL(secret.otpauth_url!);

    console.log('QR code generated, storing in database...');

    // Store secret in database (not enabled yet)
    const { error: insertError } = await supabaseClient
      .from('user_2fa')
      .upsert({
        user_id: user.id,
        secret_key: secret.base32!,
        is_enabled: false,
        backup_codes: [],
      });

    if (insertError) {
      console.error('Error storing 2FA secret:', insertError);
      throw insertError;
    }

    console.log('2FA setup completed successfully');

    return new Response(JSON.stringify({
      success: true,
      secret: secret.base32,
      qrCode: qrCodeDataURL
    }), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error) {
    console.error("Error in setup-2fa function:", error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
