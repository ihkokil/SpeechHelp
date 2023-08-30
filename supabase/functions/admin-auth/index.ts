
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
    // Parse the request body
    let body;
    try {
      body = await req.json();
      console.log("Received request body:", JSON.stringify(body));
    } catch (error) {
      console.error("Error parsing request body:", error);
      return new Response(JSON.stringify({ error: "Invalid request body format" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }
    
    // Log incoming request for debugging
    console.log(`Admin auth request with action: ${body.action}`);
    console.log(`Request body keys: ${Object.keys(body).join(', ')}`);

    // Handle different authentication endpoints based on request body
    if (body.action === "create_admin") {
      // This is a create admin user request
      return await handleCreateAdmin(body);
    } else if (body.username && body.password) {
      // This is a verify password request
      return await handleVerifyPassword(body);
    } else if (body.adminId && body.code) {
      // This is a verify 2FA request
      return await handleVerify2FA(body);
    } else if (body.adminId && !body.code) {
      // This is a setup 2FA request
      return await handleSetup2FA(body);
    } else if (body.token && body.newPassword) {
      // This is a reset password request
      return await handleResetPassword(body);
    } else {
      return new Response(JSON.stringify({ error: "Invalid request parameters" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }
  } catch (error) {
    console.error("Error in admin-auth function:", error);
    return new Response(JSON.stringify({ error: "Internal server error", details: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});

// Create an admin user (for first-time setup)
async function handleCreateAdmin(data) {
  const { username, password, email, is_super_admin = false } = data;

  try {
    console.log(`Creating admin user: ${username}, email: ${email}`);
    
    // Check if admin with this username already exists
    const { data: existingAdmin, error: checkError } = await supabaseClient
      .from("admin_users")
      .select("id")
      .eq("username", username)
      .maybeSingle();

    if (checkError) {
      console.error("Error checking for existing admin:", checkError);
      throw checkError;
    }

    if (existingAdmin) {
      return new Response(JSON.stringify({ success: false, error: "Admin user already exists" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password);
    console.log("Password hashed successfully");

    // Create admin user
    const { data: newAdmin, error: createError } = await supabaseClient
      .from("admin_users")
      .insert({
        username,
        email,
        hashed_password: hashedPassword,
        is_super_admin
      })
      .select()
      .single();

    if (createError) {
      console.error("Error creating admin user:", createError);
      throw createError;
    }

    console.log("Admin user created successfully:", newAdmin.id);
    return new Response(JSON.stringify({ 
      success: true, 
      user: {
        id: newAdmin.id,
        username: newAdmin.username,
        email: newAdmin.email,
        is_active: newAdmin.is_active,
        is_super_admin: newAdmin.is_super_admin
      }
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error) {
    console.error("Error creating admin user:", error);
    return new Response(JSON.stringify({ success: false, error: "Failed to create admin user", details: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
}

// Verify admin password
async function handleVerifyPassword(data) {
  const { username, password } = data;

  try {
    console.log(`Verifying password for username: ${username}`);
    
    // Get admin user from database
    const { data: admin, error } = await supabaseClient
      .from("admin_users")
      .select("*")
      .eq("username", username)
      .maybeSingle();

    if (error) {
      console.error("Error fetching admin user:", error);
      throw error;
    }

    if (!admin) {
      console.log(`Admin user not found for username: ${username}`);
      return new Response(JSON.stringify({ 
        success: false,
        error: "Invalid credentials or account is inactive."
      }), {
        status: 401,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    if (!admin.is_active) {
      console.log(`Admin account is inactive: ${username}`);
      return new Response(JSON.stringify({ 
        success: false,
        error: "Invalid credentials or account is inactive."
      }), {
        status: 401,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, admin.hashed_password);
    console.log(`Password verification result: ${passwordMatch}`);

    if (!passwordMatch) {
      return new Response(JSON.stringify({ 
        success: false,
        error: "Invalid credentials."
      }), {
        status: 401,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Check if 2FA is enabled for this admin
    const { data: twoFactorData } = await supabaseClient
      .from("admin_2fa")
      .select("is_enabled")
      .eq("admin_user_id", admin.id)
      .maybeSingle();

    // Return user info
    return new Response(JSON.stringify({ 
      success: true,
      requires2FA: twoFactorData?.is_enabled || false,
      user: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        is_active: admin.is_active,
        is_super_admin: admin.is_super_admin,
        last_login: admin.last_login
      }
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error) {
    console.error("Error verifying password:", error);
    return new Response(JSON.stringify({ error: "Password verification failed", details: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
}

// Set up two-factor authentication
async function handleSetup2FA(data) {
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
    return new Response(JSON.stringify({ error: "Failed to set up 2FA", details: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
}

// Verify two-factor authentication code
async function handleVerify2FA(data) {
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
    return new Response(JSON.stringify({ error: "2FA verification failed", details: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
}

// Handle password reset
async function handleResetPassword(data) {
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
    return new Response(JSON.stringify({ error: "Password reset failed", details: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
}
