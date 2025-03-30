
import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type AdminUser = {
  id: string;
  email: string;
  username: string;
  is_super_admin: boolean;
};

type AdminContextType = {
  adminUser: AdminUser | null;
  isLoading: boolean;
  adminLogin: (email: string, password: string) => Promise<void>;
  adminLogout: () => Promise<void>;
  refreshDashboardStats: () => Promise<any>;
  dashboardStats: any;
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider = ({ children }: { children: React.ReactNode }) => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const { toast } = useToast();

  // Load admin session on mount
  useEffect(() => {
    async function loadAdminSession() {
      setIsLoading(true);
      
      // Check if there's a valid admin session in localStorage
      const storedSession = localStorage.getItem('adminSession');
      if (storedSession) {
        try {
          const session = JSON.parse(storedSession);
          const now = new Date();
          
          // Check if the session is still valid (24 hour expiry)
          if (session.expiresAt && new Date(session.expiresAt) > now) {
            setAdminUser(session.user);
          } else {
            localStorage.removeItem('adminSession');
          }
        } catch (error) {
          console.error("Error parsing admin session:", error);
          localStorage.removeItem('adminSession');
        }
      }
      
      setIsLoading(false);
    }
    
    loadAdminSession();
  }, []);

  const refreshDashboardStats = async () => {
    if (!adminUser) return null;
    
    try {
      const { data, error } = await supabase.rpc('get_admin_dashboard_stats');
      
      if (error) {
        console.error('Error fetching dashboard stats:', error);
        return null;
      }
      
      setDashboardStats(data);
      return data;
    } catch (error) {
      console.error('Error in dashboard stats:', error);
      return null;
    }
  };

  const adminLogin = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.rpc('authenticate_admin', {
        email_input: email,
        password_input: password
      });
      
      if (error || !data || data.length === 0) {
        toast({
          title: "Authentication failed",
          description: "Invalid email or password",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }
      
      const adminUser = data[0];
      
      // Create session with 24 hour expiry
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);
      
      const session = {
        user: adminUser,
        expiresAt: expiresAt.toISOString()
      };
      
      localStorage.setItem('adminSession', JSON.stringify(session));
      setAdminUser(adminUser);
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${adminUser.username}!`
      });
      
      // Load initial dashboard stats
      await refreshDashboardStats();
    } catch (error) {
      console.error("Admin login error:", error);
      toast({
        title: "Login failed",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const adminLogout = async () => {
    setIsLoading(true);
    
    try {
      localStorage.removeItem('adminSession');
      setAdminUser(null);
      setDashboardStats(null);
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out"
      });
    } catch (error) {
      console.error("Admin logout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminContext.Provider
      value={{
        adminUser,
        isLoading,
        adminLogin,
        adminLogout,
        refreshDashboardStats,
        dashboardStats
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};
