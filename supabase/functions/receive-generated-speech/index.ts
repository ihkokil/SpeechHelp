
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Received request to /receive-generated-speech");
    console.log("Request method:", req.method);
    console.log("Request headers:", Object.fromEntries(req.headers.entries()));

    // Extract URL parameters for speechId and userId
    const url = new URL(req.url);
    const speechId = url.searchParams.get('speechId');
    const userId = url.searchParams.get('userId');
    const speechType = url.searchParams.get('speechType');
    const speechTitle = url.searchParams.get('speechTitle');
    
    console.log("URL parameters:", { speechId, userId, speechType, speechTitle });

    // Get the request body
    let content;
    try {
      const requestBody = await req.text();
      console.log("Raw request body:", requestBody);
      
      // Check if the body is JSON
      try {
        const jsonBody = JSON.parse(requestBody);
        console.log("Parsed JSON body:", jsonBody);
        
        // Handle different payload structures
        if (jsonBody.content) {
          // Direct content field
          content = jsonBody.content;
        } else if (typeof jsonBody === 'string') {
          // Body is just a JSON string
          content = jsonBody;
        } else {
          // Try to extract content from any available field
          const possibleContentFields = Object.values(jsonBody);
          const textContent = possibleContentFields.find(val => typeof val === 'string' && val.length > 100);
          if (textContent) {
            content = textContent;
          } else {
            // If all else fails, use the stringified JSON
            content = JSON.stringify(jsonBody);
          }
        }
      } catch (jsonError) {
        // Not JSON, use raw text
        console.log("Body is not JSON, using as raw text");
        content = requestBody;
      }
    } catch (bodyError) {
      console.error("Error reading request body:", bodyError);
      throw new Error("Could not read request body");
    }

    console.log("Extracted content:", content ? content.substring(0, 100) + "..." : "No content");

    // Validate required parameters
    if (!speechId || !userId) {
      console.error("Missing required URL parameters: speechId and userId");
      throw new Error("Missing speechId or userId in URL parameters");
    }

    if (!content || typeof content !== 'string' || content.trim() === '') {
      console.error("Missing or invalid speech content");
      throw new Error("Missing or invalid speech content");
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    console.log(`Updating speech with ID: ${speechId} for user: ${userId}`);
    
    // Update existing speech with the generated content
    const { data, error } = await supabase
      .from('speeches')
      .update({
        content: content,
        updated_at: new Date().toISOString()
      })
      .eq('id', speechId)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) {
      console.error("Error updating speech:", error);
      throw error;
    }

    console.log("Speech updated successfully:", data?.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Speech updated successfully", 
        speechId: data?.id 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error("Error in receive-generated-speech function:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: error.message 
      }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
