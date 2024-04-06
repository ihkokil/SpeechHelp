
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
    
    // Check if the requesting user is an admin
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()
    
    if (profileError || !profile?.is_admin) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized - Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    switch(action) {
      case 'fetchUsers': {
        // Log the request
        console.log('Fetching users with admin privileges')
        
        // Fetch users from Auth
        const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers()
        if (authError) {
          console.error('Error fetching auth users:', authError)
          throw authError
        }
        
        // Fetch profiles data
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
        
        if (profilesError) {
          console.error('Error fetching profiles:', profilesError)
          throw profilesError
        }
        
        return new Response(
          JSON.stringify({ 
            authUsers, 
            profiles 
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      
      case 'updateUserPermissions': {
        if (!userId || !data) {
          return new Response(
            JSON.stringify({ error: 'Missing userId or data' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
        
        // Update the user's profile with admin permissions data
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            is_admin: data.is_admin,
            admin_role: data.admin_role,
            permissions: data.permissions
          })
          .eq('id', userId)
        
        if (updateError) {
          console.error('Error updating user permissions:', updateError)
          throw updateError
        }
        
        return new Response(
          JSON.stringify({ 
            success: true,
            message: 'User permissions updated successfully' 
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      
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
