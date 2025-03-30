
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        ...corsHeaders,
      },
    });
  }

  try {
    // Create a Supabase client with the Admin key
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing environment variables for Supabase client");
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // This is a protected admin operation
    console.log("Attempting to delete all admin users");
    
    // Delete all admin users from the table
    const { error } = await supabase
      .from('admin_users')
      .delete()
      .neq('id', 'placeholder'); // Delete all rows
    
    if (error) {
      throw error;
    }
    
    console.log("Successfully deleted all admin users");
    
    return new Response(
      JSON.stringify({ success: true, message: "All admin users have been deleted" }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error resetting admin users:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "An error occurred while resetting admin users",
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
        status: 500,
      }
    );
  }
});
