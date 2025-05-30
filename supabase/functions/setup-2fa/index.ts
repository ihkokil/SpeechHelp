
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.26.0";
import { encode as base32Encode } from "https://deno.land/std@0.168.0/encoding/base32.ts";
import { encode as base64Encode } from "https://deno.land/std@0.168.0/encoding/base64.ts";

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

// Generate a random secret for 2FA
function generateSecret(): { secret: string; base32: string; otpauthUrl: string } {
  // Generate 20 random bytes for the secret
  const secretBytes = new Uint8Array(20);
  crypto.getRandomValues(secretBytes);
  
  // Convert to base32
  const base32Secret = base32Encode(secretBytes).replace(/=/g, '');
  
  // Create the TOTP URL
  const issuer = "SpeechHelp";
  const accountName = "SpeechHelp User";
  
  const otpauthUrl = `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(accountName)}?secret=${base32Secret}&issuer=${encodeURIComponent(issuer)}`;
  
  return {
    secret: Array.from(secretBytes).map(b => b.toString(16).padStart(2, '0')).join(''),
    base32: base32Secret,
    otpauthUrl: otpauthUrl
  };
}

// Generate QR code as SVG
function generateQRCodeSVG(text: string): string {
  // Simple QR code placeholder - in production you'd want a proper QR library
  // For now, we'll create a simple data URL that can be used
  const qrText = encodeURIComponent(text);
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${qrText}`;
  
  // Return a simple SVG that shows the QR URL as a link
  return `data:image/svg+xml;base64,${base64Encode(`
    <svg width="200" height="250" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" fill="white" stroke="black"/>
      <text x="100" y="100" text-anchor="middle" font-size="10" fill="black">QR Code</text>
      <text x="100" y="115" text-anchor="middle" font-size="8" fill="blue">Please use: ${qrUrl}</text>
      <text x="100" y="230" text-anchor="middle" font-size="8" fill="gray">Manual entry key:</text>
      <text x="100" y="245" text-anchor="middle" font-size="6" fill="gray">${text.split('secret=')[1]?.split('&')[0] || ''}</text>
    </svg>
  `)}`;
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

    // Generate secret using our custom function
    const secretData = generateSecret();
    
    // Update the otpauth URL with user email
    const otpauthUrl = secretData.otpauthUrl.replace('SpeechHelp User', userEmail);

    console.log('Secret generated, creating QR code...');

    // Generate QR code
    const qrCodeDataURL = generateQRCodeSVG(otpauthUrl);

    console.log('QR code generated, storing in database...');

    // Store secret in database (not enabled yet)
    const { error: insertError } = await supabaseClient
      .from('user_2fa')
      .upsert({
        user_id: userId,
        secret_key: secretData.base32,
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
      secret: secretData.base32,
      qrCode: qrCodeDataURL,
      manualEntryKey: secretData.base32,
      qrUrl: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(otpauthUrl)}`
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
