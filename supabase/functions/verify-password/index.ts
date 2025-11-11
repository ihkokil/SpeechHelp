
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.26.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  console.log('verify-password function called');
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, password } = await req.json();
    console.log('Verifying password for email:', email);
    
    if (!email || !password) {
      throw new Error("Missing email or password");
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
      console.error('Password verification failed:', error.message);
      
      // Check if the error is due to email not confirmed
      if (error.message.includes('Email not confirmed')) {
        return new Response(JSON.stringify({
          success: false,
          error: "email_not_confirmed",
          message: "Please confirm your email address before signing in."
        }), {
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }
      
      return new Response(JSON.stringify({
        success: false,
        error: "Invalid credentials"
      }), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    if (data.user) {
      console.log('Password verified successfully for user:', data.user.id);
      
      // Immediately sign out to prevent auto-login
      await supabaseClient.auth.signOut();
      
      return new Response(JSON.stringify({
        success: true,
        userId: data.user.id
      }), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    return new Response(JSON.stringify({
      success: false,
      error: "Invalid credentials"
    }), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error) {
    console.error("Error in verify-password function:", error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
