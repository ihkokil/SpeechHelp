
import React, { useState } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { SidebarProvider } from '@/components/ui/sidebar';
import AdminHeader from '../admin/layout/AdminHeader';
import AdminSidebar from '../admin/layout/AdminSidebar';
import LoadingSpinner from '../admin/layout/LoadingSpinner';
import { adminNavItems } from '@/config/admin-nav';

const AdminLayout = () => {
  const { isAuthenticated, isLoading, signOut } = useAdminAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  if (!isLoading && !isAuthenticated) {
    return <Navigate to="/admin/auth" replace />;
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/auth');
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gray-50">
        <div className="fixed md:relative z-30">
          <AdminSidebar 
            navItems={adminNavItems}
            onSignOut={handleSignOut}
          />
        </div>

        {/* <div className="flex flex-1 flex-col w-full ml-0 md:ml-[calc(var(--sidebar-width)_-_1px)]">
          <AdminHeader
            navItems={adminNavItems}
            mobileMenuOpen={mobileMenuOpen}
            setMobileMenuOpen={setMobileMenuOpen}
          /> */}
          <div className="flex flex-1 flex-col w-full ml-0 md:ml-0">
  <AdminHeader
    navItems={adminNavItems}
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
