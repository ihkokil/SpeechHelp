
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

type SpeechPayload = {
  userId: string;
  speechId?: string;
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
    // Get payload from Make.com
    const payload: SpeechPayload = await req.json();
    console.log("Received speech payload:", payload);

    // Validate required fields
    if (!payload.userId || !payload.speechType || !payload.speechTitle || !payload.content) {
      throw new Error("Missing required fields");
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    let speechId;
    let data;
    let error;

    // Check if a specific speechId was provided (for updating an existing speech)
    if (payload.speechId) {
      // Update existing speech
      ({ data, error } = await supabase
        .from('speeches')
        .update({
          title: payload.speechTitle,
          content: payload.content,
          updated_at: new Date().toISOString()
        })
        .eq('id', payload.speechId)
        .eq('user_id', payload.userId)
        .select()
        .single());
      
      speechId = payload.speechId;
    } else {
      // Insert new speech
      ({ data, error } = await supabase
        .from('speeches')
        .insert({
          user_id: payload.userId,
          title: payload.speechTitle,
          content: payload.content,
          speech_type: payload.speechType
        })
        .select()
        .single());
      
      speechId = data?.id;
    }

    if (error) {
      console.error("Error saving speech:", error);
      throw error;
    }

    console.log("Speech saved successfully:", speechId);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Speech saved successfully", 
        speechId: speechId 
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
