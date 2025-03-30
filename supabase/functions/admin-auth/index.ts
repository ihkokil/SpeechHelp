
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.26.0";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";
import * as speakeasy from "https://esm.sh/speakeasy@2.0.0";
import * as qrcode from "https://esm.sh/qrcode@1.5.3";

// Initialize Supabase client with service role
const supabaseClient = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const body = await req.json();
    
    // Log incoming request for debugging
    console.log(`Admin auth request to: ${url.pathname}`);
    console.log(`Request body keys: ${Object.keys(body).join(', ')}`);

    // Handle different authentication endpoints based on request body
    if (body.username && body.password) {
      // This is a verify password request
      return handleVerifyPassword(body);
    } else if (body.adminId && body.code) {
      // This is a verify 2FA request
      return handleVerify2FA(body);
    } else if (body.adminId && !body.code) {
      // This is a setup 2FA request
      return handleSetup2FA(body);
    } else if (body.token && body.newPassword) {
      // This is a reset password request
      return handleResetPassword(body);
    } else {
      return new Response(JSON.stringify({ error: "Invalid request parameters" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }
  } catch (error) {
    console.error("Error in admin-auth function:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});

// Verify admin password
async function handleVerifyPassword(data: { username: string; password: string }) {
  const { username, password } = data;

  try {
    console.log(`Verifying password for username: ${username}`);
    
    // Get hashed password from database
    const { data: admin, error } = await supabaseClient
      .from("admin_users")
      .select("id, hashed_password")
      .eq("username", username)
      .single();

    if (error || !admin) {
      console.log(`Admin user not found for username: ${username}`);
      return new Response(JSON.stringify({ success: false }), {
        status: 401,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, admin.hashed_password);
    console.log(`Password verification result: ${passwordMatch}`);

    return new Response(JSON.stringify({ success: passwordMatch }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error) {
    console.error("Error verifying password:", error);
    return new Response(JSON.stringify({ error: "Password verification failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
}

// Set up two-factor authentication
async function handleSetup2FA(data: { adminId: string }) {
  const { adminId } = data;

  try {
    console.log(`Setting up 2FA for admin ID: ${adminId}`);
    
    // Generate secret
    const secret = speakeasy.generateSecret({
      name: "SpeechHelp Admin",
    });

    // Get QR code as data URL
    const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url);

    // Store secret in database
    const { data, error } = await supabaseClient
      .from("admin_2fa")
      .upsert({
        admin_user_id: adminId,
        secret_key: secret.base32,
        is_enabled: false,
      })
      .select()
      .single();

    if (error) {
      console.error("Error storing 2FA secret:", error);
      throw error;
    }

    return new Response(
      JSON.stringify({
        success: true,
        secret: secret.base32,
        qrCode: qrCodeUrl,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error) {
    console.error("Error setting up 2FA:", error);
    return new Response(JSON.stringify({ error: "Failed to set up 2FA" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
}

// Verify two-factor authentication code
async function handleVerify2FA(data: { adminId: string; code: string }) {
  const { adminId, code } = data;

  try {
    console.log(`Verifying 2FA code for admin ID: ${adminId}`);
    
    // Get secret from database
    const { data: twoFactorData, error } = await supabaseClient
      .from("admin_2fa")
      .select("secret_key")
      .eq("admin_user_id", adminId)
      .single();

    if (error || !twoFactorData) {
      console.error("2FA data not found:", error);
      return new Response(JSON.stringify({ success: false, error: "2FA not set up" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Verify code
    const verified = speakeasy.totp.verify({
      secret: twoFactorData.secret_key,
      encoding: "base32",
      token: code,
      window: 1, // Allow 1 step before and after for time skew
    });

    console.log(`2FA verification result: ${verified}`);

    if (verified) {
      // Enable 2FA if this is the first verification
      await supabaseClient
        .from("admin_2fa")
        .update({ is_enabled: true })
        .eq("admin_user_id", adminId);
    }

    return new Response(JSON.stringify({ success: verified }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error) {
    console.error("Error verifying 2FA code:", error);
    return new Response(JSON.stringify({ error: "2FA verification failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
}

// Handle password reset
async function handleResetPassword(data: { token: string; newPassword: string }) {
  const { token, newPassword } = data;

  try {
    console.log(`Processing password reset with token`);
    
    // Verify token
    const { data: resetData, error: resetError } = await supabaseClient
      .from("admin_reset_tokens")
      .select("admin_user_id, expires_at")
      .eq("token", token)
      .single();

    if (resetError || !resetData) {
      return new Response(JSON.stringify({ success: false, error: "Invalid or expired token" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Check if token is expired
    if (new Date(resetData.expires_at) < new Date()) {
      return new Response(JSON.stringify({ success: false, error: "Token expired" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword);

    // Update password
    const { error: updateError } = await supabaseClient
      .from("admin_users")
      .update({ hashed_password: hashedPassword })
      .eq("id", resetData.admin_user_id);

    if (updateError) {
      console.error("Error updating password:", updateError);
      throw updateError;
    }

    // Delete used token
    await supabaseClient
      .from("admin_reset_tokens")
      .delete()
      .eq("token", token);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error) {
    console.error("Error resetting password:", error);
    return new Response(JSON.stringify({ error: "Password reset failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
}
