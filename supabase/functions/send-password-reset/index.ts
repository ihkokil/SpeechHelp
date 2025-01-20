
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8?target=deno';

// Helper function to log with timestamps
const log = (message: string, data?: any) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
  if (data) {
    console.log(JSON.stringify(data, null, 2));
  }
};

serve(async (req) => {
  log(`Received ${req.method} request to ${req.url}`);

  if (req.method === 'OPTIONS') {
    log('Handling CORS preflight request');
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        {
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { email, resetUrl } = await req.json();

    if (!email || !resetUrl) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: email and resetUrl' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    log('Processing password reset request', { email });

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Generate password reset using Supabase Auth
    const { data, error } = await supabase.auth.admin.generateLink({
      type: 'recovery',
      email: email,
      options: {
        redirectTo: resetUrl
      }
    });

    if (error) {
      log('Error generating reset link:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to generate reset link' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const resetLinkUrl = data.properties?.action_link;
    
    if (!resetLinkUrl) {
      log('No reset link generated');
      return new Response(
        JSON.stringify({ error: 'Failed to generate reset link' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    log('Reset link generated successfully');

    // Send email using SMTP
    const smtpHost = Deno.env.get('SMTP_HOST');
    const smtpPort = Deno.env.get('SMTP_PORT');
    const smtpUser = Deno.env.get('SMTP_USER');
    const smtpPassword = Deno.env.get('SMTP_PASSWORD');

    if (!smtpHost || !smtpPort || !smtpUser || !smtpPassword) {
      log('SMTP configuration incomplete');
      return new Response(
        JSON.stringify({ error: 'Email service not configured' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    try {
      // Create SMTP connection
      const conn = await Deno.connect({
        hostname: smtpHost,
        port: parseInt(smtpPort),
        transport: "tcp",
      });

      const textEncoder = new TextEncoder();
      const textDecoder = new TextDecoder();

      // Helper function to send SMTP command
      async function sendCommand(command: string): Promise<string> {
        await conn.write(textEncoder.encode(command + '\r\n'));
        const buffer = new Uint8Array(1024);
        const bytesRead = await conn.read(buffer);
        return textDecoder.decode(buffer.subarray(0, bytesRead || 0));
      }

      // SMTP conversation
      await sendCommand('');
      await sendCommand(`EHLO ${smtpHost}`);
      
      // Authenticate
      const authString = btoa(`\0${smtpUser}\0${smtpPassword}`);
      const response = await sendCommand(`AUTH PLAIN ${authString}`);
      
      if (!response.includes('235')) {
        throw new Error('SMTP authentication failed');
      }

      // Send email
      await sendCommand(`MAIL FROM:<${smtpUser}>`);
      await sendCommand(`RCPT TO:<${email}>`);
      await sendCommand('DATA');

      // Email content with improved design
      const emailContent = `Subject: Reset Your SpeechHelp Password
From: SpeechHelp <${smtpUser}>
To: ${email}
MIME-Version: 1.0
Content-Type: text/html; charset=UTF-8

<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your SpeechHelp Password</title>
</head>
<body style="background-color: #f6f9fc; font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif; padding: 50px 0; margin: 0;">
  <div style="background-color: #ffffff; border: 1px solid #eee; border-radius: 10px; box-shadow: 0 5px 15px rgba(20, 50, 70, 0.08); margin: 0 auto; max-width: 600px; padding: 40px 30px;">
    
    <div style="text-align: center; margin-bottom: 30px;">
      <div style="font-size: 24px; font-weight: bold; color: #be185d; font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;">
        SpeechHelp
      </div>
    </div>

    <div>
      <h1 style="color: #be185d; font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif; font-size: 32px; font-weight: bold; margin: 0 0 30px; text-align: center;">
        Reset Your Password
      </h1>
      
      <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 16px 0;">
        We received a request to reset the password for your SpeechHelp account (${email}).
      </p>

      <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 16px 0;">
        Click the button below to create a new password. This link will expire in 24 hours for security reasons.
      </p>

      <div style="margin: 40px 0; text-align: center;">
        <a href="${resetLinkUrl}" style="background-color: #be185d; border-radius: 8px; color: #fff; display: inline-block; font-size: 16px; font-weight: bold; padding: 16px 32px; text-decoration: none; text-transform: uppercase;">
          Reset Your Password
        </a>
      </div>

      <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 16px 0;">
        If the button above doesn't work, copy and paste this link into your browser:
      </p>
      
      <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 16px 0;">
        <a href="${resetLinkUrl}" style="color: #be185d; font-weight: 500; text-decoration: none; word-break: break-all;">
          ${resetLinkUrl}
        </a>
      </p>

      <hr style="border: none; border-top: 1px solid #eaeaea; margin: 30px 0;">

      <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 6px; color: #92400e; font-size: 14px; margin: 20px 0; padding: 16px;">
        <strong>Security Note:</strong> If you didn't request this password reset, you can safely ignore this email. Your password will remain unchanged.
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

.`;

      // Send the email content
      const lines = emailContent.split('\n');
      for (const line of lines) {
        await conn.write(textEncoder.encode(line + '\r\n'));
      }
      
      const finalResponse = await sendCommand('.');
      
      if (!finalResponse.includes('250')) {
        throw new Error(`Email sending failed: ${finalResponse}`);
      }

      await sendCommand('QUIT');
      conn.close();

      log('Password reset email sent successfully');

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Password reset email sent successfully' 
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    } catch (emailError) {
      log('SMTP error:', emailError);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to send email',
          details: emailError.message 
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
  } catch (error) {
    log('Error in password reset function:', error);
    return new Response(
      JSON.stringify({
        error: 'Server error',
        message: error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
