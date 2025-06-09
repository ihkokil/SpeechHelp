
import React from 'react';
import { Link } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import SearchBar from '../header/SearchBar';
import MobileMenu from '../header/MobileMenu';
import AdminUserMenu from '../header/AdminUserMenu';
import { getLogoPath } from '@/config/logo';

interface AdminHeaderProps {
  navItems: Array<{
    icon: React.ElementType;
    label: string;
    href: string;
  }>;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

const AdminHeader = ({ navItems, mobileMenuOpen, setMobileMenuOpen }: AdminHeaderProps) => {
  const logoPath = getLogoPath();
  
  return (
    <header className="flex h-16 w-full items-center justify-between border-b bg-white px-4 lg:px-6">
      <div className="flex items-center space-x-4">
        <SidebarTrigger className="hidden md:flex" />
        
        <MobileMenu
          open={mobileMenuOpen}
          setOpen={setMobileMenuOpen}
          navItems={navItems}
        />
        
        <div className="md:hidden">
          <Link to="/admin/dashboard">
            <img
              src={logoPath}
              alt="Speech Help Logo"
              className="h-8 w-auto"
            />
          </Link>
        </div>
        
        <div className="hidden md:flex">
          <SearchBar />
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-500 hover:text-gray-700"
        >
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>
        
        <AdminUserMenu />
      </div>
    </header>
  );
};

export default AdminHeader;
