
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
      console.error('User ID is missing from request')
      return new Response(
        JSON.stringify({ success: false, error: 'User ID is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (!adminUserId) {
      console.error('Admin user ID is missing from request')
      return new Response(
        JSON.stringify({ success: false, error: 'Admin user ID is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('Admin delete request from:', adminUserId, 'for user:', userId)

    // Check if the requesting user exists in auth.users and get their admin status
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.getUserById(adminUserId)
    
    if (authError || !authUser.user) {
      console.error('Admin user not found in auth.users:', authError)
      return new Response(
        JSON.stringify({ success: false, error: 'Admin user not found in authentication system' }),
        { 
          status: 403, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Check if admin user has a profile with admin privileges, or check admin_users table
    let isAdmin = false;
    
    // First check the profiles table
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('is_admin')
      .eq('id', adminUserId)
      .single()

    if (profile?.is_admin) {
      isAdmin = true;
    } else {
      // If no profile or not admin in profiles, check admin_users table
      const { data: adminUser, error: adminUserError } = await supabaseAdmin
        .from('admin_users')
        .select('is_active, is_super_admin')
        .eq('id', adminUserId)
        .single()
      
      if (adminUser?.is_active) {
        isAdmin = true;
      }
    }

    if (!isAdmin) {
      console.error('User is not an admin:', adminUserId)
      return new Response(
        JSON.stringify({ success: false, error: 'Insufficient permissions - user is not an admin' }),
        { 
          status: 403, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('Admin verified, proceeding with user deletion for user:', userId)

    // Step 1: Delete user's speeches first (this is what's causing the foreign key constraint)
    console.log('Deleting user speeches...')
    const { error: speechesError } = await supabaseAdmin
      .from('speeches')
      .delete()
      .eq('user_id', userId)
    
    if (speechesError) {
      console.error('Error deleting user speeches:', speechesError)
      // Don't return here, continue with cleanup
    } else {
      console.log('User speeches deleted successfully')
    }

    // Step 2: Delete user's payment methods
    console.log('Deleting user payment methods...')
    const { error: paymentMethodsError } = await supabaseAdmin
      .from('payment_methods')
      .delete()
      .eq('user_id', userId)
    
    if (paymentMethodsError) {
      console.warn('Error deleting user payment methods (non-critical):', paymentMethodsError)
    }

    // Step 3: Delete user's payment history
    console.log('Deleting user payment history...')
    const { error: paymentHistoryError } = await supabaseAdmin
      .from('payment_history')
      .delete()
      .eq('user_id', userId)
    
    if (paymentHistoryError) {
      console.warn('Error deleting user payment history (non-critical):', paymentHistoryError)
    }

    // Step 4: Delete user's 2FA settings
    console.log('Deleting user 2FA settings...')
    const { error: twoFAError } = await supabaseAdmin
      .from('user_2fa')
      .delete()
      .eq('user_id', userId)
    
    if (twoFAError) {
      console.warn('Error deleting user 2FA settings (non-critical):', twoFAError)
    }

    // Step 5: Delete the user's profile
    console.log('Deleting user profile...')
    const { error: profileDeleteError } = await supabaseAdmin
      .from('profiles')
      .delete()
      .eq('id', userId)
    
    if (profileDeleteError) {
      console.error('Error deleting user profile:', profileDeleteError)
      // Continue anyway, the auth deletion might still work
    } else {
      console.log('User profile deleted successfully')
    }

    // Step 6: Finally, delete the user from auth.users
    console.log('Deleting user from auth.users...')
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId)
    
    if (deleteError) {
      console.error('Error deleting user from auth.users:', deleteError)
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Failed to delete user from authentication: ' + (deleteError.message || 'Unknown error') 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('User successfully deleted from auth.users:', userId)

    // Log the admin action (optional, don't fail if this doesn't work)
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
        message: 'User and all related data deleted successfully',
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
