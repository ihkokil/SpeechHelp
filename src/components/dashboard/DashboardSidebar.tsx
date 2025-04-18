
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { X, Menu } from 'lucide-react';
import { 
  LayoutDashboardIcon, 
  MicIcon, 
  PencilRulerIcon, 
  FolderIcon, 
  SettingsIcon,
  HelpCircleIcon,
  LogOutIcon 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { NavItem } from '@/types/navigation';

const DashboardSidebar = () => {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(!isMobile);
  
  const logoPath = "https://yotrueuqjxmgcwlbbyps.supabase.co/storage/v1/object/public/svg_files//Speech%20Help%20Logo.svg";
  const currentPath = window.location.pathname;
  
  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  // Navigation items
  const primaryNavItems: NavItem[] = [
    {
      icon: <LayoutDashboardIcon className="h-5 w-5" />,
      label: 'Dashboard',
      href: '/dashboard',
    },
    {
      icon: <MicIcon className="h-5 w-5" />,
      label: 'Speech Lab',
      href: '/speech-lab',
    },
    {
      icon: <PencilRulerIcon className="h-5 w-5" />,
      label: 'Writing Tips',
      href: '/writing-tips',
    },
    {
      icon: <FolderIcon className="h-5 w-5" />,
      label: 'My Speeches',
      href: '/my-speeches',
    },
  ];
  
  const secondaryNavItems: NavItem[] = [
    {
      icon: <SettingsIcon className="h-5 w-5" />,
      label: 'Account Settings',
      href: '/settings',
    },
    {
      icon: <HelpCircleIcon className="h-5 w-5" />,
      label: 'Help & Support',
      href: '/help',
    },
  ];

  // Get user's name from metadata or email
  const metadata = user?.user_metadata || {};
  const firstName = metadata.first_name;
  const lastName = metadata.last_name;
  const emailUsername = user?.email?.split('@')[0] || '';
  const displayName = firstName || emailUsername;
  const fullName = firstName && lastName ? `${firstName} ${lastName}` : displayName;

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile Toggle Button */}
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 right-4 z-50 p-2 bg-white rounded-lg shadow-md md:hidden"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      )}

      {/* Sidebar Content */}
      <aside className={cn(
        "bg-white border-r border-gray-200 flex flex-col h-screen shadow-md transition-all duration-300",
        isMobile ? (isOpen ? "w-64 translate-x-0" : "w-64 -translate-x-full") : "w-64",
      )}>
        {/* Logo */}
        <div className="p-6 border-b border-gray-100">
          <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img 
              src={logoPath} 
              alt="Speech Help" 
              className="h-10 w-auto" 
            />
          </Link>
        </div>

        {/* User Info */}
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-medium">
              {user?.email ? user.email[0].toUpperCase() : '?'}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900 truncate">{fullName}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          {/* Primary Navigation */}
          <div className="px-3">
            <div className="space-y-1">
              {primaryNavItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    currentPath.startsWith(item.href) 
                      ? "bg-purple-50 text-purple-700" 
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                  onClick={() => isMobile && setIsOpen(false)}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-200 my-6 mx-3"></div>

          {/* Secondary Navigation */}
          <div className="px-3">
            <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Settings
            </p>
            <div className="space-y-1">
              {secondaryNavItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    currentPath.startsWith(item.href) 
                      ? "bg-purple-50 text-purple-700" 
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                  onClick={() => isMobile && setIsOpen(false)}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleSignOut}
            className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50 transition-colors"
          >
            <LogOutIcon className="h-5 w-5 mr-3" />
            Logout
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default DashboardSidebar;

