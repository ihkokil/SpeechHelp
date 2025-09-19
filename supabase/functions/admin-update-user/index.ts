
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { 
      user_id, 
      first_name, 
      last_name, 
      email, 
      phone, 
      country_code,
      address_street_address,
      address_city,
      address_state,
      address_zip_code,
      address_country_code,
      is_active,
      subscription_plan,
      subscription_status
    } = await req.json()

    console.log('🔄 Admin updating user:', {
      user_id,
      first_name,
      last_name,
      email,
      phone,
      country_code,
      address_street_address,
      address_city,
      address_state,
      address_zip_code,
      address_country_code,
      is_active,
      subscription_plan,
      subscription_status
    });

    // Update the profiles table
    const { data: profileData, error: profileError } = await supabaseClient
      .from('profiles')
      .update({
        first_name,
        last_name,
        phone,
        country_code,
        address_street_address,
        address_city,
        address_state,
        address_zip_code,
        address_country_code,
        is_active,
        subscription_plan,
        subscription_status,
        updated_at: new Date().toISOString()
      })
      .eq('id', user_id)
      .select()
      .single();

    if (profileError) {
      console.error('❌ Error updating profile:', profileError);
      return new Response(
        JSON.stringify({ success: false, error: profileError.message }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update auth.users email and metadata
    const { error: authError } = await supabaseClient.auth.admin.updateUserById(
      user_id,
      {
        email: email,
        user_metadata: {
          first_name,
          last_name,
          full_name: `${first_name} ${last_name}`.trim(),
          phone,
          country_code,
          street_address: address_street_address,
          city: address_city,
          state: address_state,
          zip_code: address_zip_code,
          country: address_country_code
        }
      }
    );

    if (authError) {
      console.error('❌ Error updating auth user:', authError);
      return new Response(
        JSON.stringify({ success: false, error: authError.message }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('✅ User updated successfully:', user_id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'User updated successfully',
        data: profileData
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('💥 Error in admin-update-user function:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
