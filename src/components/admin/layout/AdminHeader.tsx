
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, LogOut, Menu, Search, Settings, User, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import NavItem from '../navigation/NavItem';

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
  const { adminUser, signOut } = useAdminAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/auth');
  };

  return (
    <header className="flex h-16 w-full items-center justify-between border-b bg-white px-4 lg:px-6">
      <div className="flex items-center space-x-4">
        <SidebarTrigger className="hidden md:flex" />
        
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
            <div className="flex h-16 items-center justify-between border-b px-4">
              <div className="flex items-center space-x-2">
                <Link to="/admin/dashboard">
                  <img
                    src="/Speech Help - Logo.svg"
                    alt="Speech Help Logo"
                    className="h-8"
                  />
                </Link>
                <span className="text-lg font-bold text-pink-600">Admin</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
            <div className="flex flex-col gap-1 p-4">
              {navItems.map((item) => (
                <NavItem
                  key={item.href}
                  {...item}
                  onClick={() => setMobileMenuOpen(false)}
                />
              ))}
            </div>
          </SheetContent>
        </Sheet>
        
        <div className="md:hidden">
          <Link to="/admin/dashboard">
            <img
              src="/Speech Help - Logo.svg"
              alt="Speech Help Logo"
              className="h-8"
            />
          </Link>
        </div>
        
        <div className="hidden md:flex">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-[200px] pl-8 lg:w-[300px]"
            />
          </div>
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
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={adminUser?.email ? `https://gravatar.com/avatar/${btoa(adminUser.email)}?d=mp` : undefined} alt={adminUser?.username || 'Admin'} />
                <AvatarFallback>{adminUser?.username?.charAt(0).toUpperCase() || 'A'}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" forceMount>
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="flex flex-col space-y-1 leading-none">
                <p className="font-medium">{adminUser?.username}</p>
                <p className="text-xs text-gray-500">{adminUser?.email}</p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/admin/profile')}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/admin/settings')}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default AdminHeader;
