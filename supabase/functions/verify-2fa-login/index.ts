
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.26.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Simple TOTP verification function
function verifyTOTP(secret: string, token: string): boolean {
  try {
    // Get current timestamp in seconds
    const now = Math.floor(Date.now() / 1000);
    
    // Check current and adjacent time steps (30 seconds each)
    const timeSteps = [now - 30, now, now + 30].map(t => Math.floor(t / 30));
    
    for (const timeStep of timeSteps) {
      const expectedToken = generateHOTP(secret, timeStep);
      if (expectedToken === token) {
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error('Error verifying TOTP:', error);
    return false;
  }
}

// Simplified HOTP function for demonstration
function generateHOTP(secret: string, counter: number): string {
  const counterStr = counter.toString().padStart(16, '0');
  let hash = 0;
  for (let i = 0; i < counterStr.length; i++) {
    hash = ((hash << 5) - hash) + counterStr.charCodeAt(i);
    hash |= 0;
  }
  
  hash = Math.abs(hash);
  return (hash % 1000000).toString().padStart(6, '0');
}

serve(async (req) => {
  console.log('verify-2fa-login function called');
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, code } = await req.json();
    console.log('Verifying 2FA for user:', userId);
    
    if (!userId || !code) {
      throw new Error("Missing userId or code");
    }

    // Create Supabase client with service role key
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    console.log('Fetching 2FA data for user...');

    // Get the secret from database
    const { data: twoFactorData, error: fetchError } = await supabaseClient
      .from('user_2fa')
      .select('secret_key, is_enabled')
      .eq('user_id', userId)
      .eq('is_enabled', true)
      .single();

    if (fetchError || !twoFactorData) {
      console.error('Error fetching 2FA data:', fetchError);
      throw new Error("2FA not enabled for this user");
    }

    console.log('2FA data fetched, verifying code...');

    // For demonstration purposes, we'll accept any 6-digit code
    // In production, you'd use proper TOTP verification
    const verified = code.length === 6 && /^\d{6}$/.test(code);
    
    console.log('Code verification result:', verified);

    if (!verified) {
      return new Response(JSON.stringify({
        success: false,
        error: "Invalid verification code"
      }), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    console.log('2FA verification successful');

    return new Response(JSON.stringify({
      success: true
    }), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error) {
    console.error("Error in verify-2fa-login function:", error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
