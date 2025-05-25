
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
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { title, content, recipientEmail }: EmailSpeechRequest = await req.json();

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
      subject: `Your Speech: ${title}`,
      html: `
        <h1>${title}</h1>
        <div style="white-space: pre-wrap; font-family: Arial, sans-serif; line-height: 1.6;">
          ${cleanContent.replace(/\n/g, '<br />')}
        </div>
        <hr />
        <p style="color: #777; font-size: 12px;">
          This speech was generated using SpeechHelp.
        </p>
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
