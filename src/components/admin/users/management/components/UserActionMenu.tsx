
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Eye, Shield, UserCheck, UserX, Trash2, Mail, CreditCard, Edit } from 'lucide-react';
import { User } from '../../types';

interface UserActionMenuProps {
  user: User;
  onViewDetails: (user: User) => void;
  onEditUser: (user: User) => void;
  onManagePermissions: (user: User) => void;
  onToggleActive: (userId: string, isActive: boolean) => void;
  onDeleteUser: (userId: string) => void;
  onSendEmail?: (user: User) => void;
  onUpdateSubscription?: (user: User) => void;
}

export const UserActionMenu: React.FC<UserActionMenuProps> = ({
  user,
  onViewDetails,
  onEditUser,
  onManagePermissions,
  onToggleActive,
  onDeleteUser,
  onSendEmail,
  onUpdateSubscription
}) => {
  console.log("User action triggered: ", user.is_active ? 'deactivate' : 'activate', "for user", user.id);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onViewDetails(user)}>
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => onEditUser(user)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit User
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => onManagePermissions(user)}>
          <Shield className="mr-2 h-4 w-4" />
          Manage Permissions
        </DropdownMenuItem>
        
        {onUpdateSubscription && (
          <DropdownMenuItem onClick={() => onUpdateSubscription(user)}>
            <CreditCard className="mr-2 h-4 w-4" />
            Update Subscription
          </DropdownMenuItem>
        )}
        
        {onSendEmail && (
          <DropdownMenuItem onClick={() => onSendEmail(user)}>
            <Mail className="mr-2 h-4 w-4" />
            Send Email
          </DropdownMenuItem>
        )}
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={() => onToggleActive(user.id, !user.is_active)}
        >
          {user.is_active ? (
            <>
              <UserX className="mr-2 h-4 w-4" />
              Deactivate User
            </>
          ) : (
            <>
              <UserCheck className="mr-2 h-4 w-4" />
              Activate User
            </>
          )}
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => onDeleteUser(user.id)}
          className="text-red-600"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete User
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
