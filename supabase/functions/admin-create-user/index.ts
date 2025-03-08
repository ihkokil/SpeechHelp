
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the service role key for admin operations
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing environment variables for Supabase connection');
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    
    const { email, password, firstName, lastName, role, isActive } = await req.json();
    
    console.log('Creating user with admin privileges:', { email, firstName, lastName, role, isActive });
    
    // Create user in Supabase Auth - the trigger will handle profile creation
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        first_name: firstName,
        last_name: lastName,
        full_name: `${firstName} ${lastName}`,
        name: `${firstName} ${lastName}`,
        phone: ''
      }
    });
    
    if (authError) {
      console.error('Error creating user in auth:', authError);
      throw new Error(authError.message || 'Failed to create user in authentication system');
    }
    
    if (!authData.user) {
      throw new Error('No user data returned from authentication system');
    }
    
    console.log('User created in auth successfully:', authData.user.id);
    
    // Wait a moment for the trigger to complete
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Update admin status if needed
    if (role !== 'user') {
      console.log('Setting admin status for user:', authData.user.id);
      const { error: profileError } = await supabase.rpc('update_user_admin_status', {
        user_id: authData.user.id,
        is_admin_status: true,
        admin_role_value: role,
        permissions_value: role === 'admin' 
          ? ['view_users', 'manage_users', 'view_speeches', 'manage_speeches'] 
          : ['view_users']
      });
      
      if (profileError) {
        console.error('Error updating user admin status:', profileError);
        // Don't throw error here as user was created successfully
      }
    }
    
    // Set user active status
    const { error: statusError } = await supabase
      .from('profiles')
      .update({ is_active: isActive })
      .eq('id', authData.user.id);
    
    if (statusError) {
      console.error('Error updating user status:', statusError);
    }
    
    // Return the created user data
    return new Response(
      JSON.stringify({ 
        success: true, 
        user: {
          id: authData.user.id,
          email: authData.user.email,
          created_at: authData.user.created_at,
          updated_at: authData.user.updated_at,
          user_metadata: authData.user.user_metadata,
          is_active: isActive,
          role: role
        }
      }),
      { 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        } 
      }
    );
  } catch (error: any) {
    console.error('Error in admin-create-user function:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Failed to create user'
      }),
      { 
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        } 
      }
    );
  }
});
