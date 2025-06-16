
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu } from '@/components/ui/sidebar';
import NavItem from '../navigation/NavItem';
import { getLogoPath } from '@/config/logo';

interface AdminSidebarProps {
  navItems: Array<{
    icon: React.ElementType;
    label: string;
    href: string;
  }>;
  onSignOut: () => Promise<void>;
}

const AdminSidebar = ({ navItems, onSignOut }: AdminSidebarProps) => {
  const location = useLocation();
  const logoPath = getLogoPath();
  
  return (
    <Sidebar className="bg-white shadow-md z-30">
      <SidebarHeader className="pb-0">
        <div className="flex items-center space-x-2 px-3 py-2">
          <Link to="/admin/dashboard">
            <img
              src={logoPath}
              alt="Speech Help Logo"
              className="h-8 w-auto"
            />
          </Link>
          <span className="text-lg font-bold text-pink-600">Admin</span>
        </div>
        <Separator className="mb-2 mt-1" />
      </SidebarHeader>
      <SidebarContent className="bg-white">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <NavItem
                  key={item.href}
                  {...item}
                  active={location.pathname === item.href}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="bg-white">
        <div className="px-3 pb-2">
          <Button
            variant="outline"
            className="w-full justify-start text-gray-600 hover:bg-pink-50 hover:text-pink-700"
            onClick={onSignOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
