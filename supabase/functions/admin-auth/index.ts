
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.31.0";

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
    const { method } = req.url.split('/').pop() || '';
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    if (method === 'login') {
      const { username, password, ipAddress } = await req.json();
      
      // Validate input
      if (!username || !password) {
        return new Response(
          JSON.stringify({ success: false, message: 'Username and password are required' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        );
      }

      // Get user from database
      const { data: adminUser, error: userError } = await supabase
        .from('admin_users')
        .select('id, username, email, hashed_password, is_active, is_super_admin, allowed_ip_addresses, failed_login_attempts')
        .eq('username', username)
        .single();

      if (userError || !adminUser) {
        console.log('User not found or error:', userError);
        return new Response(
          JSON.stringify({ success: false, message: 'Invalid credentials' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
        );
      }

      // Check if user is active
      if (!adminUser.is_active) {
        return new Response(
          JSON.stringify({ success: false, message: 'Account is deactivated' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
        );
      }

      // Check IP whitelist if available
      if (adminUser.allowed_ip_addresses && adminUser.allowed_ip_addresses.length > 0) {
        if (!adminUser.allowed_ip_addresses.includes(ipAddress)) {
          // Log failed attempt
          await supabase.from('admin_activity_logs').insert({
            admin_user_id: adminUser.id,
            action: 'failed_login',
            entity_type: 'admin_user',
            entity_id: adminUser.id,
            details: { reason: 'IP not whitelisted', ip_address: ipAddress },
            ip_address: ipAddress
          });

          return new Response(
            JSON.stringify({ success: false, message: 'Access denied from this IP address' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
          );
        }
      }

      // Verify password
      let passwordMatch = false;
      
      // Handle legacy placeholder password for first login
      if (adminUser.hashed_password === 'placeholder_hash_to_be_updated' && 
          password === 'BQ2oMf3rdridLEmUurXf') {
        passwordMatch = true;
        
        // Update with a proper hash for subsequent logins
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        await supabase
          .from('admin_users')
          .update({ hashed_password: hashedPassword })
          .eq('id', adminUser.id);
      } else {
        // Normal password comparison
        try {
          passwordMatch = await bcrypt.compare(password, adminUser.hashed_password);
        } catch (error) {
          console.error('Password comparison error:', error);
          passwordMatch = false;
        }
      }

      if (!passwordMatch) {
        // Increment failed login attempts
        await supabase
          .from('admin_users')
          .update({ 
            failed_login_attempts: adminUser.failed_login_attempts + 1 
          })
          .eq('id', adminUser.id);

        // Log failed attempt
        await supabase.from('admin_activity_logs').insert({
          admin_user_id: adminUser.id,
          action: 'failed_login',
          entity_type: 'admin_user',
          entity_id: adminUser.id,
          details: { reason: 'Invalid password' },
          ip_address: ipAddress
        });

        return new Response(
          JSON.stringify({ success: false, message: 'Invalid credentials' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
        );
      }

      // Reset failed login attempts and update last login
      await supabase
        .from('admin_users')
        .update({ 
          failed_login_attempts: 0,
          last_login: new Date().toISOString()
        })
        .eq('id', adminUser.id);

      // Get admin roles and permissions
      const { data: roles } = await supabase
        .from('admin_user_roles')
        .select('role_id, admin_roles(name)')
        .eq('admin_user_id', adminUser.id);

      const roleIds = roles?.map(r => r.role_id) || [];
      
      const { data: permissions } = await supabase
        .from('admin_role_permissions')
        .select('admin_permissions(name)')
        .in('role_id', roleIds);

      const permissionNames = [...new Set(
        permissions?.map(p => p.admin_permissions?.name).filter(Boolean) || []
      )];

      // Create a custom JWT token for the admin
      const { data: tokenData, error: tokenError } = await supabase.auth.admin.createUser({
        email: adminUser.email,
        email_confirm: true,
        user_metadata: {
          is_admin: true,
          admin_id: adminUser.id,
          username: adminUser.username,
          is_super_admin: adminUser.is_super_admin,
          roles: roles?.map(r => r.admin_roles?.name).filter(Boolean) || [],
          permissions: permissionNames
        },
      });

      if (tokenError) {
        console.error('Token creation error:', tokenError);
        return new Response(
          JSON.stringify({ success: false, message: 'Authentication error' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        );
      }

      // Log successful login
      await supabase.from('admin_activity_logs').insert({
        admin_user_id: adminUser.id,
        action: 'login',
        entity_type: 'admin_user',
        entity_id: adminUser.id,
        details: { success: true },
        ip_address: ipAddress
      });

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Login successful', 
          token: tokenData.user.id,
          session: tokenData.session,
          admin: {
            id: adminUser.id,
            username: adminUser.username,
            email: adminUser.email,
            is_super_admin: adminUser.is_super_admin,
            roles: roles?.map(r => r.admin_roles?.name).filter(Boolean) || [],
            permissions: permissionNames
          }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    } else if (method === 'check-2fa') {
      // Implement 2FA verification logic here
      const { adminId, token } = await req.json();
      
      // Get user's 2FA settings
      const { data: twoFaData } = await supabase
        .from('admin_2fa')
        .select('*')
        .eq('admin_user_id', adminId)
        .single();
        
      // Validate 2FA token here
      // This would typically involve using a library like 'otplib'
      // For demo purposes, we'll just return success
      const isValid = true; // Replace with actual token validation
      
      return new Response(
        JSON.stringify({ success: isValid }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else if (method === 'logout') {
      const { adminId } = await req.json();
      
      // Log logout action
      await supabase.from('admin_activity_logs').insert({
        admin_user_id: adminId,
        action: 'logout',
        entity_type: 'admin_user',
        entity_id: adminId,
        details: { success: true }
      });
      
      return new Response(
        JSON.stringify({ success: true, message: 'Logout successful' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      return new Response(
        JSON.stringify({ success: false, message: 'Invalid method' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
  } catch (error) {
    console.error('Admin auth error:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Internal server error', error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
