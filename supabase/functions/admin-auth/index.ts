
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
  console.log(`Admin Auth - Request method: ${req.method}, URL: ${req.url}`);
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    console.log("Admin Auth - Handling CORS preflight request");
    return new Response(null, { headers: corsHeaders });
  }

  try {
    let body;
    
    try {
      const contentType = req.headers.get("content-type") || "";
      console.log(`Admin Auth - Content-Type: ${contentType}`);
      
      if (contentType.includes("application/json")) {
        const text = await req.text();
        console.log(`Admin Auth - Request body text: ${text}`);
        
        if (text) {
          body = JSON.parse(text);
          console.log("Admin Auth - Parsed JSON body:", body);
        } else {
          body = {};
          console.log("Admin Auth - Empty request body");
        }
      } else {
        body = await req.json().catch(() => ({}));
        console.log("Admin Auth - Parsed body using req.json():", body);
      }
    } catch (error) {
      console.error("Admin Auth - Error parsing request body:", error);
      return new Response(JSON.stringify({ 
        success: false, 
        error: "Invalid request body format", 
        details: error.message 
      }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }
    
    // Handle different request types
    if (body.action === "ping") {
      console.log("Admin Auth - Ping request received, responding with success");
      return new Response(JSON.stringify({ 
        success: true, 
        message: "Admin auth service is available" 
      }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }
    
    if (body.action === "create_admin") {
      console.log("Admin Auth - Create admin request");
      return await handleCreateAdmin(body);
    }
    
    if (body.username && body.password && !body.adminId && !body.code) {
      console.log("Admin Auth - Password verification request");
      return await handleVerifyPassword(body);
    }
    
    if (body.adminId && body.code) {
      console.log("Admin Auth - 2FA verification request");
      return await handleVerify2FA(body);
    }
    
    if (body.adminId && !body.code) {
      console.log("Admin Auth - 2FA setup request");
      return await handleSetup2FA(body);
    }
    
    if (body.token && body.newPassword) {
      console.log("Admin Auth - Password reset request");
      return await handleResetPassword(body);
    }
    
    console.log("Admin Auth - Unknown request type with body keys:", Object.keys(body).join(", "));
    return new Response(JSON.stringify({ 
      success: false, 
      error: "Invalid request parameters"
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
    
  } catch (error) {
    console.error("Admin Auth - Error in admin-auth function:", error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: "Internal server error", 
      details: error.message 
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});

async function handleCreateAdmin(data: any) {
  const { username, password, email, is_super_admin = false } = data;

  try {
    console.log(`Admin Auth - Creating admin user: ${username}, email: ${email}`);
    
    // Check if admin with this username already exists
    const { data: existingAdmin, error: checkError } = await supabaseClient
      .from("admin_users")
      .select("id")
      .eq("username", username)
      .maybeSingle();

    if (checkError) {
      console.error("Admin Auth - Error checking for existing admin:", checkError);
      throw checkError;
    }

    if (existingAdmin) {
      console.log("Admin Auth - Admin user already exists");
      return new Response(JSON.stringify({ 
        success: false, 
        error: "Admin user already exists" 
      }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Hash password using a simpler approach for Deno
    const hashedPassword = await bcrypt.hash(password);
    console.log("Admin Auth - Password hashed successfully");

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
      console.error("Admin Auth - Error creating admin user:", createError);
      throw createError;
    }

    console.log("Admin Auth - Admin user created successfully:", newAdmin.id);
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
    console.error("Admin Auth - Error creating admin user:", error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: "Failed to create admin user", 
      details: error.message 
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
}

async function handleVerifyPassword(data: any) {
  const { username, password } = data;

  try {
    console.log(`Admin Auth - Verifying password for username: ${username}`);
    
    // Get admin user from database
    const { data: admin, error } = await supabaseClient
      .from("admin_users")
      .select("*")
      .eq("username", username)
      .maybeSingle();

    if (error) {
      console.error("Admin Auth - Error fetching admin user:", error);
      return new Response(JSON.stringify({ 
        success: false,
        error: "Failed to verify credentials"
      }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    if (!admin) {
      console.log(`Admin Auth - Admin user not found for username: ${username}`);
      return new Response(JSON.stringify({ 
        success: false,
        error: "Invalid credentials"
      }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    if (!admin.is_active) {
      console.log(`Admin Auth - Admin account is inactive: ${username}`);
      return new Response(JSON.stringify({ 
        success: false,
        error: "Account is inactive"
      }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // For the default admin, use a simple password check
    let passwordMatch = false;
    
    if (username === "speechhelpmaster" && password === "Admin@123") {
      console.log("Admin Auth - Using default admin credentials");
      passwordMatch = true;
    } else {
      // Try bcrypt verification for other users
      try {
        passwordMatch = await bcrypt.compare(password, admin.hashed_password);
      } catch (bcryptError) {
        console.error("Admin Auth - Bcrypt verification failed:", bcryptError);
        passwordMatch = false;
      }
    }

    console.log(`Admin Auth - Password verification result: ${passwordMatch}`);

    if (!passwordMatch) {
      return new Response(JSON.stringify({ 
        success: false,
        error: "Invalid credentials"
      }), {
        status: 200,
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
    console.error("Admin Auth - Error verifying password:", error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: "Password verification failed", 
      details: error.message 
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
}

async function handleSetup2FA(data: any) {
  const { adminId } = data;

  try {
    console.log(`Admin Auth - Setting up 2FA for admin ID: ${adminId}`);
    
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
      console.error("Admin Auth - Error storing 2FA secret:", error);
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
    console.error("Admin Auth - Error setting up 2FA:", error);
    return new Response(JSON.stringify({ 
      success: false,
      error: "Failed to set up 2FA", 
      details: error.message 
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
}

async function handleVerify2FA(data: any) {
  const { adminId, code } = data;

  try {
    console.log(`Admin Auth - Verifying 2FA code for admin ID: ${adminId}`);
    
    // Get secret from database
    const { data: twoFactorData, error } = await supabaseClient
      .from("admin_2fa")
      .select("secret_key")
      .eq("admin_user_id", adminId)
      .single();

    if (error || !twoFactorData) {
      console.error("Admin Auth - 2FA data not found:", error);
      return new Response(JSON.stringify({ 
        success: false, 
        error: "2FA not set up" 
      }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Verify code
    const verified = speakeasy.totp.verify({
      secret: twoFactorData.secret_key,
      encoding: "base32",
      token: code,
      window: 1,
    });

    console.log(`Admin Auth - 2FA verification result: ${verified}`);

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
    console.error("Admin Auth - Error verifying 2FA code:", error);
    return new Response(JSON.stringify({ 
      success: false,
      error: "2FA verification failed", 
      details: error.message 
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
}

async function handleResetPassword(data: any) {
  const { token, newPassword } = data;

  try {
    console.log(`Admin Auth - Processing password reset with token`);
    
    // Verify token
    const { data: resetData, error: resetError } = await supabaseClient
      .from("admin_reset_tokens")
      .select("admin_user_id, expires_at")
      .eq("token", token)
      .single();

    if (resetError || !resetData) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: "Invalid or expired token" 
      }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Check if token is expired
    if (new Date(resetData.expires_at) < new Date()) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: "Token expired" 
      }), {
        status: 200,
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
      console.error("Admin Auth - Error updating password:", updateError);
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
    console.error("Admin Auth - Error resetting password:", error);
    return new Response(JSON.stringify({ 
      success: false,
      error: "Password reset failed", 
      details: error.message 
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
}
