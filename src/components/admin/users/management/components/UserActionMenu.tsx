
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
  const handleAction = (handler: Function, ...args: any[]) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handler(...args);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
        <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]" sideOffset={5} collisionPadding={10}>
        <DropdownMenuItem onSelect={() => onViewDetails(user)}>
          <Eye className="mr-2 h-4 w-4" />
          <span>View Details</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <UserCog className="mr-2 h-4 w-4" />
          <span>Edit User</span>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => onManagePermissions(user)}>
          <Shield className="mr-2 h-4 w-4" />
          <span>Manage Permissions</span>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => onExtendSubscription(user.id)}>
          <Clock className="mr-2 h-4 w-4" />
          <span>Extend Subscription</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Mail className="mr-2 h-4 w-4" />
          <span>Send Email</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {user.is_active !== false ? (
          <DropdownMenuItem onSelect={() => onToggleUserActive(user.id, user.is_active !== false)}>
            <UserMinus className="mr-2 h-4 w-4" />
            <span>Deactivate User</span>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onSelect={() => onToggleUserActive(user.id, user.is_active !== false)}>
            <UserCheck className="mr-2 h-4 w-4" />
            <span>Activate User</span>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="text-red-600 focus:text-red-700 focus:bg-red-50"
          onSelect={() => onDeleteUser(user.id)}
        >
          <UserMinus className="mr-2 h-4 w-4" />
          <span>Delete User</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserActionMenu;
