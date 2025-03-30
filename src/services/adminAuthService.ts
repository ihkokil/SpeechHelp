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
  // Create default admin user (for initial setup)
  async createDefaultAdmin(): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('Attempting to create default admin user');
      
      const { error, data } = await supabase.functions.invoke('admin-auth', {
        body: { 
          action: 'create_admin',
          username: 'speechhelpmaster', 
          password: 'Admin@123', 
          email: 'admin@speechhelp.com',
          is_super_admin: true
        },
      });

      if (error) {
        console.error('Error creating default admin:', error);
        return { success: false, error: error.message };
      }
      
      if (data && !data.success) {
        return { success: false, error: data.error || 'Failed to create admin' };
      }

      console.log('Default admin user created successfully');
      return { success: true };
    } catch (err: any) {
      console.error('Create default admin error:', err);
      return { 
        success: false, 
        error: 'An unexpected error occurred. Please try again later.' 
      };
    }
  },

  // Sign in admin user
  async signIn(credentials: AdminCredentials): Promise<AdminSignInResponse> {
    try {
      // Get the client's IP address
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      const { ip } = await ipResponse.json();

      // Call the admin-auth edge function to verify credentials
      const { error: functionError, data: authResult } = await supabase.functions.invoke('admin-auth', {
        body: { 
          username: credentials.username, 
          password: credentials.password 
        },
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (functionError) {
        console.error('Admin auth function error:', functionError);
        return { 
          success: false, 
          error: 'Authentication service error. Please try again later.' 
        };
      }

      if (!authResult.success) {
        // Log failed login attempt
        await this.logActivity({
          adminUserId: 'unknown',
          action: 'FAILED_LOGIN',
          entityType: 'ADMIN_USER',
          entityId: 'unknown',
          details: { reason: authResult.error || 'Unknown error', ip },
          ipAddress: ip
        });
        
        return { 
          success: false, 
          error: authResult.error || 'Invalid credentials.' 
        };
      }

      // If 2FA is enabled, require verification
      if (authResult.requires2FA) {
        // Log 2FA prompt
        await this.logActivity({
          adminUserId: authResult.user.id,
          action: 'TWO_FACTOR_PROMPT',
          entityType: 'ADMIN_USER',
          entityId: authResult.user.id,
          ipAddress: ip
        });
        
        return { 
          success: true, 
          requires2FA: true,
          user: authResult.user
        };
      }

      // Log successful login
      await this.logActivity({
        adminUserId: authResult.user.id,
        action: 'LOGIN',
        entityType: 'ADMIN_USER',
        entityId: authResult.user.id,
        ipAddress: ip
      });

      // Update last_login time
      await supabase
        .from('admin_users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', authResult.user.id);

      return { 
        success: true, 
        user: authResult.user
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

      // Call the admin-auth edge function to verify 2FA code
      const { error: functionError, data: verificationResult } = await supabase.functions.invoke('admin-auth', {
        body: { 
          adminId: userId, 
          code 
        },
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (functionError || !verificationResult?.success) {
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

      // This would normally call an edge function to generate a reset token
      // and send an email, but for now we'll just log it
      console.log(`Password reset requested for admin: ${data.email}`);
      
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
