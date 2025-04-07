
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.26.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, admin_user_id, setting_key, setting_value, setting_category, category_filter } = await req.json();

    // Create Supabase client with service role key to bypass RLS
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    if (action === 'upsert_setting') {
      // Upsert the setting using service role to bypass RLS
      const { data, error } = await supabaseAdmin
        .from('admin_settings')
        .upsert({
          admin_user_id,
          setting_key,
          setting_value,
          setting_category,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'admin_user_id,setting_key'
        });

      if (error) {
        console.error('Error upserting admin setting:', error);
        return new Response(JSON.stringify({
          success: false,
          error: error.message
        }), {
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      return new Response(JSON.stringify({
        success: true,
        setting_key,
        setting_value
      }), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    if (action === 'get_settings') {
      // Get settings using service role to bypass RLS
      let query = supabaseAdmin
        .from('admin_settings')
        .select('setting_key, setting_value, setting_category, updated_at')
        .eq('admin_user_id', admin_user_id);

      if (category_filter) {
        query = query.eq('setting_category', category_filter);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching admin settings:', error);
        return new Response(JSON.stringify({
          success: false,
          error: error.message
        }), {
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      return new Response(JSON.stringify(data || []), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    return new Response(JSON.stringify({
      success: false,
      error: 'Invalid action'
    }), {
      status: 400,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error) {
    console.error("Error in admin-settings-helper function:", error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
