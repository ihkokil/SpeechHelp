
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';

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

    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: name, email, and message' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    log('Processing contact form submission', { name, email });

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
          success: false, 
          message: 'Email service not configured - please contact support',
          error: 'SMTP configuration incomplete'
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    try {
      log('Sending contact form email via SMTP with TLS');
      
      const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Contact Form Submission - SpeechHelp</title>
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
        New Contact Form Submission
      </h1>
      
      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <h3 style="color: #374151; margin: 0 0 15px; font-size: 18px;">Contact Details:</h3>
        <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 8px 0;">
          <strong>Name:</strong> ${name}
        </p>
        <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 8px 0;">
          <strong>Email:</strong> ${email}
        </p>
      </div>

      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <h3 style="color: #374151; margin: 0 0 15px; font-size: 18px;">Message:</h3>
        <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0; white-space: pre-wrap;">
          ${message}
        </p>
      </div>

      <hr style="border: none; border-top: 1px solid #eaeaea; margin: 30px 0;">

      <div style="background-color: #e0f2fe; border: 1px solid #0284c7; border-radius: 6px; color: #075985; font-size: 14px; margin: 20px 0; padding: 16px;">
        <strong>Action Required:</strong> Please respond to this contact form submission within 24 hours.
      </div>
    </div>

    <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #eaeaea;">
      <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin: 12px 0;">
        This email was sent from the SpeechHelp contact form.
      </p>
      
      <p style="color: #9ca3af; font-size: 12px; margin-top: 20px; margin-bottom: 8px;">
        © 2024 SpeechHelp. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
      `;

      // Send email to hello@speechhelp.ai
      await sendSMTPEmail(
        smtpHost,
        smtpPort,
        smtpUser,
        smtpPassword,
        'hello@speechhelp.ai',
        `New Contact Form Submission from ${name}`,
        htmlContent
      );

      log('Contact form email sent successfully to: hello@speechhelp.ai');

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Contact form submitted successfully',
          timestamp: new Date().toISOString()
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
          success: false, 
          message: 'Failed to send contact form - please try again or contact support directly',
          error: emailError.message
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
  } catch (error) {
    log('Error in contact form function:', error);
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
