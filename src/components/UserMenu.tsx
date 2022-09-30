
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
import { UserCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
      <div className="flex items-center gap-3">
        <Link to="/auth">
          <ButtonCustom variant="magenta">
            Log In
          </ButtonCustom>
        </Link>
        <Link to="/auth?signup=true">
          <ButtonCustom variant="outline" className="border-pink-600 text-pink-600 hover:bg-pink-50">
            Sign Up
          </ButtonCustom>
        </Link>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-full p-1 transition-colors hover:bg-gray-100">
          <UserCircle className="h-8 w-8 text-pink-600" />
          <span className="text-sm font-medium hidden md:block">
            {user.email?.split('@')[0]}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5">
          <p className="text-sm font-medium truncate">{user.email}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer text-red-600 focus:text-red-600"
          onClick={handleSignOut}
        >
          Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
