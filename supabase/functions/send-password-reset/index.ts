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

// Function to send email via SMTP with proper SSL/TLS handling
async function sendSMTPEmail(
  smtpHost: string,
  smtpPort: string,
  smtpUser: string,
  smtpPassword: string,
  to: string,
  subject: string,
  htmlContent: string
) {
  const port = parseInt(smtpPort);
  
  try {
    log(`Connecting to SMTP server: ${smtpHost}:${port}`);
    
    // For port 465, use TLS from the start (implicit TLS)
    // For port 587, use STARTTLS (explicit TLS)
    const conn = await Deno.connectTls({
      hostname: smtpHost,
      port: port,
    });

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    // Helper function to read response
    const readResponse = async () => {
      const buffer = new Uint8Array(4096);
      const n = await conn.read(buffer);
      const response = decoder.decode(buffer.subarray(0, n || 0));
      log('SMTP Response:', response.trim());
      return response;
    };

    // Helper function to send command
    const sendCommand = async (command: string) => {
      const logCommand = command.startsWith('AUTH') ? 'AUTH [HIDDEN]' : command;
      log('SMTP Command:', logCommand);
      await conn.write(encoder.encode(command + '\r\n'));
      return await readResponse();
    };

    // SMTP conversation
    log('Starting SMTP conversation over TLS');
    
    // Read initial greeting
    let response = await readResponse();
    if (!response.startsWith('220')) {
      throw new Error(`SMTP connection failed: ${response}`);
    }

    // Send EHLO
    response = await sendCommand(`EHLO ${smtpHost}`);
    if (!response.startsWith('250')) {
      // Try HELO instead
      response = await sendCommand(`HELO ${smtpHost}`);
      if (!response.startsWith('250')) {
        throw new Error(`EHLO/HELO failed: ${response}`);
      }
    }

    // Authenticate with AUTH LOGIN
    response = await sendCommand('AUTH LOGIN');
    if (!response.startsWith('334')) {
      throw new Error(`AUTH LOGIN failed: ${response}`);
    }

    // Send username (base64 encoded)
    const encodedUser = btoa(smtpUser);
    response = await sendCommand(encodedUser);
    if (!response.startsWith('334')) {
      throw new Error(`Username authentication failed: ${response}`);
    }

    // Send password (base64 encoded)
    const encodedPassword = btoa(smtpPassword);
    response = await sendCommand(encodedPassword);
    if (!response.startsWith('235')) {
      throw new Error(`Password authentication failed: ${response}`);
    }

    log('SMTP authentication successful');

    // Send MAIL FROM
    response = await sendCommand(`MAIL FROM:<${smtpUser}>`);
    if (!response.startsWith('250')) {
      throw new Error(`MAIL FROM failed: ${response}`);
    }

    // Send RCPT TO
    response = await sendCommand(`RCPT TO:<${to}>`);
    if (!response.startsWith('250')) {
      throw new Error(`RCPT TO failed: ${response}`);
    }

    // Send DATA
    response = await sendCommand('DATA');
    if (!response.startsWith('354')) {
      throw new Error(`DATA command failed: ${response}`);
    }

    // Prepare email content
    const emailBody = [
      `From: SpeechHelp <${smtpUser}>`,
      `To: ${to}`,
      `Subject: ${subject}`,
      `MIME-Version: 1.0`,
      `Content-Type: text/html; charset=UTF-8`,
      `Content-Transfer-Encoding: 7bit`,
      ``,
      htmlContent,
      ``,
      `.`
    ].join('\r\n');

    // Send email content
    log('Sending email content...');
    await conn.write(encoder.encode(emailBody + '\r\n'));
    response = await readResponse();
    if (!response.startsWith('250')) {
      throw new Error(`Email sending failed: ${response}`);
    }

    log('Email content sent successfully');

    // Send QUIT
    response = await sendCommand('QUIT');
    
    conn.close();
    
    log(`Email successfully sent from ${smtpUser} to ${to}`);
    return { success: true, message: 'Email sent successfully' };
    
  } catch (error) {
    log('SMTP error:', error);
    throw error;
  }
}

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

    log('Processing password reset request', { email, resetUrlDomain: new URL(resetUrl).hostname });

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

    // Check SMTP configuration
    const smtpHost = Deno.env.get('SMTP_HOST');
    const smtpPort = Deno.env.get('SMTP_PORT');
    const smtpUser = Deno.env.get('SMTP_USER');
    const smtpPassword = Deno.env.get('SMTP_PASSWORD');

    log('SMTP Configuration check:', {
      hasHost: !!smtpHost,
      hasPort: !!smtpPort,
      hasUser: !!smtpUser,
      hasPassword: !!smtpPassword,
      host: smtpHost,
      port: smtpPort,
      user: smtpUser ? `${smtpUser.substring(0, 3)}***${smtpUser.substring(smtpUser.length - 3)}` : 'N/A'
    });

    if (!smtpHost || !smtpPort || !smtpUser || !smtpPassword) {
      log('SMTP configuration incomplete');
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Password reset link generated successfully',
          note: 'Email service not configured - please contact support for the reset link',
          resetLink: resetLinkUrl // Include for debugging/testing
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    try {
      log('Sending password reset email via SMTP with TLS');
      
      // ... keep existing code (htmlContent variable)
      const htmlContent = `
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
      `;

      // Send email using SMTP with TLS
      await sendSMTPEmail(
        smtpHost,
        smtpPort,
        smtpUser,
        smtpPassword,
        email,
        'Reset Your SpeechHelp Password',
        htmlContent
      );

      log('Password reset email sent successfully to:', email);

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Password reset email sent successfully',
          emailSent: true,
          recipient: email,
          timestamp: new Date().toISOString()
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );

    } catch (emailError) {
      log('Email sending failed:', emailError);
      
      // Return success even if email fails since the reset link exists
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Password reset link generated (email delivery may have failed)',
          note: 'If you don\'t receive the email, please contact support',
          resetLink: resetLinkUrl, // Include for debugging/testing
          emailError: emailError.message
        }),
        {
          status: 200,
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
