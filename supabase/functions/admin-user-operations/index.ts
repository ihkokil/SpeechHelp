
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.14.0";

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Parse request body
    const { action, userId, userIds, data } = await req.json();

    // Get auth user to verify admin status
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing Authorization header' }), 
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token or user not found' }), 
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user is admin
    const { data: adminCheck } = await supabaseClient
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    if (!adminCheck?.is_admin) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized - Admin access required' }), 
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Handle different actions
    let result;
    switch (action) {
      case 'deleteUser':
        // Delete a single user
        if (!userId) throw new Error('userId is required');
        
        result = await supabaseClient.auth.admin.deleteUser(userId);
        break;
        
      case 'bulkDeleteUsers':
        // Delete multiple users
        if (!userIds || !Array.isArray(userIds)) throw new Error('userIds array is required');
        
        // Use Promise.all to delete users in parallel
        const deletePromises = userIds.map(id => supabaseClient.auth.admin.deleteUser(id));
        result = await Promise.all(deletePromises);
        break;
        
      case 'updateUserStatus':
        // Update user active status
        if (!userId) throw new Error('userId is required');
        if (data?.is_active === undefined) throw new Error('is_active field is required');
        
        // First update the profile
        await supabaseClient
          .from('profiles')
          .update({ is_active: data.is_active })
          .eq('id', userId);
          
        result = { success: true };
        break;
        
      case 'updateUserPermissions':
        // Update user admin permissions
        if (!userId) throw new Error('userId is required');
        if (!data) throw new Error('permission data is required');
        
        await supabaseClient
          .from('profiles')
          .update({
            is_admin: data.is_admin,
            admin_role: data.admin_role,
            permissions: data.permissions
          })
          .eq('id', userId);
          
        result = { success: true };
        break;
        
      case 'extendSubscription':
        // Extend user subscription
        if (!userId) throw new Error('userId is required');
        if (!data?.days) throw new Error('days field is required');
        
        // Get current subscription data
        const { data: profile } = await supabaseClient
          .from('profiles')
          .select('subscription_end_date')
          .eq('id', userId)
          .single();
          
        // Calculate new end date
        const currentDate = new Date();
        let endDate = new Date();
        
        if (profile?.subscription_end_date) {
          endDate = new Date(profile.subscription_end_date);
          if (endDate < currentDate) {
            endDate = new Date();
          }
        }
        
        // Add specified days
        endDate.setDate(endDate.getDate() + data.days);
        
        // Update subscription
        await supabaseClient
          .from('profiles')
          .update({
            subscription_plan: data.plan || 'premium',
            subscription_end_date: endDate.toISOString()
          })
          .eq('id', userId);
          
        result = {
          success: true,
          newEndDate: endDate.toISOString()
        };
        break;
        
      default:
        throw new Error(`Unsupported action: ${action}`);
    }

    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Admin user operations error:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
