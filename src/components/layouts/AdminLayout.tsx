
import React, { useState } from 'react';
import { Navigate, Outlet, useLocation, useNavigate, Link } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Button } from '@/components/ui/button';
import { 
  BarChart4, 
  Users, 
  Settings, 
  LogOut, 
  Shield, 
  Database,
  Menu,
  X,
  Home,
  Activity,
  HelpCircle,
  Bell,
  Search,
  User
} from 'lucide-react';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  active?: boolean;
  onClick?: () => void;
}

const NavItem = ({ icon: Icon, label, href, active, onClick }: NavItemProps) => {
  const navigate = useNavigate();
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(href);
    if (onClick) onClick();
  };

  return (
    <SidebarMenuItem>
      <SidebarMenuButton 
        isActive={active}
        onClick={handleClick}
        className={cn(
          "transition-colors",
          active ? "bg-pink-50 text-pink-700" : "hover:bg-pink-50 hover:text-pink-700"
        )}
      >
        <Icon className="h-5 w-5" />
        <span>{label}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

const AdminLayout = () => {
  const { adminUser, isAuthenticated, isLoading, signOut } = useAdminAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // If not authenticated, redirect to admin login
  if (!isLoading && !isAuthenticated) {
    return <Navigate to="/admin/auth" replace />;
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-pink-600 border-t-transparent"></div>
      </div>
    );
  }

  // Define navigation items
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
        {/* Desktop Sidebar */}
        <Sidebar>
          <SidebarHeader className="pb-0">
            <div className="flex items-center space-x-2 px-3 py-2">
              <Link to="/admin/dashboard">
                <img
                  src="/Speech Help - Logo.svg"
                  alt="Speech Help Logo"
                  className="h-8"
                />
              </Link>
              <span className="text-lg font-bold text-pink-600">Admin</span>
            </div>
            <Separator className="mb-2 mt-1" />
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navItems.map((item) => (
                    <NavItem
                      key={item.href}
                      icon={item.icon}
                      label={item.label}
                      href={item.href}
                      active={location.pathname === item.href}
                    />
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <div className="px-3 pb-2">
              <Button
                variant="outline"
                className="w-full justify-start text-gray-600 hover:bg-pink-50 hover:text-pink-700"
                onClick={handleSignOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        {/* Mobile Header and Sidebar */}
        <div className="flex w-full flex-col">
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
                      <Button
                        key={item.href}
                        variant="ghost"
                        className={cn(
                          "flex w-full justify-start",
                          location.pathname === item.href
                            ? "bg-pink-50 text-pink-700"
                            : "text-gray-600 hover:bg-pink-50 hover:text-pink-700"
                        )}
                        onClick={() => {
                          navigate(item.href);
                          setMobileMenuOpen(false);
                        }}
                      >
                        <item.icon className="mr-3 h-5 w-5" />
                        {item.label}
                      </Button>
                    ))}
                    <Separator className="my-2" />
                    <Button
                      variant="ghost"
                      className="flex w-full justify-start text-gray-600 hover:bg-pink-50 hover:text-pink-700"
                      onClick={handleSignOut}
                    >
                      <LogOut className="mr-3 h-5 w-5" />
                      Sign Out
                    </Button>
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
                      <AvatarFallback>{adminUser?.username.charAt(0).toUpperCase() || 'A'}</AvatarFallback>
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
          
          <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
