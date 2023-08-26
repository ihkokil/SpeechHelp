
import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminAuthService } from '@/services/adminAuthService';
import { toast } from '@/hooks/use-toast';

interface AdminUser {
  id: string;
  username: string;
  email: string;
  is_active: boolean;
  is_super_admin: boolean;
  last_login: string | null;
}

interface AdminAuthContextType {
  adminUser: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (username: string, password: string) => Promise<{
    success: boolean;
    requires2FA?: boolean;
    error?: string;
  }>;
  verify2FA: (code: string) => Promise<{
    success: boolean;
    error?: string;
  }>;
  signOut: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<{
    success: boolean;
    error?: string;
  }>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingUserId, setPendingUserId] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing admin session
    const checkSession = () => {
      setIsLoading(true);
      
      try {
        const storedSession = sessionStorage.getItem('adminSession') || localStorage.getItem('adminSession');
        
        if (storedSession) {
          const session = JSON.parse(storedSession);
          const now = new Date().getTime();
          
          // Check if session is still valid (24 hour expiry)
          if (session.expiresAt && session.expiresAt > now) {
            setAdminUser(session.user);
          } else {
            // Clear expired session
            sessionStorage.removeItem('adminSession');
            localStorage.removeItem('adminSession');
          }
        }
      } catch (error) {
        console.error('Error checking admin session:', error);
        // Clear potentially corrupted session
        sessionStorage.removeItem('adminSession');
        localStorage.removeItem('adminSession');
      }
      
      setIsLoading(false);
    };

    checkSession();
  }, []);

  const signIn = async (username: string, password: string) => {
    setIsLoading(true);
    
    try {
      const result = await adminAuthService.signIn({ username, password });
      
      if (result.success && !result.requires2FA) {
        // Set admin session
        const expiresAt = new Date().getTime() + (24 * 60 * 60 * 1000); // 24 hours
        const sessionData = {
          user: result.user,
          expiresAt
        };
        
        sessionStorage.setItem('adminSession', JSON.stringify(sessionData));
        localStorage.setItem('adminSession', JSON.stringify(sessionData));
        
        setAdminUser(result.user || null);
        toast({
          title: "Login successful",
          description: `Welcome back, ${result.user?.username}!`,
        });
      } else if (result.success && result.requires2FA) {
        // Set pending user for 2FA verification
        setPendingUserId(result.user?.id || null);
      }
      
      setIsLoading(false);
      return result;
    } catch (error) {
      console.error('Admin sign in error:', error);
      setIsLoading(false);
      return { 
        success: false, 
        error: 'An unexpected error occurred. Please try again.' 
      };
    }
  };

  const verify2FA = async (code: string) => {
    if (!pendingUserId) {
      return { 
        success: false, 
        error: 'No pending authentication. Please sign in again.' 
      };
    }
    
    setIsLoading(true);
    
    try {
      const result = await adminAuthService.verify2FA(pendingUserId, code);
      
      if (result.success) {
        // Retrieve user information
        const storedData = sessionStorage.getItem('tempAdminUser');
        let user = null;
        
        if (storedData) {
          user = JSON.parse(storedData);
          sessionStorage.removeItem('tempAdminUser');
        }
        
        // Set admin session
        const expiresAt = new Date().getTime() + (24 * 60 * 60 * 1000); // 24 hours
        const sessionData = {
          user,
          expiresAt
        };
        
        sessionStorage.setItem('adminSession', JSON.stringify(sessionData));
        localStorage.setItem('adminSession', JSON.stringify(sessionData));
        
        setAdminUser(user);
        setPendingUserId(null);
        
        toast({
          title: "Verification successful",
          description: `Welcome back, ${user?.username}!`,
        });
      }
      
      setIsLoading(false);
      return result;
    } catch (error) {
      console.error('2FA verification error:', error);
      setIsLoading(false);
      return { 
        success: false, 
        error: 'An unexpected error occurred. Please try again.' 
      };
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    
    try {
      if (adminUser) {
        await adminAuthService.signOut(adminUser.id);
      }
      
      // Clear session
      sessionStorage.removeItem('adminSession');
      localStorage.removeItem('adminSession');
      
      setAdminUser(null);
      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
      });
    } catch (error) {
      console.error('Admin sign out error:', error);
    }
    
    setIsLoading(false);
  };

  const requestPasswordReset = async (email: string) => {
    setIsLoading(true);
    
    try {
      const result = await adminAuthService.requestPasswordReset(email);
      
      if (result.success) {
        toast({
          title: "Password reset link sent",
          description: "Please check your email for instructions to reset your password.",
        });
      }
      
      setIsLoading(false);
      return result;
    } catch (error) {
      console.error('Password reset request error:', error);
      setIsLoading(false);
      return { 
        success: false, 
        error: 'An unexpected error occurred. Please try again.' 
      };
    }
  };

  return (
    <AdminAuthContext.Provider
      value={{
        adminUser,
        isAuthenticated: !!adminUser,
        isLoading,
        signIn,
        verify2FA,
        signOut,
        requestPasswordReset
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  
  return context;
};
