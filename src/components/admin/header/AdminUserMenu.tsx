
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Settings, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const AdminUserMenu = () => {
  const { adminUser, signOut } = useAdminAuth();
  const navigate = useNavigate();
  
  const defaultAvatarUrl = "/abstract-user-flat.svg";

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/auth');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar>
            <AvatarImage 
              src={defaultAvatarUrl} 
              alt={adminUser?.username || 'Admin'} 
            />
            <AvatarFallback>{adminUser?.username?.charAt(0).toUpperCase() || 'A'}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" forceMount>
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            <p className="font-medium">{adminUser?.username}</p>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="text-xs text-gray-500 truncate">{adminUser?.email}</p>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{adminUser?.email}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <button className="w-full flex cursor-default items-center" onClick={() => navigate('/admin/profile')}>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </button>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <button className="w-full flex cursor-default items-center" onClick={() => navigate('/admin/settings')}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </button>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <button className="w-full flex cursor-default items-center text-red-600 hover:bg-red-600 hover:text-white focus:bg-red-600 focus:text-white" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sign out</span>
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AdminUserMenu;
