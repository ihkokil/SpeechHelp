
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.26.0";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";
import * as speakeasy from "https://esm.sh/speakeasy@2.0.0";
import * as qrcode from "https://esm.sh/qrcode@1.5.3";
import { getCorsHeaders } from "../_shared/cors.ts";

// Initialize Supabase client with service role
const supabaseClient = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

// Generic error messages for client responses
const ERROR_MESSAGES = {
  INVALID_REQUEST: "Invalid request",
  INVALID_CREDENTIALS: "Invalid credentials",
  AUTH_FAILED: "Authentication failed",
  OPERATION_FAILED: "Operation failed",
  FORBIDDEN: "Access denied",
  RATE_LIMITED: "Too many attempts. Please try again later.",
} as const;

// Secure password verification using bcrypt
const verifyPassword = async (password: string, storedHash: string): Promise<boolean> => {
  try {
    const isValid = await bcrypt.compare(password, storedHash);
    console.log(`Password verification completed`);
    return isValid;
  } catch (error) {
    console.error("Error in password verification:", error);
    return false;
  }
};

// Helper function to verify super admin authentication from request
const verifySuperAdminAuth = async (req: Request): Promise<{ isValid: boolean; adminId?: string; error?: string }> => {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return { isValid: false, error: "missing_auth" };
    }

    const token = authHeader.replace("Bearer ", "");
    
    let sessionData;
    try {
      sessionData = JSON.parse(atob(token));
    } catch {
      return { isValid: false, error: "invalid_token" };
    }

    const { adminId, expiresAt } = sessionData;
    
    if (!adminId || !expiresAt) {
      return { isValid: false, error: "invalid_token_data" };
    }

    if (new Date(expiresAt) < new Date()) {
      return { isValid: false, error: "token_expired" };
    }

    const { data: admin, error } = await supabaseClient
      .from("admin_users")
      .select("id, is_super_admin, is_active")
      .eq("id", adminId)
      .maybeSingle();

    if (error || !admin) {
      console.error("Admin lookup error:", error);
      return { isValid: false, error: "admin_not_found" };
    }

    if (!admin.is_active) {
      return { isValid: false, error: "account_inactive" };
    }

    if (!admin.is_super_admin) {
      return { isValid: false, error: "insufficient_privileges" };
    }

    return { isValid: true, adminId: admin.id };
  } catch (error) {
    console.error("Error verifying super admin auth:", error);
    return { isValid: false, error: "auth_error" };
  }
};

// Check if any admin users exist (for first-time setup)
const hasExistingAdmins = async (): Promise<boolean> => {
  const { count, error } = await supabaseClient
    .from("admin_users")
    .select("id", { count: "exact", head: true });
  
  if (error) {
    console.error("Error checking for existing admins:", error);
    return true;
  }
  
  return (count ?? 0) > 0;
};

