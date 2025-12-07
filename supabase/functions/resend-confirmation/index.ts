import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.26.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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
      `From: Speech Help <${smtpUser}>`,
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
  log('resend-confirmation function called');
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();
    log('Resending confirmation for email:', email);
    
    if (!email) {
      throw new Error("Missing email");
    }

    // Create Supabase client with service role key
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

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
      return new Response(JSON.stringify({
        success: false,
        error: "SMTP configuration incomplete"
      }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    log('Generating new confirmation link...');

    // Generate a fresh confirmation link
    const { data, error } = await supabaseClient.auth.admin.generateLink({
      type: 'signup',
      email: email,
      options: {
        redirectTo: `${req.headers.get('origin') || 'http://localhost:3000'}/`
      }
    });

    if (error) {
      log('Failed to generate confirmation link:', error.message);
      return new Response(JSON.stringify({
        success: false,
        error: "Failed to generate confirmation link"
      }), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Get user information for personalization
    const { data: userData, error: userError } = await supabaseClient.auth.admin.getUserById(data.user.id);
    const firstName = userData?.user?.user_metadata?.first_name || '';
    const lastName = userData?.user?.user_metadata?.last_name || '';

    // Create email content
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Confirm Your Email - Speech Help</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin-bottom: 10px;">Speech Help</h1>
            <h2 style="color: #64748b; font-weight: normal;">Confirm Your Email Address</h2>
          </div>
          
          <div style="background-color: #f8fafc; padding: 30px; border-radius: 8px; margin-bottom: 30px;">
            ${firstName ? `<p>Hi ${firstName},</p>` : '<p>Hello,</p>'}
            
            <p>Thanks for signing up for Speech Help! To complete your account setup, please confirm your email address by clicking the button below.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${data.properties.action_link}" 
                 style="background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                Confirm Email Address
              </a>
            </div>
            
            <p style="color: #64748b; font-size: 14px;">
              If the button doesn't work, you can also copy and paste this link into your browser:<br>
              <a href="${data.properties.action_link}" style="color: #2563eb; word-break: break-all;">${data.properties.action_link}</a>
            </p>
            
            <p style="color: #64748b; font-size: 14px;">
              This confirmation link will expire in 24 hours. If you didn't create an account with Speech Help, you can safely ignore this email.
            </p>
          </div>
          
          <div style="text-align: center; color: #64748b; font-size: 12px;">
            <p>© 2024 Speech Help. All rights reserved.</p>
          </div>
        </body>
      </html>
    `;

    log('Sending confirmation email via SMTP...');

    try {
      // Send email using SMTP
      await sendSMTPEmail(
        smtpHost,
        smtpPort,
        smtpUser,
        smtpPassword,
        email,
        "Confirm Your Email Address - Speech Help",
        emailHtml
      );

      log('Confirmation email sent successfully via SMTP');
      
      return new Response(JSON.stringify({
        success: true,
        message: "Confirmation email has been resent successfully"
      }), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });

    } catch (emailError) {
      log('Failed to send email via SMTP:', emailError);
      return new Response(JSON.stringify({
        success: false,
        error: "Failed to send confirmation email"
      }), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

  } catch (error) {
    log("Error in resend-confirmation function:", error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});