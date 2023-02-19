import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

type SpeechPayload = {
  userId: string;
  speechId: string;
  speechType: string;
  speechTitle: string;
  content: string;
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

    // Get the request body
    let requestBody;
    try {
      requestBody = await req.text();
      console.log("Raw request body:", requestBody);
      
      // Try to parse as JSON if it's a JSON string
      try {
        const payload = JSON.parse(requestBody);
        console.log("Parsed JSON payload:", payload);
        requestBody = payload;
      } catch (parseError) {
        console.log("Not a JSON string or parsing error:", parseError.message);
        // Keep the raw text if it's not JSON
      }
    } catch (bodyError) {
      console.error("Error reading request body:", bodyError);
      throw new Error("Could not read request body");
    }

    // Normalize the payload - handle both direct JSON objects and string content
    let payload: SpeechPayload;
    
    if (typeof requestBody === 'object' && requestBody !== null) {
      // It's already a JSON object
      payload = requestBody as SpeechPayload;
    } else if (typeof requestBody === 'string') {
      // It's a string, try to extract data from it
      console.log("Trying to extract payload from string content");
      
      // Create a simple payload with just the content
      // Attempt to extract speechId and userId from the URL parameters
      const url = new URL(req.url);
      const speechId = url.searchParams.get('speechId');
      const userId = url.searchParams.get('userId');
      const speechType = url.searchParams.get('speechType');
      const speechTitle = url.searchParams.get('speechTitle');
      
      if (!speechId || !userId) {
        console.error("Missing required URL parameters: speechId and userId");
        throw new Error("Missing speechId or userId in URL parameters");
      }
      
      payload = {
        speechId,
        userId,
        content: requestBody,
        speechType: speechType || 'unknown',
        speechTitle: speechTitle || 'Untitled Speech'
      };
      
      console.log("Created payload from string content:", payload);
    } else {
      console.error("Invalid payload format");
      throw new Error("Invalid payload format");
    }

    // Validate required fields
    if (!payload.userId || !payload.speechId) {
      console.error("Missing required fields: userId or speechId");
      throw new Error("Missing required fields: userId or speechId");
    }

    if (!payload.content) {
      console.error("Missing speech content");
      throw new Error("Missing speech content");
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    console.log(`Updating speech with ID: ${payload.speechId} for user: ${payload.userId}`);
    
    // Update existing speech with the generated content
    const { data, error } = await supabase
      .from('speeches')
      .update({
        content: payload.content,
        updated_at: new Date().toISOString()
      })
      .eq('id', payload.speechId)
      .eq('user_id', payload.userId)
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
