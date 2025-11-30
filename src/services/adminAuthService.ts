
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
      
      const functionResult = await supabase.functions.invoke('admin-auth', {
        body: { 
          action: 'create_admin',
          username: 'speechhelpmaster', 
          password: 'Admin@123', 
          email: 'admin@speechhelp.com',
          is_super_admin: true
        },
      }).catch(error => {
        console.error('Error invoking admin-auth function:', error);
        return { error };
      });
      
      console.log('Response from admin-auth function:', functionResult);
      
      if (functionResult.error) {
        console.error('Error creating default admin:', functionResult.error);
        return { 
          success: false, 
          error: functionResult.error.message || 'Failed to connect to authentication service' 
        };
      }
      
      const responseData = functionResult && 'data' in functionResult ? functionResult.data : null;
      
      if (!responseData) {
        console.error('No data returned from admin-auth function');
        return { 
          success: false, 
          error: 'No response from authentication service' 
        };
      }
      
      if (!responseData.success) {
        console.log('Admin creation failed with error:', responseData.error);
        if (responseData.error && responseData.error.includes('already exists')) {
          console.log('Admin already exists, treating as success');
          return { success: true };
        }
        
        return { 
          success: false, 
          error: responseData.error || 'Failed to create admin' 
        };
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

  // Sign in admin user - now supports both email and username
  async signIn(credentials: AdminCredentials): Promise<AdminSignInResponse> {
    try {
      console.log(`Attempting to sign in user: ${credentials.username}`);
      
      // First, try to authenticate using the admin-auth function
      const functionResult = await supabase.functions.invoke('admin-auth', {
        body: { 
          username: credentials.username, 
          password: credentials.password 
        },
      }).catch(error => {
        console.error('Admin auth function error:', error);
        return { error };
      });

      console.log('Admin auth function response:', functionResult);

      if (functionResult.error) {
        console.error('Admin auth function error:', functionResult.error);
        
        if (functionResult.error.message?.includes('not found') || functionResult.error.message?.includes('404')) {
          return { 
            success: false, 
            error: 'Authentication service is not available. Please check if the Edge Function is deployed.' 
          };
        }
        
        return { 
          success: false, 
          error: 'Authentication service error. Please try again later.' 
        };
      }

      const responseData = functionResult && 'data' in functionResult ? functionResult.data : null;
      
      if (responseData && responseData.success) {
        // If 2FA is enabled, require verification
        if (responseData.requires2FA) {
          await this.logActivity({
            adminUserId: responseData.user.id,
            action: 'TWO_FACTOR_PROMPT',
            entityType: 'ADMIN_USER',
            entityId: responseData.user.id
          });
          
          return { 
            success: true, 
            requires2FA: true,
            user: responseData.user
          };
        }

        // Log successful login
        await this.logActivity({
          adminUserId: responseData.user.id,
          action: 'LOGIN',
          entityType: 'ADMIN_USER',
          entityId: responseData.user.id
        });

        // Update last_login time
        await supabase
          .from('admin_users')
          .update({ last_login: new Date().toISOString() })
          .eq('id', responseData.user.id);

        return { 
          success: true, 
          user: responseData.user
        };
      }

      // If admin-auth function failed, try alternative authentication for users made admin through UI
      console.log('Admin auth function failed, trying alternative authentication for UI-created admins');
      
      // Check if this is a regular user who has been granted admin access
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, is_admin, first_name, last_name, username')
        .eq('is_admin', true)
        .eq('id', (await supabase.auth.getUser()).data.user?.id || 'unknown')
        .single();

      if (profileError) {
        console.log('No admin profile found through user session');
        
        // Try alternative lookup using the username/email provided
        let userEmail = credentials.username;
        
        // If username doesn't contain @, try to find the user by their name
        if (!credentials.username.includes('@')) {
          const { data: userProfiles } = await supabase
            .from('profiles')
            .select('id, first_name, last_name, username')
            .eq('is_admin', true)
            .or(`first_name.ilike.${credentials.username},last_name.ilike.${credentials.username},username.ilike.${credentials.username}`);
          
          if (userProfiles && userProfiles.length > 0) {
            const matchedProfile = userProfiles[0];
            
            // Get the email from profiles for this user
            const { data: userWithEmail } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', matchedProfile.id)
              .single();
              
            if (userWithEmail) {
              // For now, we'll use the username as email if no email is available
              userEmail = credentials.username.includes('@') ? credentials.username : `${matchedProfile.username || 'admin'}@speechhelp.com`;
            }
          } else {
            console.log('No admin profile found for username:', credentials.username);
            return { 
              success: false, 
              error: 'Invalid credentials.' 
            };
          }
        }

        // Try to authenticate with the email
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: userEmail,
          password: credentials.password,
        });

        if (authError || !authData.user) {
          console.log('Password verification failed for user');
          return { 
            success: false, 
            error: 'Invalid credentials.' 
          };
        }

        // Get the profile for this authenticated user
        const { data: userProfile } = await supabase
          .from('profiles')
          .select('id, is_admin, first_name, last_name, username')
          .eq('id', authData.user.id)
          .eq('is_admin', true)
          .single();

        if (!userProfile) {
          await supabase.auth.signOut();
          return { 
            success: false, 
            error: 'User does not have admin privileges.' 
          };
        }

        // Sign out immediately to prevent auto-login to regular app
        await supabase.auth.signOut();

        // Create admin user object from profile data
        const adminUser: AdminUser = {
          id: userProfile.id,
          username: userProfile.username || `${userProfile.first_name} ${userProfile.last_name}`,
          email: authData.user.email || '',
          is_active: true,
          is_super_admin: false,
          last_login: null,
          allowed_ip_addresses: null
        };

        await this.logActivity({
          adminUserId: adminUser.id,
          action: 'LOGIN',
          entityType: 'ADMIN_USER',
          entityId: adminUser.id
        });

        return { 
          success: true, 
          user: adminUser
        };
      }

      console.log('Found admin profile:', profileData);

      // Try to authenticate the user with their regular account using email
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: credentials.username.includes('@') ? credentials.username : `${profileData.username || 'admin'}@speechhelp.com`,
        password: credentials.password,
      });

      if (authError || !authData.user) {
        console.log('Password verification failed for admin user');
        return { 
          success: false, 
          error: 'Invalid credentials.' 
        };
      }

      // Sign out immediately to prevent auto-login to regular app
      await supabase.auth.signOut();

      // Create admin user object from profile data
      const adminUser: AdminUser = {
        id: profileData.id,
        username: profileData.username || `${profileData.first_name} ${profileData.last_name}`,
        email: authData.user.email || '',
        is_active: true,
        is_super_admin: false,
        last_login: null,
        allowed_ip_addresses: null
      };

      await this.logActivity({
        adminUserId: adminUser.id,
        action: 'LOGIN',
        entityType: 'ADMIN_USER',
        entityId: adminUser.id
      });

      return { 
        success: true, 
        user: adminUser
      };

    } catch (err: any) {
      console.error('Admin sign in error:', err);
      return { 
        success: false, 
        error: 'An unexpected error occurred. Please try again later.' 
      };
    }
  },

  async verify2FA(userId: string, code: string): Promise<Verify2FAResponse> {
    try {
      const functionResult = await supabase.functions.invoke('admin-auth', {
        body: { 
          adminId: userId, 
          code 
        },
      }).catch(error => {
        console.error('Error invoking 2FA verification:', error);
        return { error };
      });

      const responseData = 'data' in functionResult ? functionResult.data : null;
      
      if (functionResult.error || !responseData?.success) {
        await this.logActivity({
          adminUserId: userId,
          action: 'FAILED_TWO_FACTOR',
          entityType: 'ADMIN_USER',
          entityId: userId,
          details: { reason: 'Invalid 2FA code' }
        });
        
        return { 
          success: false, 
          error: responseData?.error || 'Invalid verification code.' 
        };
      }

      // Update last_login time
      await supabase
        .from('admin_users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', userId);

      await this.logActivity({
        adminUserId: userId,
        action: 'TWO_FACTOR_SUCCESS',
        entityType: 'ADMIN_USER',
        entityId: userId
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

  async requestPasswordReset(email: string): Promise<{ success: boolean; error?: string }> {
    try {
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

      console.log(`Password reset requested for admin: ${data.email}`);
      
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

  async signOut(adminUserId: string): Promise<void> {
    try {
      await this.logActivity({
        adminUserId,
        action: 'LOGOUT',
        entityType: 'ADMIN_USER',
        entityId: adminUserId
      });

      sessionStorage.removeItem('adminSession');
      localStorage.removeItem('adminSession');
    } catch (err) {
      console.error('Admin sign out error:', err);
    }
  },

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
  },

  // Verify admin password
  async verifyAdminPassword(username: string, password: string): Promise<boolean> {
    try {
      const { data, error } = await supabase.functions.invoke('admin-auth', {
        body: {
          username,
          password
        }
      });

      if (error) {
        console.error('Error verifying admin password:', error);
        return false;
      }

      return data?.success === true;
    } catch (error) {
      console.error('Error verifying admin password:', error);
      return false;
    }
  }
};
