
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailSpeechRequest {
  title: string;
  content: string;
  recipientEmail: string;
  cc?: string[];
  bcc?: string[];
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { title, content, recipientEmail, cc, bcc }: EmailSpeechRequest = await req.json();

    if (!title || !content || !recipientEmail) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { 
          status: 400, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        }
      );
    }

    // Clean content to remove any markdown formatting for email
    const cleanContent = content
      .replace(/^#+ (.+)$/gm, '$1') // Remove headings
      .replace(/\*\*(.+?)\*\*/g, '$1') // Remove bold
      .replace(/\*(.+?)\*/g, '$1') // Remove italic
      .replace(/---/g, '') // Remove horizontal rules
      .trim();

    console.log(`Sending email to ${recipientEmail} with title: ${title}`);

    const emailResponse = await resend.emails.send({
      from: "SpeechHelp <hello@speechhelp.ai>",
      to: [recipientEmail],
      ...(cc && cc.length > 0 && { cc }),
      ...(bcc && bcc.length > 0 && { bcc }),
      subject: `Your Speech: ${title}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="background-color: #f6f9fc; font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif; padding: 40px 0; margin: 0;">
          <div style="background-color: #ffffff; border: 1px solid #eee; border-radius: 10px; box-shadow: 0 5px 15px rgba(20, 50, 70, 0.08); margin: 0 auto; max-width: 600px; padding: 40px 30px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <img src="https://yotrueuqjxmgcwlbbyps.supabase.co/storage/v1/object/public/images/SpeechHelp_Logo.png" 
                   alt="SpeechHelp" 
                   style="width: 180px; height: auto; display: block; margin: 0 auto;" />
            </div>
            <h1 style="color: #be185d; font-size: 24px; font-weight: bold; margin: 0 0 20px; text-align: center;">${title}</h1>
            <div style="white-space: pre-wrap; font-family: Georgia, serif; line-height: 1.8; color: #374151; font-size: 16px; padding: 20px; background-color: #f9fafb; border-radius: 8px;">
              ${cleanContent.replace(/\n/g, '<br />')}
            </div>
            <hr style="border: none; border-top: 1px solid #eaeaea; margin: 30px 0;" />
            <p style="color: #9ca3af; font-size: 12px; text-align: center;">
              This speech was generated using SpeechHelp. Visit <a href="https://speechhelp.co" style="color: #be185d;">speechhelp.co</a>
            </p>
          </div>
        </body>
        </html>
      `
    });

    console.log("Email sent response:", emailResponse);

    return new Response(
      JSON.stringify({ success: true, message: "Email sent successfully" }),
      { 
        status: 200, 
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      }
    );
  }
};

serve(handler);
