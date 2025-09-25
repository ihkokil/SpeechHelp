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

    // Get the user ID, new status, and admin user ID from the request body
    const { userId, newStatus, adminUserId } = await req.json()
    
    console.log('🔄 ADMIN TOGGLE USER STATUS REQUEST RECEIVED')
    console.log('📋 Request details:', {
      userId: userId || 'MISSING',
      newStatus: newStatus,
      adminUserId: adminUserId || 'MISSING',
      timestamp: new Date().toISOString()
    })
    
    if (!userId) {
      console.error('❌ User ID is missing from request')
      return new Response(
        JSON.stringify({ success: false, error: 'User ID is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (newStatus === undefined || newStatus === null) {
      console.error('❌ New status is missing from request')
      return new Response(
        JSON.stringify({ success: false, error: 'New status is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (!adminUserId) {
      console.error('❌ Admin user ID is missing from request')
      return new Response(
        JSON.stringify({ success: false, error: 'Admin user ID is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('🔍 STARTING ADMIN VERIFICATION PROCESS')
    console.log('👤 Verifying admin user:', adminUserId)

    // Check if the requesting user is an admin in the admin_users table
    console.log('📞 Checking if admin user exists in admin_users table...')
    const { data: adminUser, error: adminError } = await supabaseAdmin
      .from('admin_users')
      .select('id, email, username, is_active, is_super_admin')
      .eq('id', adminUserId)
      .eq('is_active', true)
      .single()
    
    if (adminError || !adminUser) {
      console.error('❌ Error fetching admin user from admin_users:', adminError?.message || 'User not found')
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Admin user not found or not active',
          details: adminError?.message || 'Admin user not found in admin_users table'
        }),
        { 
          status: 403, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('✅ Admin user found in admin_users table:', {
      id: adminUser.id,
      email: adminUser.email,
      username: adminUser.username,
      is_active: adminUser.is_active,
      is_super_admin: adminUser.is_super_admin
    })

    console.log('🚀 ADMIN VERIFIED - PROCEEDING WITH USER STATUS TOGGLE')
    console.log('🎯 Target user for status change:', userId, 'New status:', newStatus)

    // Check if the target user exists
    console.log('🔍 Checking if target user exists...')
    const { data: targetUser, error: userError } = await supabaseAdmin
      .from('profiles')
      .select('id, is_active, first_name, last_name, username')
      .eq('id', userId)
      .single()
    
    if (userError || !targetUser) {
      console.error('❌ Target user not found:', userError?.message || 'User not found')
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Target user not found',
          details: userError?.message || 'User not found in profiles table'
        }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('✅ Target user found:', {
      id: targetUser.id,
      current_status: targetUser.is_active,
      username: targetUser.username
    })

    // Update the user's active status in the profiles table
    console.log('🔄 Updating user status in profiles table...')
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({ 
        is_active: newStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
    
    if (updateError) {
      console.error('❌ Error updating user status:', updateError)
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Failed to update user status: ' + (updateError.message || 'Unknown error') 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('✅ User status updated successfully:', userId, 'New status:', newStatus)

    // Log the admin action (optional, don't fail if this doesn't work)
    try {
      await supabaseAdmin
        .from('activity_logs')
        .insert({
          admin_id: adminUserId,
          action: newStatus ? 'ACTIVATE_USER' : 'DEACTIVATE_USER',
          entity_type: 'USER',
          entity_id: userId,
          details: {
            target_user_id: userId,
            new_status: newStatus,
            previous_status: targetUser.is_active,
            changed_by_admin: adminUserId,
            admin_email: adminUser.email,
            timestamp: new Date().toISOString()
          }
        })
      console.log('📝 Admin action logged successfully')
    } catch (logError) {
      console.warn('⚠️ Failed to log admin action (non-critical):', logError)
    }

    console.log('🎉 USER STATUS TOGGLE COMPLETED SUCCESSFULLY')
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `User ${newStatus ? 'activated' : 'deactivated'} successfully`,
        userId: userId,
        newStatus: newStatus,
        changedBy: adminUserId,
        adminEmail: adminUser.email
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('💥 UNEXPECTED ERROR in admin-toggle-user-status function:', error)
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