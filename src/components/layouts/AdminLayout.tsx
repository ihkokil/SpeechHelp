
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
        <AdminSidebar 
          navItems={adminNavItems}
          onSignOut={handleSignOut}
        />

        <div className="flex w-full flex-col">
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
