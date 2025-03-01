
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

// Generate a 6-digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

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
    let response = await readResponse();
    if (!response.startsWith('220')) {
      throw new Error(`SMTP connection failed: ${response}`);
    }

    response = await sendCommand(`EHLO ${smtpHost}`);
    if (!response.startsWith('250')) {
      response = await sendCommand(`HELO ${smtpHost}`);
      if (!response.startsWith('250')) {
        throw new Error(`EHLO/HELO failed: ${response}`);
      }
    }

    response = await sendCommand('AUTH LOGIN');
    if (!response.startsWith('334')) {
      throw new Error(`AUTH LOGIN failed: ${response}`);
    }

    const encodedUser = btoa(smtpUser);
    response = await sendCommand(encodedUser);
    if (!response.startsWith('334')) {
      throw new Error(`Username authentication failed: ${response}`);
    }

    const encodedPassword = btoa(smtpPassword);
    response = await sendCommand(encodedPassword);
    if (!response.startsWith('235')) {
      throw new Error(`Password authentication failed: ${response}`);
    }

    response = await sendCommand(`MAIL FROM:<${smtpUser}>`);
    if (!response.startsWith('250')) {
      throw new Error(`MAIL FROM failed: ${response}`);
    }

    response = await sendCommand(`RCPT TO:<${to}>`);
    if (!response.startsWith('250')) {
      throw new Error(`RCPT TO failed: ${response}`);
    }

    response = await sendCommand('DATA');
    if (!response.startsWith('354')) {
      throw new Error(`DATA command failed: ${response}`);
    }

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

    await conn.write(encoder.encode(emailBody + '\r\n'));
    response = await readResponse();
    if (!response.startsWith('250')) {
      throw new Error(`Email sending failed: ${response}`);
    }

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

    const { email } = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Email is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    log('Processing password reset OTP request', { email });

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Check if user exists
    const { data: userData, error: userError } = await supabase.auth.admin.listUsers();
    
    if (userError) {
      log('Error fetching users:', userError);
      return new Response(
        JSON.stringify({ error: 'Failed to verify user' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const user = userData.users.find(u => u.email === email);
    
    if (!user) {
      log('User not found with email:', email);
      // Don't reveal that user doesn't exist for security
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'If an account with this email exists, you will receive an OTP code.'
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Generate OTP
    const otpCode = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    log('Generated OTP for user:', { email, expiresAt });

    // Clean up any existing OTPs for this email
    await supabase
      .from('password_reset_otps')
      .delete()
      .eq('email', email);

    // Store OTP in database
    const { error: otpError } = await supabase
      .from('password_reset_otps')
      .insert({
        email: email,
        otp_code: otpCode,
        expires_at: expiresAt.toISOString()
      });

    if (otpError) {
      log('Error storing OTP:', otpError);
      return new Response(
        JSON.stringify({ error: 'Failed to generate OTP' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Check SMTP configuration
    const smtpHost = Deno.env.get('SMTP_HOST');
    const smtpPort = Deno.env.get('SMTP_PORT');
    const smtpUser = Deno.env.get('SMTP_USER');
    const smtpPassword = Deno.env.get('SMTP_PASSWORD');

    if (!smtpHost || !smtpPort || !smtpUser || !smtpPassword) {
      log('SMTP configuration incomplete, returning OTP for testing');
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'OTP generated successfully',
          note: 'Email service not configured - please contact support',
          otpCode: otpCode // Include for debugging/testing
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    try {
      const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your SpeechHelp Password Reset Code</title>
</head>
<body style="background-color: #f6f9fc; font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif; padding: 50px 0; margin: 0;">
  <div style="background-color: #ffffff; border: 1px solid #eee; border-radius: 10px; box-shadow: 0 5px 15px rgba(20, 50, 70, 0.08); margin: 0 auto; max-width: 600px; padding: 40px 30px;">
    
    <div style="text-align: center; margin-bottom: 30px;">
      <img src="https://yotrueuqjxmgcwlbbyps.supabase.co/storage/v1/object/public/svg_files//Speech%20Help%20Logo.svg" 
           alt="SpeechHelp" 
           style="width: 150px; height: auto; display: block; margin: 0 auto;" />
    </div>

    <div>
      <h1 style="color: #be185d; font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif; font-size: 32px; font-weight: bold; margin: 0 0 30px; text-align: center;">
        Password Reset Code
      </h1>
      
      <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 16px 0;">
        We received a request to reset the password for your SpeechHelp account (${email}).
      </p>

      <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 16px 0;">
        Enter this verification code to reset your password:
      </p>

      <div style="background-color: #f8fafc; border: 2px solid #be185d; border-radius: 8px; font-family: 'SF Mono', Monaco, monospace; font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 30px 0; padding: 20px; text-align: center; color: #be185d;">
        ${otpCode}
      </div>

      <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 16px 0;">
        This code will expire in <strong>10 minutes</strong> for security reasons.
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
    </div>
  </div>
</body>
</html>
      `;

      await sendSMTPEmail(
        smtpHost,
        smtpPort,
        smtpUser,
        smtpPassword,
        email,
        'Your SpeechHelp Password Reset Code',
        htmlContent
      );

      log('Password reset OTP email sent successfully to:', email);

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'OTP sent to your email address',
          emailSent: true
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );

    } catch (emailError) {
      log('Email sending failed:', emailError);
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'OTP generated (email delivery may have failed)',
          note: 'If you don\'t receive the email, please contact support',
          otpCode: otpCode // Include for debugging/testing
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
  } catch (error) {
    log('Error in password reset OTP function:', error);
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
