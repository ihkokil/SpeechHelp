
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import { corsHeaders } from '../_shared/cors.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL') || 'https://yotrueuqjxmgcwlbbyps.supabase.co'
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
    const { action, userId, data } = await req.json()
    
    // Check if the request has a valid session
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing Authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    // TODO: In a production environment, you'd check if the requesting user has admin privileges
    
    // Handle different actions
    switch(action) {
      case 'fetchUsers': {
        // Fetch users from Auth
        const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers()
        if (authError) {
          throw authError
        }
        
        // Fetch profiles data for each user
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
        
        if (profilesError) {
          throw profilesError
        }
        
        return new Response(
          JSON.stringify({ 
            authUsers: authUsers, 
            profiles: profiles 
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      
      case 'updateUserPermissions': {
        if (!userId || !data) {
          return new Response(
            JSON.stringify({ error: 'Missing required fields' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
        
        // Check if user exists
        const { data: existingUser, error: userError } = await supabase.auth.admin.getUserById(userId)
        if (userError || !existingUser) {
          return new Response(
            JSON.stringify({ error: 'User not found' }),
            { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
        
        // Update user profile with admin fields
        const { is_admin, admin_role, permissions } = data
        
        // Create or update the admin data in the profiles table
        // We'll use RPC (Remote Procedure Call) to execute a function that handles this properly
        const { data: updatedProfile, error: updateError } = await supabase.rpc(
          'update_user_admin_status',
          { 
            user_id: userId, 
            is_admin_status: is_admin || false,
            admin_role_value: admin_role || null,
            permissions_value: permissions || []
          }
        )
        
        if (updateError) {
          console.error('Error updating user permissions:', updateError)
          return new Response(
            JSON.stringify({ error: updateError.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
        
        return new Response(
          JSON.stringify({ success: true, data: updatedProfile }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      
      // Additional action handlers can be added here
      
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
  } catch (error) {
    console.error('Error processing request:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
