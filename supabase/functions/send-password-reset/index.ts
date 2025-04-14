
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

    // Check if user exists
    const { data: user, error: userError } = await supabase.auth.admin.listUsers();
    if (userError) {
      console.error('Error checking user:', userError);
      return new Response(
        JSON.stringify({ error: 'Failed to verify user' }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const userExists = user.users.some(u => u.email === email);
    if (!userExists) {
      // Return success even if user doesn't exist for security
      return new Response(
        JSON.stringify({ success: true, message: 'If an account with this email exists, a reset link has been sent.' }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Generate OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now

    // Clean up expired OTPs
    await supabase.from('password_reset_otps').delete().lt('expires_at', new Date().toISOString());

    // Store OTP
    const { error: otpError } = await supabase
      .from('password_reset_otps')
      .insert({
        email,
        otp_code: otpCode,
        expires_at: expiresAt.toISOString(),
        is_used: false
      });

    if (otpError) {
      console.error('Error storing OTP:', otpError);
      return new Response(
        JSON.stringify({ error: 'Failed to generate reset code' }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Send email
    const emailResponse = await resend.emails.send({
      from: "SpeechHelp <noreply@speechhelp.ai>",
      to: [email],
      subject: "Reset Your Password - SpeechHelp",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #e91e63; text-align: center;">Password Reset Request</h1>
          <p>Hello,</p>
          <p>We received a request to reset your password for your SpeechHelp account.</p>
          <div style="background: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0;">
            <h2 style="margin: 0; color: #333;">Your Reset Code:</h2>
            <h1 style="font-size: 32px; letter-spacing: 8px; color: #e91e63; margin: 10px 0;">${otpCode}</h1>
            <p style="color: #666; margin: 0;">This code expires in 15 minutes</p>
          </div>
          <p>If you didn't request this password reset, you can safely ignore this email.</p>
          <p>Best regards,<br>The SpeechHelp Team</p>
        </div>
      `,
    });

    console.log('Password reset email sent:', emailResponse);

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
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
