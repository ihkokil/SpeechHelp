
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
  Edit,
} from 'lucide-react';

interface UserActionMenuProps {
  user: User;
  onViewDetails: (user: User) => void;
  onManagePermissions: (user: User) => void;
  onToggleUserActive: (userId: string, isActive: boolean) => void;
  onExtendSubscription: (userId: string) => void;
  onDeleteUser: (userId: string) => void;
  onEditUser?: (user: User) => void;
  onSendEmail?: (user: User) => void;
}

const UserActionMenu: React.FC<UserActionMenuProps> = ({
  user,
  onViewDetails,
  onManagePermissions,
  onToggleUserActive,
  onExtendSubscription,
  onDeleteUser,
  onEditUser,
  onSendEmail
}) => {
  // Handle menu item actions - now these are explicit functions
  const handleViewDetails = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onViewDetails(user);
  };
  
  const handleManagePermissions = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onManagePermissions(user);
  };
  
  const handleToggleUserActive = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleUserActive(user.id, user.is_active !== false);
  };
  
  const handleExtendSubscription = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onExtendSubscription(user.id);
  };
  
  const handleDeleteUser = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDeleteUser(user.id);
  };
  
  const handleEditUser = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onEditUser) {
      onEditUser(user);
    } else {
      console.log('Edit User clicked - handler not implemented yet');
    }
  };
  
  const handleSendEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onSendEmail) {
      onSendEmail(user);
    } else {
      console.log('Send Email clicked - handler not implemented yet');
    }
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
        <DropdownMenuItem onClick={handleViewDetails} id={`view-details-${user.id}`}>
          <Eye className="mr-2 h-4 w-4" />
          <span>View Details</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleEditUser} id={`edit-user-${user.id}`}>
          <Edit className="mr-2 h-4 w-4" />
          <span>Edit User</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleManagePermissions} id={`manage-permissions-${user.id}`}>
          <Shield className="mr-2 h-4 w-4" />
          <span>Manage Permissions</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExtendSubscription} id={`extend-subscription-${user.id}`}>
          <Clock className="mr-2 h-4 w-4" />
          <span>Extend Subscription</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSendEmail} id={`send-email-${user.id}`}>
          <Mail className="mr-2 h-4 w-4" />
          <span>Send Email</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {user.is_active !== false ? (
          <DropdownMenuItem onClick={handleToggleUserActive} id={`deactivate-user-${user.id}`}>
            <UserMinus className="mr-2 h-4 w-4" />
            <span>Deactivate User</span>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={handleToggleUserActive} id={`activate-user-${user.id}`}>
            <UserCheck className="mr-2 h-4 w-4" />
            <span>Activate User</span>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="text-red-600 focus:text-red-700 focus:bg-red-50"
          onClick={handleDeleteUser}
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
