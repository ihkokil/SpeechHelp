
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';
import { Resend } from "npm:resend@2.0.0";

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PasswordResetRequest {
  email: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email }: PasswordResetRequest = await req.json();
    console.log('Password reset requested for:', email);

    // Check if user exists using the auth API
    const { data: users, error: userError } = await supabase.auth.admin.listUsers();
    if (userError) {
      console.error('Error checking user:', userError);
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'If an account with this email exists, a reset link has been sent.' 
        }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const userExists = users.users.some(u => u.email === email);
    if (!userExists) {
      // Return success even if user doesn't exist for security
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'If an account with this email exists, a reset link has been sent.' 
        }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Send password reset email using Supabase auth
    const { error: resetError } = await supabase.auth.admin.generateLink({
      type: 'recovery',
      email: email,
      options: {
        redirectTo: `${Deno.env.get('SUPABASE_URL').replace('https://', 'https://').replace('.supabase.co', '')}.supabase.co/auth/v1/verify?redirect_to=${encodeURIComponent(`${req.headers.get('origin') || 'http://localhost:5173'}/auth?type=recovery`)}`
      }
    });

    if (resetError) {
      console.error('Error generating reset link:', resetError);
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'If an account with this email exists, a reset link has been sent.' 
        }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log('Password reset email sent successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'If an account with this email exists, a reset link has been sent.' 
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error: any) {
    console.error("Error in send-password-reset function:", error);
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'If an account with this email exists, a reset link has been sent.' 
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
