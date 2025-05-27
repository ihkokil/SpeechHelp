
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
  BadgePercent,
  Edit,
} from 'lucide-react';

interface UserActionMenuProps {
  user: User;
  onViewDetails: (user: User) => void;
  onEditUser: (user: User) => void;
  onManagePermissions: (user: User) => void;
  onToggleUserActive: (userId: string, isActive: boolean) => void;
  onExtendSubscription?: (userId: string) => void;
  onDeleteUser: (userId: string) => void;
  onSendEmail?: (user: User) => void;
  onUpdateSubscription?: (user: User) => void;
}

const UserActionMenu: React.FC<UserActionMenuProps> = ({
  user,
  onViewDetails,
  onEditUser,
  onManagePermissions,
  onToggleUserActive,
  onDeleteUser,
  onSendEmail,
  onUpdateSubscription
}) => {
  // Prevent default event behavior and propagation for all handlers
  const handleAction = (
    e: React.MouseEvent, 
    callback: (arg: any) => void, 
    arg: any
  ) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log(`User action triggered: ${callback.name} for user ${user.id}`);
    callback(arg);
  };

  // Special handler for toggle active which requires two arguments
  const handleToggleActive = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log(`Toggle active triggered for user ${user.id}, current state: ${user.is_active !== false}`);
    onToggleUserActive(user.id, user.is_active !== false);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
        <Button variant="ghost" size="icon" className="h-8 w-8 p-0" aria-label="User actions">
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]" sideOffset={5} collisionPadding={10}>
        <DropdownMenuItem 
          onClick={(e) => handleAction(e, onViewDetails, user)} 
          id={`view-details-${user.id}`}
        >
          <Eye className="mr-2 h-4 w-4" />
          <span>View Details</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={(e) => handleAction(e, onEditUser, user)} 
          id={`edit-user-${user.id}`}
        >
          <Edit className="mr-2 h-4 w-4" />
          <span>Edit User</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={(e) => handleAction(e, onManagePermissions, user)} 
          id={`manage-permissions-${user.id}`}
        >
          <Shield className="mr-2 h-4 w-4" />
          <span>Manage Permissions</span>
        </DropdownMenuItem>
        
        {onSendEmail && (
          <DropdownMenuItem 
            onClick={(e) => handleAction(e, onSendEmail, user)} 
            id={`send-email-${user.id}`}
          >
            <Mail className="mr-2 h-4 w-4" />
            <span>Send Email</span>
          </DropdownMenuItem>
        )}

        {onUpdateSubscription && (
          <DropdownMenuItem 
            onClick={(e) => handleAction(e, onUpdateSubscription, user)} 
            id={`update-subscription-${user.id}`}
          >
            <BadgePercent className="mr-2 h-4 w-4" />
            <span>Update Subscription</span>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={handleToggleActive} 
          id={`${user.is_active !== false ? 'deactivate' : 'activate'}-user-${user.id}`}
        >
          {user.is_active !== false ? (
            <>
              <UserMinus className="mr-2 h-4 w-4" />
              <span>Deactivate User</span>
            </>
          ) : (
            <>
              <UserCheck className="mr-2 h-4 w-4" />
              <span>Activate User</span>
            </>
          )}
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          className="text-red-600 focus:text-red-700 focus:bg-red-50"
          onClick={(e) => handleAction(e, onDeleteUser, user.id)}
          id={`delete-user-${user.id}`}
        >
          <UserMinus className="mr-2 h-4 w-4" />
          <span>Delete User</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserActionMenu;