serve(async (req) => {
  console.log(`Request method: ${req.method}, URL: ${req.url}`);
  
  const origin = req.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);
  
  if (req.method === "OPTIONS") {
    console.log("Handling CORS preflight request");
    return new Response(null, { headers: corsHeaders });
  }

  try {
    let body;
    
    try {
      const contentType = req.headers.get("content-type") || "";
      console.log(`Content-Type: ${contentType}`);
      
      if (contentType.includes("application/json")) {
        const text = await req.text();
        console.log(`Request body received`);
        
        if (text) {
          body = JSON.parse(text);
        } else {
          body = {};
          console.log("Empty request body");
        }
      } else {
        body = await req.json().catch(() => ({}));
      }
    } catch (error) {
      console.error("Error parsing request body:", error);
      return new Response(JSON.stringify({ 
        success: false, 
        error: ERROR_MESSAGES.INVALID_REQUEST
      }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }
    
    let requestType = "";
    
    if (body.action === "create_admin") {
      requestType = "create_admin";
      console.log("Identified request type: create_admin");
    } else if (body.username && body.password) {
      requestType = "verify_password";
      console.log("Identified request type: verify_password");
    } else if (body.adminId && body.code) {
      requestType = "verify_2fa";
      console.log("Identified request type: verify_2fa");
    } else if (body.adminId && !body.code) {
      requestType = "setup_2fa";
      console.log("Identified request type: setup_2fa");
    } else if (body.token && body.newPassword) {
      requestType = "reset_password";
      console.log("Identified request type: reset_password");
    } else {
      console.log("Unknown request type with body keys:", Object.keys(body).join(", "));
      return new Response(JSON.stringify({ 
        success: false, 
        error: ERROR_MESSAGES.INVALID_REQUEST
      }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }
    
    let response;
    switch (requestType) {
      case "create_admin":
        response = await handleCreateAdmin(body, req, corsHeaders);
        break;
      case "verify_password":
        response = await handleVerifyPassword(body, corsHeaders);
        break;
      case "verify_2fa":
        response = await handleVerify2FA(body, corsHeaders);
        break;
      case "setup_2fa":
        response = await handleSetup2FA(body, corsHeaders);
        break;
      case "reset_password":
        response = await handleResetPassword(body, corsHeaders);
        break;
      default:
        response = new Response(JSON.stringify({ 
          success: false, 
          error: ERROR_MESSAGES.INVALID_REQUEST
        }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
    }
    
    return response;
  } catch (error) {
    console.error("Error in admin-auth function:", error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: ERROR_MESSAGES.OPERATION_FAILED
    }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...getCorsHeaders(req.headers.get("origin")) },
    });
  }
});

// Create an admin user (requires super admin auth, except for first admin)
async function handleCreateAdmin(data: any, req: Request, corsHeaders: Record<string, string>) {
  const { username, password, email, is_super_admin = false } = data;

  try {
    console.log(`Admin creation request for username: ${username}`);
    
    const adminsExist = await hasExistingAdmins();
    
    if (adminsExist) {
      const authResult = await verifySuperAdminAuth(req);
      
      if (!authResult.isValid) {
        console.log(`Admin creation denied: ${authResult.error}`);
        return new Response(JSON.stringify({ 
          success: false, 
          error: ERROR_MESSAGES.FORBIDDEN
        }), {
          status: 403,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }
      
      console.log(`Admin creation authorized by super admin: ${authResult.adminId}`);
    } else {
      console.log("No admins exist - allowing first admin creation without authentication");
    }
    
    if (!username || typeof username !== 'string' || username.length < 3) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: "Username must be at least 3 characters" 
      }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    if (!password || typeof password !== 'string' || password.length < 8) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: "Password must be at least 8 characters" 
      }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: "Valid email is required" 
      }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }
    
    const { data: existingAdmin, error: checkError } = await supabaseClient
      .from("admin_users")
      .select("id")
      .eq("username", username)
      .maybeSingle();

    if (checkError) {
      console.error("Error checking for existing admin:", checkError);
      return new Response(JSON.stringify({ 
        success: false, 
        error: ERROR_MESSAGES.OPERATION_FAILED
      }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    if (existingAdmin) {
      console.log("Admin user already exists");
      return new Response(JSON.stringify({ 
        success: false, 
        error: "Admin user already exists" 
      }), {
        status: 409,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const hashedPassword = await bcrypt.hash(password);
    console.log("Password hashed successfully");

    const { data: newAdmin, error: createError } = await supabaseClient
      .from("admin_users")
      .insert({
        username,
        email,
        hashed_password: hashedPassword,
        is_super_admin: adminsExist ? is_super_admin : true
      })
      .select()
      .single();

    if (createError) {
      console.error("Error creating admin user:", createError);
      return new Response(JSON.stringify({ 
        success: false, 
        error: ERROR_MESSAGES.OPERATION_FAILED
      }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
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
      status: 201,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error) {
    console.error("Error creating admin user:", error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: ERROR_MESSAGES.OPERATION_FAILED
    }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
}

// Verify admin password
async function handleVerifyPassword(data: any, corsHeaders: Record<string, string>) {
  const { username, password } = data;

  try {
    console.log(`Verifying password for username: ${username}`);
    
    if (!username || typeof username !== 'string') {
      return new Response(JSON.stringify({ 
        success: false,
        error: ERROR_MESSAGES.INVALID_CREDENTIALS
      }), {
        status: 401,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    if (!password || typeof password !== 'string') {
      return new Response(JSON.stringify({ 
        success: false,
        error: ERROR_MESSAGES.INVALID_CREDENTIALS
      }), {
        status: 401,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }
    
    const { data: admin, error } = await supabaseClient
      .from("admin_users")
      .select("*")
      .eq("username", username)
      .maybeSingle();

    if (error) {
      console.error("Error fetching admin user:", error);
      return new Response(JSON.stringify({ 
        success: false,
        error: ERROR_MESSAGES.AUTH_FAILED
      }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    if (!admin) {
      console.log(`Admin user not found for username: ${username}`);
      return new Response(JSON.stringify({ 
        success: false,
        error: ERROR_MESSAGES.INVALID_CREDENTIALS
      }), {
        status: 401,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    if (!admin.is_active) {
      console.log(`Admin account is inactive: ${username}`);
      return new Response(JSON.stringify({ 
        success: false,
        error: ERROR_MESSAGES.INVALID_CREDENTIALS
      }), {
        status: 401,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const passwordMatch = await verifyPassword(password, admin.hashed_password);
    console.log(`Password verification completed for: ${username}`);

    if (!passwordMatch) {
      await supabaseClient
        .from("admin_users")
        .update({ failed_login_attempts: admin.failed_login_attempts + 1 })
        .eq("id", admin.id);
        
      return new Response(JSON.stringify({ 
        success: false,
        error: ERROR_MESSAGES.INVALID_CREDENTIALS
      }), {
        status: 401,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    await supabaseClient
      .from("admin_users")
      .update({ 
        failed_login_attempts: 0,
        last_login: new Date().toISOString()
      })
      .eq("id", admin.id);

    const { data: twoFactorData } = await supabaseClient
      .from("admin_2fa")
      .select("is_enabled")
      .eq("admin_user_id", admin.id)
      .maybeSingle();

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
    return new Response(JSON.stringify({ 
      success: false, 
      error: ERROR_MESSAGES.AUTH_FAILED
    }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
}

// Set up two-factor authentication
async function handleSetup2FA(data: any, corsHeaders: Record<string, string>) {
  const { adminId } = data;

  try {
    console.log(`Setting up 2FA for admin ID: ${adminId}`);
    
    const secret = speakeasy.generateSecret({
      name: "SpeechHelp Admin",
    });

    const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url);

    const { data: twoFactorResult, error } = await supabaseClient
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
      return new Response(JSON.stringify({ 
        success: false, 
        error: ERROR_MESSAGES.OPERATION_FAILED
      }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
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
    return new Response(JSON.stringify({ 
      success: false,
      error: ERROR_MESSAGES.OPERATION_FAILED
    }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
}

// Verify two-factor authentication code
async function handleVerify2FA(data: any, corsHeaders: Record<string, string>) {
  const { adminId, code } = data;

  try {
    console.log(`Verifying 2FA code for admin ID: ${adminId}`);
    
    const { data: twoFactorData, error } = await supabaseClient
      .from("admin_2fa")
      .select("secret_key")
      .eq("admin_user_id", adminId)
      .single();

    if (error || !twoFactorData) {
      console.error("2FA data not found:", error);
      return new Response(JSON.stringify({ 
        success: false, 
        error: "2FA not configured" 
      }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const verified = speakeasy.totp.verify({
      secret: twoFactorData.secret_key,
      encoding: "base32",
      token: code,
      window: 1,
    });

    console.log(`2FA verification completed`);

    if (verified) {
      await supabaseClient
        .from("admin_2fa")
        .update({ is_enabled: true })
        .eq("admin_user_id", adminId);
    }

    return new Response(JSON.stringify({ success: verified }), {
      status: verified ? 200 : 401,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error) {
    console.error("Error verifying 2FA code:", error);
    return new Response(JSON.stringify({ 
      success: false,
      error: ERROR_MESSAGES.AUTH_FAILED
    }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
}

// Handle password reset
async function handleResetPassword(data: any, corsHeaders: Record<string, string>) {
  const { token, newPassword } = data;

  try {
    console.log(`Processing password reset with token`);
    
    if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 8) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: "Password must be at least 8 characters" 
      }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }
    
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
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    if (new Date(resetData.expires_at) < new Date()) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: "Token expired" 
      }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword);

    const { error: updateError } = await supabaseClient
      .from("admin_users")
      .update({ hashed_password: hashedPassword })
      .eq("id", resetData.admin_user_id);

    if (updateError) {
      console.error("Error updating password:", updateError);
      return new Response(JSON.stringify({ 
        success: false, 
        error: ERROR_MESSAGES.OPERATION_FAILED
      }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

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
    return new Response(JSON.stringify({ 
      success: false, 
      error: ERROR_MESSAGES.OPERATION_FAILED
    }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
}
