import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Session } from '@supabase/supabase-js';

// Define types for our context
export interface AdminUser {
  id: string;
  username: string;
  email: string;
  is_super_admin: boolean;
  roles: string[];
  permissions: string[];
}

export interface AdminContextType {
  isLoading: boolean;
  adminUser: AdminUser | null;
  session: Session | null;
  login: (username: string, password: string) => Promise<{ requires2FA?: boolean } | void>;
  logout: () => Promise<void>;
  verify2FA: (token: string) => Promise<boolean>;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
}

// Create the context
const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [requires2FA, setRequires2FA] = useState(false);
  const [pendingAdminData, setPendingAdminData] = useState<any>(null);
  const { toast } = useToast();

  // Check for existing session on load
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      
      if (data.session) {
        const user = data.session.user;
        const metadata = user.user_metadata;
        
        if (metadata.is_admin) {
          setAdminUser({
            id: metadata.admin_id,
            username: metadata.username,
            email: user.email || '',
            is_super_admin: metadata.is_super_admin,
            roles: metadata.roles || [],
            permissions: metadata.permissions || []
          });
          setSession(data.session);
        }
      }
      
      setIsLoading(false);
    };
    
    checkSession();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      if (event === 'SIGNED_IN' && newSession) {
        const user = newSession.user;
        const metadata = user.user_metadata;
        
        if (metadata.is_admin) {
          setAdminUser({
            id: metadata.admin_id,
            username: metadata.username,
            email: user.email || '',
            is_super_admin: metadata.is_super_admin,
            roles: metadata.roles || [],
            permissions: metadata.permissions || []
          });
          setSession(newSession);
        }
      } else if (event === 'SIGNED_OUT') {
        setAdminUser(null);
        setSession(null);
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Login function
  const login = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Get client IP address (in a real app, you might need to use a service for this)
      // For demo purposes, we'll just use a placeholder
      const ipAddress = '127.0.0.1';
      
      const response = await supabase.functions.invoke('admin-auth', {
        body: { method: 'login', username, password, ipAddress }
      });
      
      if (response.error) {
        console.error("Login invoke error:", response.error);
        throw new Error(response.error.message || 'Authentication failed');
      }
      
      const data = response.data;
      
      if (!data.success) {
        throw new Error(data.message || 'Authentication failed');
      }
      
      // If 2FA is required, set state and wait for verification
      if (data.requires2FA) {
        setRequires2FA(true);
        setPendingAdminData(data.admin);
        toast({
          title: "2FA Required",
          description: "Please enter your 2FA code",
        });
        return { requires2FA: true };
      }
      
      // Otherwise, set the admin user immediately
      setAdminUser(data.admin);
      setSession(data.session);
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${data.admin.username}!`,
      });
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: error.message || 'Authentication failed',
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Verify 2FA token
  const verify2FA = async (token: string) => {
    try {
      setIsLoading(true);
      
      if (!pendingAdminData) {
        throw new Error("Admin user data not found");
      }
      
      const response = await supabase.functions.invoke('admin-auth', {
        body: { method: 'check-2fa', adminId: pendingAdminData.id, token }
      });
      
      if (response.error) {
        throw new Error(response.error.message);
      }
      
      const data = response.data;
      
      if (!data.success) {
        toast({
          title: "2FA Failed",
          description: "Invalid 2FA code",
          variant: "destructive"
        });
        return false;
      }
      
      setRequires2FA(false);
      setAdminUser(pendingAdminData);
      setPendingAdminData(null);
      
      toast({
        title: "2FA Verified",
        description: "Authentication complete",
      });
      
      return true;
    } catch (error: any) {
      toast({
        title: "2FA Verification Failed",
        description: error.message,
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setIsLoading(true);
      
      if (adminUser) {
        // Log the logout action
        await supabase.functions.invoke('admin-auth', {
          body: { method: 'logout', adminId: adminUser.id }
        });
      }
      
      // Sign out of supabase
      await supabase.auth.signOut();
      
      setAdminUser(null);
      setSession(null);
      setRequires2FA(false);
      setPendingAdminData(null);
      
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });
    } catch (error: any) {
      toast({
        title: "Logout Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Permission check helper
  const hasPermission = (permission: string) => {
    if (!adminUser) return false;
    if (adminUser.is_super_admin) return true;
    return adminUser.permissions.includes(permission);
  };

  // Role check helper
  const hasRole = (role: string) => {
    if (!adminUser) return false;
    if (adminUser.is_super_admin) return true;
    return adminUser.roles.includes(role);
  };

  return (
    <AdminContext.Provider value={{
      isLoading,
      adminUser,
      session,
      login,
      logout,
      verify2FA,
      hasPermission,
      hasRole
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  
  return context;
};
