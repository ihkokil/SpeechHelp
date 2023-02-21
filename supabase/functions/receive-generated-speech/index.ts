
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

    // Get the request body - try several approaches to get the content
    let content;
    try {
      // First, let's just try to get the raw body as text
      const rawText = await req.text();
      console.log("Raw request body length:", rawText.length);
      console.log("Raw request body preview:", rawText.substring(0, 200) + (rawText.length > 200 ? "..." : ""));
      
      if (rawText.trim() && rawText.length > 50) {
        // If we have substantial text content, use it directly
        content = rawText;
        console.log("Using raw text as content");
      } else {
        // If raw text is empty or very short, try parsing as JSON
        try {
          // Try to parse original request text as JSON
          const jsonBody = JSON.parse(rawText);
          console.log("Parsed JSON body keys:", Object.keys(jsonBody));
          
          // Check various possible fields where content might be stored
          if (jsonBody.content && typeof jsonBody.content === 'string') {
            content = jsonBody.content;
            console.log("Found content in json.content field");
          } else if (jsonBody.text && typeof jsonBody.text === 'string') {
            content = jsonBody.text;
            console.log("Found content in json.text field");
          } else if (jsonBody.speech && typeof jsonBody.speech === 'string') {
            content = jsonBody.speech;
            console.log("Found content in json.speech field");
          } else if (jsonBody.data && typeof jsonBody.data === 'string') {
            content = jsonBody.data;
            console.log("Found content in json.data field");
          } else if (typeof jsonBody === 'string') {
            content = jsonBody;
            console.log("JSON body is itself a string");
          } else {
            // Look through all string values to find one that looks like speech content
            for (const [key, value] of Object.entries(jsonBody)) {
              if (typeof value === 'string' && value.length > 100) {
                content = value;
                console.log(`Found likely content in json.${key} field`);
                break;
              }
            }
            
            // If we still don't have content, use the stringified JSON
            if (!content) {
              content = JSON.stringify(jsonBody);
              console.log("Using stringified JSON as content");
            }
          }
        } catch (jsonError) {
          console.log("Failed to parse as JSON, error:", jsonError.message);
          // If not valid JSON and text is too short, create a fallback message
          if (!content) {
            content = `We were unable to generate a proper speech. The raw response was: ${rawText}`;
            console.log("Using fallback error message as content");
          }
        }
      }
    } catch (bodyError) {
      console.error("Error reading request body:", bodyError);
      content = "There was an error processing the speech generation response. Please try again.";
    }
    
    console.log("Final extracted content length:", content ? content.length : 0);
    console.log("Content preview:", content ? content.substring(0, 100) + "..." : "No content");

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
