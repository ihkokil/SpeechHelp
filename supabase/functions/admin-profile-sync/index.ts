import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AdminProfileRequest {
  action: 'get_profile' | 'sync_profile';
  admin_user_id?: string;
  admin_email?: string;
  profile_data?: any;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Admin profile sync function called');
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const body = await req.json() as AdminProfileRequest;
    console.log('Request body:', body);

    const { action, admin_user_id, admin_email } = body;

    if (!action) {
      return new Response(
        JSON.stringify({ success: false, error: 'Action is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (action === 'get_profile') {
      // Get admin user's corresponding user profile
      let email = admin_email;
      
      if (!email && admin_user_id) {
        // Get admin email first
        const { data: adminData, error: adminError } = await supabase
          .from('admin_users')
          .select('email')
          .eq('id', admin_user_id)
          .single();

        if (adminError || !adminData) {
          return new Response(
            JSON.stringify({ success: false, error: 'Admin user not found' }),
            { 
              status: 404, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }
        email = adminData.email;
      }

      if (!email) {
        return new Response(
          JSON.stringify({ success: false, error: 'Email is required' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      // Get corresponding auth user
      const { data: authUser, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) {
        console.error('Error fetching auth users:', authError);
        return new Response(
          JSON.stringify({ success: false, error: 'Failed to fetch auth users' }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      const user = authUser.users.find(u => u.email === email);
      if (!user) {
        return new Response(
          JSON.stringify({ success: false, error: 'User not found in auth' }),
          { 
            status: 404, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      // Get the user's profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError || !profile) {
        return new Response(
          JSON.stringify({ success: false, error: 'Profile not found' }),
          { 
            status: 404, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      const profileData = {
        first_name: profile.first_name,
        last_name: profile.last_name,
        email: user.email,
        phone: profile.phone || '',
        country_code: profile.country_code || 'US',
        street_address: profile.address_street_address || '',
        city: profile.address_city || '',
        state: profile.address_state || '',
        zip_code: profile.address_zip_code || '',
        country: profile.address_country_code || 'US',
        avatar_url: profile.avatar_url || ''
      };

      return new Response(
        JSON.stringify({ 
          success: true, 
          data: profileData 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    return new Response(
      JSON.stringify({ success: false, error: 'Invalid action' }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in admin profile sync function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Internal server error' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});