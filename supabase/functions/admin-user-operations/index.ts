
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import { corsHeaders } from '../_shared/cors.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Create Supabase client with service role key for admin operations
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // Parse request body
    let requestData;
    try {
      requestData = await req.json();
    } catch (e) {
      console.error('Error parsing request body:', e);
      return new Response(
        JSON.stringify({ error: 'Invalid request body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const { action, userId, data } = requestData;
    
    // Check if the request has a valid session
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('Missing Authorization header');
      return new Response(
        JSON.stringify({ error: 'Missing Authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      console.error('Authentication error:', authError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Check if the requesting user is an admin
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();
    
    if (profileError) {
      console.error('Error fetching profile:', profileError);
      return new Response(
        JSON.stringify({ error: 'Error checking admin status' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    if (!profile?.is_admin) {
      console.error('User is not an admin:', user.id);
      return new Response(
        JSON.stringify({ error: 'Unauthorized - Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing action: ${action} by admin: ${user.id}`);

    switch(action) {
      case 'fetchUsers': {
        // Log the request
        console.log('Fetching users with admin privileges');
        
        // Fetch users from Auth
        const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
        if (authError) {
          console.error('Error fetching auth users:', authError);
          return new Response(
            JSON.stringify({ error: 'Error fetching users' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        // Fetch profiles data
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('*');
        
        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
          return new Response(
            JSON.stringify({ error: 'Error fetching user profiles' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        console.log(`Successfully fetched ${authUsers.users.length} users and ${profiles?.length || 0} profiles`);
        
        return new Response(
          JSON.stringify({ 
            authUsers, 
            profiles 
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      case 'updateUserPermissions': {
        if (!userId || !data) {
          return new Response(
            JSON.stringify({ error: 'Missing userId or data' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        console.log(`Updating permissions for user: ${userId}`, data);
        
        // Update the user's profile with admin permissions data
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            is_admin: data.is_admin,
            admin_role: data.admin_role,
            permissions: data.permissions
          })
          .eq('id', userId);
        
        if (updateError) {
          console.error('Error updating user permissions:', updateError);
          return new Response(
            JSON.stringify({ error: 'Failed to update user permissions' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        return new Response(
          JSON.stringify({ 
            success: true,
            message: 'User permissions updated successfully' 
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
})
