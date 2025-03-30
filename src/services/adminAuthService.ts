
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface AdminCredentials {
  username: string;
  password: string;
}

interface AdminUser {
  id: string;
  username: string;
  email: string;
  is_active: boolean;
  is_super_admin: boolean;
  last_login: string | null;
  allowed_ip_addresses: string[] | null;
}

interface AdminSignInResponse {
  success: boolean;
  user?: AdminUser;
  error?: string;
  requires2FA?: boolean;
}

interface Verify2FAResponse {
  success: boolean;
  error?: string;
}

export const adminAuthService = {
  // Sign in admin user
  async signIn(credentials: AdminCredentials): Promise<AdminSignInResponse> {
    try {
      // Get the client's IP address
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      const { ip } = await ipResponse.json();

      // Verify admin credentials against the admin_users table
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('username', credentials.username)
        .eq('is_active', true)
        .single();

      if (error || !data) {
        return { 
          success: false, 
          error: 'Invalid credentials or account is inactive.' 
        };
      }

      // Check if IP is allowed (if IP restriction is enabled)
      if (data.allowed_ip_addresses && data.allowed_ip_addresses.length > 0) {
        if (!data.allowed_ip_addresses.includes(ip)) {
          // Log failed login attempt
          await this.logActivity({
            adminUserId: data.id,
            action: 'FAILED_LOGIN',
            entityType: 'ADMIN_USER',
            entityId: data.id,
            details: { reason: 'IP address not allowed', ip },
            ipAddress: ip
          });
          
          return { 
            success: false, 
            error: 'Access denied from current IP address.' 
          };
        }
      }

      // Verify password using PostgreSQL's crypt function
      const { data: passwordCheck, error: passwordError } = await supabase
        .rpc('verify_admin_password', {
          p_username: credentials.username,
          p_password: credentials.password
        });

      if (passwordError || !passwordCheck) {
        // Update failed login attempts
        await supabase
          .from('admin_users')
          .update({ 
            failed_login_attempts: data.failed_login_attempts + 1 
          })
          .eq('id', data.id);

        // Log failed login attempt
        await this.logActivity({
          adminUserId: data.id,
          action: 'FAILED_LOGIN',
          entityType: 'ADMIN_USER',
          entityId: data.id,
          details: { reason: 'Invalid password' },
          ipAddress: ip
        });

        return { 
          success: false, 
          error: 'Invalid credentials.' 
        };
      }

      // Check if 2FA is enabled for this admin
      const { data: twoFactorData } = await supabase
        .from('admin_2fa')
        .select('is_enabled')
        .eq('admin_user_id', data.id)
        .single();

      // Reset failed login attempts on successful password verification
      await supabase
        .from('admin_users')
        .update({ 
          failed_login_attempts: 0,
          last_login: twoFactorData?.is_enabled ? null : new Date().toISOString()
        })
        .eq('id', data.id);

      // If 2FA is enabled, require verification
      if (twoFactorData?.is_enabled) {
        // Log 2FA prompt
        await this.logActivity({
          adminUserId: data.id,
          action: 'TWO_FACTOR_PROMPT',
          entityType: 'ADMIN_USER',
          entityId: data.id,
          ipAddress: ip
        });
        
        return { 
          success: true, 
          requires2FA: true,
          user: data
        };
      }

      // Log successful login
      await this.logActivity({
        adminUserId: data.id,
        action: 'LOGIN',
        entityType: 'ADMIN_USER',
        entityId: data.id,
        ipAddress: ip
      });

      return { 
        success: true, 
        user: data
      };
    } catch (err: any) {
      console.error('Admin sign in error:', err);
      return { 
        success: false, 
        error: 'An unexpected error occurred. Please try again later.' 
      };
    }
  },

  // Verify 2FA code
  async verify2FA(userId: string, code: string): Promise<Verify2FAResponse> {
    try {
      // Get the client's IP address
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      const { ip } = await ipResponse.json();

      // Call a separate function to verify 2FA code
      const { data, error } = await supabase
        .rpc('verify_admin_2fa', {
          p_admin_user_id: userId,
          p_code: code
        });

      if (error || !data) {
        await this.logActivity({
          adminUserId: userId,
          action: 'FAILED_TWO_FACTOR',
          entityType: 'ADMIN_USER',
          entityId: userId,
          details: { reason: 'Invalid 2FA code' },
          ipAddress: ip
        });
        
        return { 
          success: false, 
          error: 'Invalid verification code.' 
        };
      }

      // Update last_login time
      await supabase
        .from('admin_users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', userId);

      // Log successful 2FA verification
      await this.logActivity({
        adminUserId: userId,
        action: 'TWO_FACTOR_SUCCESS',
        entityType: 'ADMIN_USER',
        entityId: userId,
        ipAddress: ip
      });

      return { success: true };
    } catch (err: any) {
      console.error('2FA verification error:', err);
      return { 
        success: false, 
        error: 'An unexpected error occurred. Please try again later.' 
      };
    }
  },

  // Request password reset
  async requestPasswordReset(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Check if admin exists with this email
      const { data, error } = await supabase
        .from('admin_users')
        .select('id, email')
        .eq('email', email)
        .single();

      if (error || !data) {
        return { 
          success: false, 
          error: 'No admin account found with this email.' 
        };
      }

      // Generate reset token and send email
      // This would be implemented as a secure edge function
      const { data: resetData, error: resetError } = await supabase
        .rpc('generate_admin_reset_token', {
          p_email: email
        });

      if (resetError) {
        return { 
          success: false, 
          error: 'Unable to process password reset request.' 
        };
      }

      // Log password reset request
      await this.logActivity({
        adminUserId: data.id,
        action: 'PASSWORD_RESET_REQUEST',
        entityType: 'ADMIN_USER',
        entityId: data.id
      });

      return { success: true };
    } catch (err: any) {
      console.error('Password reset request error:', err);
      return { 
        success: false, 
        error: 'An unexpected error occurred. Please try again later.' 
      };
    }
  },

  // Sign out admin user
  async signOut(adminUserId: string): Promise<void> {
    try {
      // Log sign out
      await this.logActivity({
        adminUserId,
        action: 'LOGOUT',
        entityType: 'ADMIN_USER',
        entityId: adminUserId
      });

      // Clear session storage
      sessionStorage.removeItem('adminSession');
      localStorage.removeItem('adminSession');
    } catch (err) {
      console.error('Admin sign out error:', err);
    }
  },

  // Log admin activity
  async logActivity({
    adminUserId,
    action,
    entityType,
    entityId = null,
    details = null,
    ipAddress = null
  }: {
    adminUserId: string;
    action: string;
    entityType: string;
    entityId?: string | null;
    details?: any;
    ipAddress?: string | null;
  }): Promise<void> {
    try {
      // Get user agent
      const userAgent = navigator.userAgent;

      await supabase
        .from('admin_activity_logs')
        .insert({
          admin_user_id: adminUserId,
          action,
          entity_type: entityType,
          entity_id: entityId,
          ip_address: ipAddress,
          user_agent: userAgent,
          details
        });
    } catch (err) {
      console.error('Log activity error:', err);
    }
  }
};
