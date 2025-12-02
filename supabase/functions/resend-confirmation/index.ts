import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.26.0";
import { Resend } from "npm:resend@4.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  console.log('resend-confirmation function called');
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();
    console.log('Resending confirmation for email:', email);
    
    if (!email) {
      throw new Error("Missing email");
    }

    // Create Supabase client with service role key
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Initialize Resend
    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

    console.log('Generating new confirmation link...');

    // Generate a fresh confirmation link
    const { data, error } = await supabaseClient.auth.admin.generateLink({
      type: 'signup',
      email: email,
      options: {
        redirectTo: `${req.headers.get('origin') || 'http://localhost:3000'}/`
      }
    });

    if (error) {
      console.error('Failed to generate confirmation link:', error.message);
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
      return new Response(JSON.stringify({
        success: false,
        error: "Failed to send confirmation email"
      }), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    console.log('Confirmation email sent successfully:', emailResponse.data);
    
    return new Response(JSON.stringify({
      success: true,
      message: "Confirmation email has been resent successfully"
    }), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error) {
    console.error("Error in resend-confirmation function:", error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});