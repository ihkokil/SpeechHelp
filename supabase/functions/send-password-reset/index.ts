
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { Resend } from 'npm:resend@4.0.0';
import { renderToString } from 'npm:react-dom@18.3.1/server';
import PasswordResetEmail from '../_shared/emails/PasswordResetEmail.tsx';

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

interface PasswordResetRequest {
  email: string;
  resetUrl: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, resetUrl }: PasswordResetRequest = await req.json();

    if (!email || !resetUrl) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: email and resetUrl' }),
        { 
          status: 400, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        }
      );
    }

    console.log(`Sending password reset email to ${email}`);

    // Render the React email template
    const emailHtml = renderToString(
      PasswordResetEmail({ resetUrl, userEmail: email })
    );

    const emailResponse = await resend.emails.send({
      from: 'SpeechHelp <hello@speechhelp.ai>',
      to: [email],
      subject: 'Reset Your SpeechHelp Password',
      html: emailHtml,
    });

    console.log('Password reset email sent response:', emailResponse);

    return new Response(
      JSON.stringify({ success: true, message: 'Password reset email sent successfully' }),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      }
    );
  } catch (error) {
    console.error('Error sending password reset email:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      }
    );
  }
};

serve(handler);
