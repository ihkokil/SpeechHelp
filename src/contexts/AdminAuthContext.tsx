
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { adminAuthService } from '@/services/adminAuthService';

export interface AdminUser {
  id: string;
  email: string;
  username: string;
  displayName?: string; // Add missing displayName property
  is_super_admin?: boolean;
}

interface AdminAuthContextType {
  adminUser: AdminUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
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
      const user = await adminAuthService.getCurrentUser();
      if (user) {
        setAdminUser({
          ...user,
          displayName: user.username || user.email // Set displayName from username or email
        });
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setAdminUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const result = await adminAuthService.signIn(email, password);
      
      if (result.success && result.user) {
        setAdminUser({
          ...result.user,
          displayName: result.user.username || result.user.email // Set displayName
        });
        return { success: true };
      } else {
        return { success: false, error: result.error || 'Login failed' };
      }
    } catch (error: any) {
      return { success: false, error: error.message || 'Login failed' };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await adminAuthService.signOut();
      setAdminUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      setAdminUser(null);
    }
  };

  // Refresh admin user data
  const refreshAdminUser = async () => {
    try {
      const user = await adminAuthService.getCurrentUser();
      if (user) {
        setAdminUser({
          ...user,
          displayName: user.username || user.email // Set displayName
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
    logout,
    refreshAdminUser,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};
