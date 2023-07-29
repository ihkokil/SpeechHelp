
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
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
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar
} from '@/components/ui/sidebar';

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
  const { state } = useSidebar();
  
  // Using Supabase hosted SVG file or local SVG backup
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
    <Sidebar className="border-r border-gray-200 bg-white h-screen">
      {/* Logo - Updated to match homepage logo with link to home */}
      <SidebarHeader className="p-4 border-b border-gray-100">
        <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <img src={logoPath} alt="Speech Help" className="h-10" />
        </Link>
        
        {/* User Info */}
        <div className="mt-4">
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
      </SidebarHeader>

      {/* Primary Navigation */}
      <SidebarContent>
        <SidebarMenu>
          {primaryNavItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton 
                asChild 
                tooltip={item.label}
                isActive={currentPath === item.href}
              >
                <Link to={item.href}>
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>

        {/* Secondary Navigation */}
        <SidebarMenu className="mt-6">
          {secondaryNavItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton 
                asChild 
                tooltip={item.label}
                isActive={currentPath === item.href}
              >
                <Link to={item.href}>
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      {/* Logout Button */}
      <SidebarFooter>
        <SidebarMenuButton 
          onClick={handleSignOut}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <LogOutIcon className="h-5 w-5" />
          <span>Logout</span>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
};

export default DashboardSidebar;
