
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAdmin } from '@/contexts/AdminContext';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboardIcon,
  UsersIcon,
  BarChartIcon,
  Settings2Icon,
  LogOutIcon,
  MenuIcon,
  XIcon,
  HomeIcon,
  AlertTriangleIcon
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const AdminLayout = () => {
  const { adminUser, adminLogout } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    // Redirect to login if not authenticated
    if (!adminUser && isMounted) {
      navigate('/admin/login');
    }
  }, [adminUser, navigate, isMounted]);

  const handleLogout = async () => {
    await adminLogout();
    navigate('/admin/login');
  };

  if (!adminUser) {
    return null;
  }

  const navigationItems = [
    { 
      name: 'Dashboard', 
      path: '/admin/dashboard', 
      icon: <LayoutDashboardIcon className="h-5 w-5" /> 
    },
    { 
      name: 'Users', 
      path: '/admin/users', 
      icon: <UsersIcon className="h-5 w-5" /> 
    },
    { 
      name: 'Reports', 
      path: '/admin/reports', 
      icon: <BarChartIcon className="h-5 w-5" /> 
    },
    { 
      name: 'Settings', 
      path: '/admin/settings', 
      icon: <Settings2Icon className="h-5 w-5" /> 
    }
  ];

  const SidebarContent = () => (
    <div className="flex h-full flex-col gap-2">
      <div className="px-3 py-4">
        <div className="mb-8 flex items-center">
          <img
            src="/Speech Help - Logo-New.png"
            alt="SpeechHelp Logo"
            className="h-10"
          />
          <span className="ml-2 text-xl font-semibold">Admin Portal</span>
        </div>
        
        <nav className="space-y-1">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center rounded-md px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-purple-100 text-purple-800'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className={`mr-3 ${isActive ? 'text-purple-700' : 'text-gray-500'}`}>
                  {item.icon}
                </span>
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
      
      <div className="mt-auto px-3 py-4">
        <Link
          to="/"
          className="flex items-center rounded-md px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100"
        >
          <HomeIcon className="mr-3 h-5 w-5 text-gray-500" />
          Back to App
        </Link>
        
        <Button 
          variant="ghost" 
          className="w-full justify-start px-4 py-3 mt-2 text-red-600 hover:bg-red-50 hover:text-red-700"
          onClick={handleLogout}
        >
          <LogOutIcon className="mr-3 h-5 w-5" />
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 bg-white border-r border-gray-200 md:flex md:flex-col">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden fixed top-4 left-4 z-50">
            <MenuIcon className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1">
        <header className="bg-white border-b border-gray-200 px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">
              {navigationItems.find(item => item.path === location.pathname)?.name || 'Admin Panel'}
            </h1>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center text-sm">
                <span className="bg-purple-600 h-2 w-2 rounded-full mr-2"></span>
                <span>Logged in as <strong>{adminUser.username}</strong></span>
              </div>
            </div>
          </div>
        </header>
        <main className="p-4 sm:p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
