
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
  onViewDetails: (e: React.MouseEvent, user: User) => void;
  onManagePermissions: (e: React.MouseEvent, user: User) => void;
  onToggleUserActive: (e: React.MouseEvent, userId: string, isActive: boolean) => void;
  onExtendSubscription: (e: React.MouseEvent, userId: string) => void;
  onDeleteUser: (e: React.MouseEvent, userId: string) => void;
}

const UserActionMenu: React.FC<UserActionMenuProps> = ({
  user,
  onViewDetails,
  onManagePermissions,
  onToggleUserActive,
  onExtendSubscription,
  onDeleteUser
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]" sideOffset={5} collisionPadding={10}>
        <DropdownMenuItem onClick={(e) => onViewDetails(e, user)}>
          <Eye className="mr-2 h-4 w-4" />
          <span>View Details</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <UserCog className="mr-2 h-4 w-4" />
          <span>Edit User</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={(e) => onManagePermissions(e, user)}>
          <Shield className="mr-2 h-4 w-4" />
          <span>Manage Permissions</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={(e) => onExtendSubscription(e, user.id)}
        >
          <Clock className="mr-2 h-4 w-4" />
          <span>Extend Subscription</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Mail className="mr-2 h-4 w-4" />
          <span>Send Email</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {user.is_active !== false ? (
          <DropdownMenuItem 
            onClick={(e) => onToggleUserActive(e, user.id, false)}
          >
            <UserMinus className="mr-2 h-4 w-4" />
            <span>Deactivate User</span>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem 
            onClick={(e) => onToggleUserActive(e, user.id, true)}
          >
            <UserCheck className="mr-2 h-4 w-4" />
            <span>Activate User</span>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="text-red-600 focus:text-red-700 focus:bg-red-50"
          onClick={(e) => onDeleteUser(e, user.id)}
        >
          <UserMinus className="mr-2 h-4 w-4" />
          <span>Delete User</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserActionMenu;
