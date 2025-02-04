
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.26.0";
import * as speakeasy from "https://esm.sh/speakeasy@2.0.0";
import * as qrcode from "https://esm.sh/qrcode@1.5.3";

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
  console.log('setup-2fa function called');
  console.log('Request method:', req.method);

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

    console.log('Supabase client created, generating secret...');

    // Get user email for the QR code
    const { data: userData, error: userError } = await supabaseClient
      .from('profiles')
      .select('username')
      .eq('id', userId)
      .single();

    const userEmail = userData?.username || 'user@example.com';

    // Generate secret
    const secret = speakeasy.generateSecret({
      name: `SpeechHelp (${userEmail})`,
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
        user_id: userId,
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
