
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.26.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Constant time delay to prevent timing attacks
const CONSTANT_RESPONSE_TIME_MS = 500;

serve(async (req) => {
  const startTime = Date.now();
  console.log('verify-password function called');
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Helper to ensure constant-time response
  const respondAfterDelay = async (response: Response): Promise<Response> => {
    const elapsed = Date.now() - startTime;
    const remainingDelay = Math.max(0, CONSTANT_RESPONSE_TIME_MS - elapsed);
    if (remainingDelay > 0) {
      await new Promise(resolve => setTimeout(resolve, remainingDelay));
    }
    return response;
  };

  try {
    const { email, password } = await req.json();
    console.log('Verifying password for email:', email ? '[REDACTED]' : 'missing');
    
    if (!email || !password) {
      return await respondAfterDelay(new Response(JSON.stringify({
        success: false,
        error: "Invalid credentials"
      }), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }));
    }

    // Create Supabase client with service role key
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    console.log('Attempting password verification...');

    // Try to sign in to verify the password, but don't return the session
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Password verification failed');
      
      // Check if the error is due to email not confirmed
      if (error.message.includes('Email not confirmed')) {
        return await respondAfterDelay(new Response(JSON.stringify({
          success: false,
          error: "email_not_confirmed",
          message: "Please confirm your email address before signing in."
        }), {
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }));
      }
      
      // Generic error - don't reveal if user exists or not
      return await respondAfterDelay(new Response(JSON.stringify({
        success: false,
        error: "Invalid credentials"
      }), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }));
    }

    if (data.user) {
      console.log('Password verified successfully');
      
      // Immediately sign out to prevent auto-login
      await supabaseClient.auth.signOut();
      
      return await respondAfterDelay(new Response(JSON.stringify({
        success: true,
        userId: data.user.id
      }), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }));
    }

    // Generic error for all other cases
    return await respondAfterDelay(new Response(JSON.stringify({
      success: false,
      error: "Invalid credentials"
    }), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
    }));
  } catch (error) {
    console.error("Error in verify-password function");
    // Don't expose error details in production
    return await respondAfterDelay(new Response(JSON.stringify({ 
      success: false, 
      error: "An error occurred during verification"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    }));
  }
});
