
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { adminAuthService } from '@/services/adminAuthService';

export interface AdminUser {
  id: string;
  email: string;
  username: string;
  displayName?: string;
  is_super_admin?: boolean;
}

interface AdminAuthContextType {
  adminUser: AdminUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signIn: (username: string, password: string) => Promise<{ success: boolean; error?: string; requires2FA?: boolean; user?: AdminUser }>;
  signOut: () => Promise<void>;
  logout: () => Promise<void>;
  verify2FA: (code: string) => Promise<{ success: boolean; error?: string }>;
  requestPasswordReset: (email: string) => Promise<{ success: boolean; error?: string }>;
  refreshAdminUser: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

interface AdminAuthProviderProps {
  children: ReactNode;
}

export const AdminAuthProvider: React.FC<AdminAuthProviderProps> = ({ children }) => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is authenticated
  const checkAuth = async () => {
    try {
      // For now, check if we have admin user data in session storage
      const storedUser = sessionStorage.getItem('adminSession') || localStorage.getItem('adminSession');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setAdminUser({
          ...user,
          displayName: user.username || user.email
        });
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setAdminUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Login function (alias for signIn)
  const login = async (email: string, password: string) => {
    return await signIn(email, password);
  };

  // Sign in function
  const signIn = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      const result = await adminAuthService.signIn({ username, password });
      
      if (result.success && result.user) {
        const userWithDisplayName = {
          ...result.user,
          displayName: result.user.username || result.user.email
        };
        setAdminUser(userWithDisplayName);
        
        // Store session data
        sessionStorage.setItem('adminSession', JSON.stringify(userWithDisplayName));
        
        return { 
          success: true, 
          requires2FA: result.requires2FA,
          user: userWithDisplayName
        };
      } else {
        return { success: false, error: result.error || 'Login failed' };
      }
    } catch (error: any) {
      return { success: false, error: error.message || 'Login failed' };
    } finally {
      setIsLoading(false);
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      if (adminUser?.id) {
        await adminAuthService.signOut(adminUser.id);
      }
      setAdminUser(null);
      sessionStorage.removeItem('adminSession');
      localStorage.removeItem('adminSession');
    } catch (error) {
      console.error('Logout error:', error);
      setAdminUser(null);
      sessionStorage.removeItem('adminSession');
      localStorage.removeItem('adminSession');
    }
  };

  // Logout function (alias for signOut)
  const logout = async () => {
    await signOut();
  };

  // Verify 2FA function
  const verify2FA = async (code: string) => {
    try {
      if (!adminUser?.id) {
        return { success: false, error: 'No user session found' };
      }
      
      const result = await adminAuthService.verify2FA(adminUser.id, code);
      return result;
    } catch (error: any) {
      return { success: false, error: error.message || '2FA verification failed' };
    }
  };

  // Request password reset function
  const requestPasswordReset = async (email: string) => {
    try {
      const result = await adminAuthService.requestPasswordReset(email);
      return result;
    } catch (error: any) {
      return { success: false, error: error.message || 'Password reset request failed' };
    }
  };

  // Refresh admin user data
  const refreshAdminUser = async () => {
    try {
      // For now, just reload from session storage
      const storedUser = sessionStorage.getItem('adminSession') || localStorage.getItem('adminSession');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setAdminUser({
          ...user,
          displayName: user.username || user.email
        });
      }
    } catch (error) {
      console.error('Failed to refresh admin user:', error);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const value: AdminAuthContextType = {
    adminUser,
    isLoading,
    isAuthenticated: !!adminUser,
    login,
    signIn,
    signOut,
    logout,
    verify2FA,
    requestPasswordReset,
    refreshAdminUser,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};
