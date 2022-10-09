
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboardIcon, 
  MicIcon, 
  PencilRulerIcon, 
  FolderIcon, 
  CreditCardIcon, 
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
  const { signOut } = useAuth();
  
  // Get current path for highlighting active item
  const currentPath = window.location.pathname;
  
  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  // Navigation items
  const navItems: NavItem[] = [
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
      label: 'My Work',
      href: '/my-work',
    },
    {
      icon: <CreditCardIcon className="h-5 w-5" />,
      label: 'Subscription & Payment',
      href: '/subscription',
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="p-6">
        <Link to="/">
          <img src="/public/lovable-uploads/b6ea4638-2c5b-4af2-8d8a-69096499067b.png" alt="Speech Help" className="h-10" />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="mt-6">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.label}>
              <Link
                to={item.href}
                className={cn(
                  "flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 transition-colors",
                  currentPath === item.href && "text-pink-600 font-medium"
                )}
              >
                <span className={cn(
                  "mr-3",
                  currentPath === item.href && "text-pink-600"
                )}>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Divider */}
      <div className="h-px bg-gray-200 my-6 mx-6"></div>

      {/* Logout Button */}
      <button
        onClick={handleSignOut}
        className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 transition-colors w-full"
      >
        <LogOutIcon className="h-5 w-5 mr-3" />
        Logout
      </button>
    </aside>
  );
};

export default DashboardSidebar;
