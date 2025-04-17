
import React, { useState } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { 
  BarChart4, 
  Users, 
  Settings, 
  Database,
  Shield,
  Home,
  Activity,
  HelpCircle,
} from 'lucide-react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { SidebarProvider } from '@/components/ui/sidebar';
import AdminHeader from '../admin/layout/AdminHeader';
import AdminSidebar from '../admin/layout/AdminSidebar';

const AdminLayout = () => {
  const { adminUser, isAuthenticated, isLoading, signOut } = useAdminAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  if (!isLoading && !isAuthenticated) {
    return <Navigate to="/admin/auth" replace />;
  }

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-pink-600 border-t-transparent"></div>
      </div>
    );
  }

  const navItems = [
    { icon: Home, label: 'Dashboard', href: '/admin/dashboard' },
    { icon: Users, label: 'User Management', href: '/admin/users' },
    { icon: Database, label: 'Data Management', href: '/admin/data' },
    { icon: BarChart4, label: 'Analytics', href: '/admin/analytics' },
    { icon: Activity, label: 'Activity Logs', href: '/admin/logs' },
    { icon: Shield, label: 'Security', href: '/admin/security' },
    { icon: Settings, label: 'Settings', href: '/admin/settings' },
    { icon: HelpCircle, label: 'Help & Support', href: '/admin/support' },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/auth');
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gray-50">
        <AdminSidebar 
          navItems={navItems}
          onSignOut={handleSignOut}
        />

        <div className="flex w-full flex-col">
          <AdminHeader
            navItems={navItems}
            mobileMenuOpen={mobileMenuOpen}
            setMobileMenuOpen={setMobileMenuOpen}
          />
          
          <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
