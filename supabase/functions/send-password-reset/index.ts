
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

    // Use Supabase's built-in password reset
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: resetUrl
    });

    if (error) {
      log('Error sending password reset:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to send password reset email' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    log('Password reset email sent successfully via Supabase');

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
