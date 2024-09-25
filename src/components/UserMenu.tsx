
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

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse"></div>
    );
  }

  if (!user) {
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

  // Get user's name from metadata or email
  const metadata = user.user_metadata || {};
  const firstName = metadata.first_name;
  const lastName = metadata.last_name;
  
  // Display name preference: first name + last name > email username
  const emailUsername = user.email?.split('@')[0] || '';
  const displayName = firstName || emailUsername;
  const fullName = firstName && lastName ? `${firstName} ${lastName}` : displayName;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-full p-1 transition-colors hover:bg-gray-100">
          <UserCircle className="h-8 w-8 text-pink-600" />
          <span className="text-sm font-medium hidden md:block">
            {displayName}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5">
          <p className="text-sm font-bold truncate">{fullName}</p>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </TooltipTrigger>
              <TooltipContent>
                <p>{user.email}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <button className="w-full flex cursor-default items-center" onClick={() => navigate('/dashboard')}>
            <LayoutDashboardIcon className="h-4 w-4 mr-2" />
            Dashboard
          </button>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <button className="w-full flex cursor-default items-center" onClick={() => navigate('/settings')}>
            <Settings className="h-4 w-4 mr-2" />
            Account Settings
          </button>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <button className="w-full flex cursor-default items-center" onClick={() => navigate('/help')}>
            <HelpCircle className="h-4 w-4 mr-2" />
            Help & Support
          </button>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <button 
            className="w-full flex cursor-default items-center text-red-600 hover:bg-red-600 hover:text-white focus:bg-red-600 focus:text-white"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Log Out
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
