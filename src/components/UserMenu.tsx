
import { useAuth } from '@/contexts/AuthContext';
import { ButtonCustom } from '@/components/ui/button-custom';
import { Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  LayoutDashboardIcon, 
  UserCircle, 
  Settings, 
  HelpCircle, 
  LogOut 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const UserMenu = () => {
  const { user, signOut, isLoading } = useAuth();
  const navigate = useNavigate();

  console.log('UserMenu render - user:', user);
  console.log('UserMenu render - isLoading:', isLoading);

  const handleSignOut = async () => {
    console.log('UserMenu - handleSignOut called');
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const handleNavigation = (path: string) => {
    console.log('UserMenu - navigating to:', path);
    navigate(path);
  };

  // Show loading spinner only if auth is actually loading
  if (isLoading) {
    console.log('UserMenu - showing loading state');
    return (
      <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse"></div>
    );
  }

  // Show login/signup buttons if no user
  if (!user) {
    console.log('UserMenu - showing login/signup buttons');
    return (
      <div className="flex items-center gap-2">
        <Link to="/auth?signin=true">
          <ButtonCustom 
            variant="ghost" 
            className="font-semibold text-pink-600 hover:text-pink-800 hover:bg-pink-50 px-4 transition-colors"
          >
            Log In
          </ButtonCustom>
        </Link>
        <Link to="/auth?signup=true">
          <ButtonCustom 
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold hover:opacity-90 transition-opacity px-6"
          >
            Sign Up
          </ButtonCustom>
        </Link>
      </div>
    );
  }

  // Helper function to safely extract string values
  const safeString = (value: any): string => {
    if (typeof value === 'string') return value.trim();
    if (value === null || value === undefined) return '';
    return String(value).trim();
  };

  // Helper function to construct full name from first and last name
  const constructFullName = (firstName: string, lastName: string): string => {
    const first = safeString(firstName);
    const last = safeString(lastName);
    if (first && last) {
      return `${first} ${last}`;
    }
    if (first) return first;
    if (last) return last;
    return '';
  };

  // Get user's name from metadata - always prioritize first + last name construction
  const metadata = user.user_metadata || {};
  const firstName = safeString(metadata.first_name);
  const lastName = safeString(metadata.last_name);
  
  // Construct full name from components
  const fullName = constructFullName(firstName, lastName);
  
  // Display name preference: constructed full name > email username
  const emailUsername = user.email?.split('@')[0] || '';
  const displayName = firstName || emailUsername;
  const displayFullName = fullName || displayName;

  console.log('UserMenu - displayName:', displayName);
  console.log('UserMenu - displayFullName:', displayFullName);
  console.log('UserMenu - rendering user menu for authenticated user');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button 
          className="flex items-center gap-2 rounded-full p-2 transition-colors hover:bg-gray-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          onClick={() => console.log('UserMenu trigger clicked')}
        >
          <UserCircle className="h-8 w-8 text-pink-600" />
          <span className="text-sm font-medium hidden md:block">
            {displayName}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-56 bg-white border border-gray-200 shadow-lg z-[9999]"
        sideOffset={5}
      >
        <div className="px-2 py-1.5">
          <p className="text-sm font-bold truncate">{displayFullName}</p>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="text-xs text-gray-500 truncate cursor-help">{user.email}</p>
              </TooltipTrigger>
              <TooltipContent>
                <p>{user.email}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="cursor-pointer hover:bg-gray-100 focus:bg-gray-100"
          onSelect={() => handleNavigation('/dashboard')}
        >
          <LayoutDashboardIcon className="h-4 w-4 mr-2" />
          Dashboard
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="cursor-pointer hover:bg-gray-100 focus:bg-gray-100"
          onSelect={() => handleNavigation('/settings')}
        >
          <Settings className="h-4 w-4 mr-2" />
          Account Settings
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="cursor-pointer hover:bg-gray-100 focus:bg-gray-100"
          onSelect={() => handleNavigation('/help')}
        >
          <HelpCircle className="h-4 w-4 mr-2" />
          Help & Support
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="cursor-pointer text-red-600 hover:bg-red-50 focus:bg-red-50 focus:text-red-600"
          onSelect={handleSignOut}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
