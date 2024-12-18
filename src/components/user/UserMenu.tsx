
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ButtonCustom } from '@/components/ui/button-custom';
import { Link, useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  LayoutDashboardIcon, 
  Settings, 
  HelpCircle, 
  LogOut 
} from 'lucide-react';
import UserAvatar from './UserAvatar';
import UserProfileInfo from './UserProfileInfo';

const UserMenu: React.FC = () => {
  const { user, signOut, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  // Show loading spinner if auth is loading
  if (isLoading) {
    return (
      <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse"></div>
    );
  }

  // Show login/signup buttons if no user
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button 
          className="flex items-center gap-2 rounded-full p-2 transition-colors hover:bg-gray-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        >
          <UserAvatar user={user} size="md" />
          <span className="text-sm font-medium hidden md:block">
            {user.user_metadata?.first_name || user.email?.split('@')[0]}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-56 bg-white border border-gray-200 shadow-lg z-[9999]"
        sideOffset={5}
      >
        <div className="px-2 py-1.5">
          <UserProfileInfo user={user} />
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
