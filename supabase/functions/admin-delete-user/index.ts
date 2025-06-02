
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Create admin client with service role key for elevated permissions
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Get the user ID and admin user ID from the request body
    const { userId, adminUserId } = await req.json()
    
    if (!userId) {
      return new Response(
        JSON.stringify({ success: false, error: 'User ID is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (!adminUserId) {
      return new Response(
        JSON.stringify({ success: false, error: 'Admin user ID is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('Admin delete request from:', adminUserId, 'for user:', userId)

    // Verify that the requesting user is an admin
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('is_admin')
      .eq('id', adminUserId)
      .single()

    if (profileError) {
      console.error('Error checking admin status:', profileError)
      return new Response(
        JSON.stringify({ success: false, error: 'Unable to verify admin permissions' }),
        { 
          status: 403, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (!profile?.is_admin) {
      console.error('User is not an admin:', adminUserId)
      return new Response(
        JSON.stringify({ success: false, error: 'Insufficient permissions' }),
        { 
          status: 403, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('Admin verified, proceeding with user deletion for user:', userId)

    // First, check if the user exists
    const { data: existingUser, error: checkError } = await supabaseAdmin.auth.admin.getUserById(userId)
    
    if (checkError) {
      console.error('Error checking user existence:', checkError)
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'User not found or error checking user: ' + checkError.message 
        }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (!existingUser.user) {
      console.log('User not found in auth.users:', userId)
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'User not found in authentication system' 
        }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('User found, proceeding with deletion from auth.users:', userId)

    // Delete the user from auth.users using admin client
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId)
    
    if (deleteError) {
      console.error('Error deleting user from auth.users:', deleteError)
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Failed to delete user: ' + (deleteError.message || 'Unknown error') 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('User successfully deleted from auth.users:', userId)

    // Log the admin action
    try {
      await supabaseAdmin
        .from('activity_logs')
        .insert({
          admin_id: adminUserId,
          action: 'DELETE_USER',
          entity_type: 'USER',
          entity_id: userId,
          details: {
            deleted_user_id: userId,
            deleted_by_admin: adminUserId,
            timestamp: new Date().toISOString()
          }
        })
    } catch (logError) {
      console.warn('Failed to log admin action (non-critical):', logError)
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'User deleted successfully from authentication system',
        userId: userId,
        deletedBy: adminUserId
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Unexpected error in admin-delete-user function:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Internal server error: ' + (error.message || 'Unknown error') 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
