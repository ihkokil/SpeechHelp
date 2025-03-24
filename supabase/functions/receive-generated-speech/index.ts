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

    // Get the request body as plain text first
    let content = '';
    try {
      // Try to read the body as plain text first
      content = await req.text();
      console.log("Raw request body (first 200 chars):", content.substring(0, 200));
      
      // If it looks like JSON, try to parse it
      if (content.trim().startsWith('{') && content.trim().endsWith('}')) {
        try {
          const jsonData = JSON.parse(content);
          console.log("Parsed JSON data keys:", Object.keys(jsonData));
          
          // Check for content in various possible fields
          if (jsonData.content) {
            content = jsonData.content;
            console.log("Found content in json.content field");
          } else if (jsonData.speech) {
            content = jsonData.speech;
            console.log("Found content in json.speech field");
          } else if (jsonData.text) {
            content = jsonData.text;
            console.log("Found content in json.text field");
          } else if (jsonData.data) {
            content = jsonData.data;
            console.log("Found content in json.data field");
          } else if (typeof jsonData === 'string') {
            content = jsonData;
            console.log("JSON data is itself a string");
          }
        } catch (e) {
          console.log("Not valid JSON despite appearance, keeping as plain text");
          // Keep the content as is if JSON parsing fails
        }
      }
    } catch (bodyError) {
      console.error("Error reading request body:", bodyError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "Failed to read request body" 
        }),
        { 
          status: 400, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      );
    }
    
    console.log("Final content to save (first 200 chars):", content.substring(0, 200));

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
