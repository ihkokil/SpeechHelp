
import React from 'react';
import { User } from '../../types';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { 
  MoreVertical, 
  UserCog,
  UserMinus,
  Mail,
  Eye,
  UserCheck,
  Shield,
  Clock,
} from 'lucide-react';

interface UserActionMenuProps {
  user: User;
  onViewDetails: (user: User) => void;
  onManagePermissions: (user: User) => void;
  onToggleUserActive: (userId: string, isActive: boolean) => void;
  onExtendSubscription: (userId: string) => void;
  onDeleteUser: (userId: string) => void;
}

const UserActionMenu: React.FC<UserActionMenuProps> = ({
  user,
  onViewDetails,
  onManagePermissions,
  onToggleUserActive,
  onExtendSubscription,
  onDeleteUser
}) => {
  // Create handler functions with proper stopPropagation
  const handleViewDetails = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("UserActionMenu: View details called for user:", user.id);
    onViewDetails(user);
  };
  
  const handleManagePermissions = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("UserActionMenu: Manage permissions called for user:", user.id);
    onManagePermissions(user);
  };
  
  const handleToggleUserActive = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("UserActionMenu: Toggle active status for user:", user.id, !user.is_active);
    onToggleUserActive(user.id, user.is_active !== false);
  };
  
  const handleExtendSubscription = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("UserActionMenu: Extend subscription for user:", user.id);
    onExtendSubscription(user.id);
  };
  
  const handleDeleteUser = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("UserActionMenu: Delete user:", user.id);
    onDeleteUser(user.id);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]" sideOffset={5} collisionPadding={10}>
        <DropdownMenuItem onClick={handleViewDetails}>
          <Eye className="mr-2 h-4 w-4" />
          <span>View Details</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <UserCog className="mr-2 h-4 w-4" />
          <span>Edit User</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleManagePermissions}>
          <Shield className="mr-2 h-4 w-4" />
          <span>Manage Permissions</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExtendSubscription}>
          <Clock className="mr-2 h-4 w-4" />
          <span>Extend Subscription</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Mail className="mr-2 h-4 w-4" />
          <span>Send Email</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {user.is_active !== false ? (
          <DropdownMenuItem onClick={handleToggleUserActive}>
            <UserMinus className="mr-2 h-4 w-4" />
            <span>Deactivate User</span>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={handleToggleUserActive}>
            <UserCheck className="mr-2 h-4 w-4" />
            <span>Activate User</span>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="text-red-600 focus:text-red-700 focus:bg-red-50"
          onClick={handleDeleteUser}
        >
          <UserMinus className="mr-2 h-4 w-4" />
          <span>Delete User</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserActionMenu;
