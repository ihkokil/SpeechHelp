
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';
import { Resend } from "npm:resend@4.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ConfirmationEmailRequest {
  email: string;
  confirmationUrl: string;
  firstName?: string;
  lastName?: string;
}

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const smtpHost = Deno.env.get('SMTP_HOST');
const smtpPort = Deno.env.get('SMTP_PORT');
const smtpUser = Deno.env.get('SMTP_USER');
const smtpPassword = Deno.env.get('SMTP_PASSWORD');

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

const handler = async (req: Request): Promise<Response> => {
  console.log('Send confirmation function called');

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, confirmationUrl, firstName, lastName }: ConfirmationEmailRequest = await req.json();

    console.log('Confirmation email request for:', email);

    // Validate required fields
    if (!email || !confirmationUrl) {
      return new Response(
        JSON.stringify({ error: 'Email and confirmation URL are required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    console.log('SMTP Config:', {
      host: smtpHost,
      port: smtpPort,
      user: smtpUser ? smtpUser.substring(0, 8) + '***' : 'NOT SET',
      password: smtpPassword ? '***SET***' : 'NOT SET'
    });

    if (!smtpHost || !smtpPort || !smtpUser || !smtpPassword) {
      throw new Error('SMTP configuration is incomplete');
    }

    console.log('Attempting to send confirmation email via SMTP...');

    const displayName = firstName && lastName ? `${firstName} ${lastName}` : firstName || 'there';
    
    // Email HTML content
    const emailHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to SpeechHelp</title>
</head>
<body style="background-color: #f6f9fc; font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif; padding: 50px 0; margin: 0;">
  <div style="background-color: #ffffff; border: 1px solid #eee; border-radius: 10px; box-shadow: 0 5px 15px rgba(20, 50, 70, 0.08); margin: 0 auto; max-width: 600px; padding: 40px 30px;">
    
    <div style="text-align: center; margin-bottom: 30px;">
      <img src="https://yotrueuqjxmgcwlbbyps.supabase.co/storage/v1/object/public/images//SpeechHelp_Logo.svg" 
           alt="SpeechHelp" 
           style="width: 150px; height: auto; display: block; margin: 0 auto;" />
    </div>

    <div>
      <h1 style="color: #be185d; font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif; font-size: 32px; font-weight: bold; margin: 0 0 30px; text-align: center;">
        Welcome to SpeechHelp!
      </h1>
      
      <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 16px 0;">
        Hi ${displayName},
      </p>

      <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 16px 0;">
        Thank you for signing up for SpeechHelp! We're excited to help you improve your public speaking skills with AI-powered assistance.
      </p>

      <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 16px 0;">
        To get started, please confirm your email address by clicking the button below:
      </p>

      <div style="margin: 40px 0; text-align: center;">
        <a href="${confirmationUrl}" style="background-color: #be185d; border-radius: 8px; color: #fff; display: inline-block; font-size: 16px; font-weight: bold; padding: 16px 32px; text-decoration: none; text-transform: uppercase;">
          Confirm Your Account
        </a>
      </div>

      <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 16px 0;">
        If the button above doesn't work, copy and paste this link into your browser:
      </p>
      
      <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 16px 0;">
        <a href="${confirmationUrl}" style="color: #be185d; font-weight: 500; text-decoration: none; word-break: break-all;">
          ${confirmationUrl}
        </a>
      </p>

      <hr style="border: none; border-top: 1px solid #eaeaea; margin: 30px 0;">

      <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 6px; color: #0c4a6e; font-size: 14px; margin: 20px 0; padding: 16px;">
        <strong>What's Next?</strong> After confirming your account, you'll be able to:
        <ul style="margin: 8px 0; padding-left: 16px;">
          <li>Create AI-powered speeches for any occasion</li>
          <li>Practice with our speech assistant</li>
          <li>Track your progress and improvements</li>
        </ul>
      </div>
    </div>

    <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #eaeaea;">
      <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin: 12px 0;">
        Need help? Contact our support team at 
        <a href="mailto:hello@speechhelp.ai" style="color: #be185d; font-weight: 500; text-decoration: none;">
          hello@speechhelp.ai
        </a>
      </p>
      
      <p style="color: #9ca3af; font-size: 12px; margin-top: 20px; margin-bottom: 8px;">
        © 2024 SpeechHelp. All rights reserved.
      </p>
      
      <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin: 12px 0;">
        SpeechHelp, Inc. | Your AI Speech Assistant
      </p>
    </div>
  </div>
</body>
</html>
`;

    // Initialize Resend
    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

    console.log('Sending confirmation email via Resend...');

    // Send email using Resend
    const emailResponse = await resend.emails.send({
      from: "Speech Help <noreply@speechhelp.co>",
      to: [email],
      subject: "Confirm Your Email Address - Speech Help",
      html: emailHtml,
    });

    if (emailResponse.error) {
      console.error('Failed to send email via Resend:', emailResponse.error);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Failed to send confirmation email' 
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }

    console.log('Confirmation email sent successfully:', emailResponse.data);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Confirmation email sent successfully' 
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error('Error in send-confirmation function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);
