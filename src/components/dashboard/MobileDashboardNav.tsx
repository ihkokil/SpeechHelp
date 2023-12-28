
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import LanguageSelector from '@/components/common/LanguageSelector';
import { Link } from 'react-router-dom';

type NavItem = {
  icon: React.ReactNode;
  label: string;
  href: string;
  onClick?: () => Promise<void> | void;
};

const MobileDashboardNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const currentPath = window.location.pathname;
  
  // Using Supabase hosted SVG file
  const logoPath = "https://yotrueuqjxmgcwlbbyps.supabase.co/storage/v1/object/public/svg_files//Speech%20Help%20Logo.svg";
  
  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  // Navigation items - same as in DashboardSidebar
  const primaryNavItems: NavItem[] = [
    {
      icon: <div className="h-5 w-5 flex items-center justify-center">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="7" height="9" x="3" y="3" rx="1" />
          <rect width="7" height="5" x="14" y="3" rx="1" />
          <rect width="7" height="9" x="14" y="12" rx="1" />
          <rect width="7" height="5" x="3" y="16" rx="1" />
        </svg>
      </div>,
      label: 'Dashboard',
      href: '/dashboard',
    },
    {
      icon: <div className="h-5 w-5 flex items-center justify-center">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <line x1="12" x2="12" y1="19" y2="22" />
        </svg>
      </div>,
      label: 'Speech Lab',
      href: '/speech-lab',
    },
    {
      icon: <div className="h-5 w-5 flex items-center justify-center">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
        </svg>
      </div>,
      label: 'Writing Tips',
      href: '/writing-tips',
    },
    {
      icon: <div className="h-5 w-5 flex items-center justify-center">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" />
          <path d="M4 6v12c0 1.1.9 2 2 2h14v-4" />
          <path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z" />
        </svg>
      </div>,
      label: 'My Speeches',
      href: '/my-speeches',
    },
  ];
  
  const secondaryNavItems: NavItem[] = [
    {
      icon: <div className="h-5 w-5 flex items-center justify-center">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </div>,
      label: 'Account Settings',
      href: '/settings',
    },
    {
      icon: <div className="h-5 w-5 flex items-center justify-center">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <path d="M12 17h.01" />
        </svg>
      </div>,
      label: 'Help & Support',
      href: '/help',
    },
  ];

  const closeMenu = () => setIsOpen(false);

  return (
    <div className="md:hidden bg-white border-b py-2 px-4 flex items-center justify-between sticky top-0 z-40">
      <Link to="/" className="flex items-center">
        <img src={logoPath} alt="Speech Help" className="h-10" />
      </Link>
      
      <div className="flex items-center space-x-4">
        <LanguageSelector />
        
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <button className="p-2 rounded-md hover:bg-gray-100">
              <Menu className="h-6 w-6 text-gray-700" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[85%] max-w-[320px] pt-12">
            <button
              onClick={closeMenu}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
            
            {/* User Info */}
            <div className="mb-6 border-b border-gray-100 pb-4">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-medium">
                  {user?.email ? user.email[0].toUpperCase() : '?'}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user?.email?.split('@')[0] || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Primary Navigation */}
            <div className="space-y-6">
              <div className="space-y-1">
                {primaryNavItems.map((item) => (
                  <Link
                    key={item.label}
                    to={item.href}
                    onClick={closeMenu}
                    className={cn(
                      "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                      currentPath.startsWith(item.href) 
                        ? "bg-purple-50 text-purple-700" 
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
              </div>

              {/* Divider */}
              <div className="h-px bg-gray-200 my-4"></div>

              {/* Secondary Navigation */}
              <div>
                <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Settings
                </p>
                <div className="space-y-1">
                  {secondaryNavItems.map((item) => (
                    <Link
                      key={item.label}
                      to={item.href}
                      onClick={closeMenu}
                      className={cn(
                        "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                        currentPath.startsWith(item.href) 
                          ? "bg-purple-50 text-purple-700" 
                          : "text-gray-700 hover:bg-gray-100"
                      )}
                    >
                      <span className="mr-3">{item.icon}</span>
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={() => {
                  closeMenu();
                  handleSignOut();
                }}
                className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50 transition-colors"
              >
                <LogOut className="h-5 w-5 mr-3" />
                Logout
              </button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default MobileDashboardNav;
