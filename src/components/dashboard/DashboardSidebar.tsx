
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboardIcon, 
  MicIcon, 
  PencilRulerIcon, 
  FolderIcon, 
  CreditCardIcon, 
  SettingsIcon,
  HelpCircleIcon,
  LogOutIcon 
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Navigation item type
type NavItem = {
  icon: React.ReactNode;
  label: string;
  href: string;
  onClick?: () => Promise<void> | void;
};

const DashboardSidebar = () => {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  
  // Using the correct SVG file path
  const logoPath = "/Speech Help - Logo.svg";
  
  // Get current path for highlighting active item
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
      icon: <CreditCardIcon className="h-5 w-5" />,
      label: 'Subscription',
      href: '/subscription',
    },
    {
      icon: <SettingsIcon className="h-5 w-5" />,
      label: 'Settings',
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
  
  // Display name preference: first name + last name > email username
  const emailUsername = user?.email?.split('@')[0] || '';
  const displayName = firstName || emailUsername;
  const fullName = firstName && lastName ? `${firstName} ${lastName}` : displayName;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen">
      {/* Logo - Updated to match homepage logo with link to home */}
      <div className="p-6">
        <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <img src={logoPath} alt="Speech Help" className="h-10" />
        </Link>
      </div>

      {/* User Info */}
      <div className="px-6 mb-6">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-medium">
            {user?.email ? user.email[0].toUpperCase() : '?'}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900 truncate">
              {fullName}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user?.email}
            </p>
          </div>
        </div>
      </div>

      {/* Primary Navigation */}
      <nav className="flex-1 overflow-y-auto">
        <div className="px-3">
          <div className="space-y-1">
            {primaryNavItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  currentPath === item.href 
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
                  currentPath === item.href 
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
  );
};

export default DashboardSidebar;
