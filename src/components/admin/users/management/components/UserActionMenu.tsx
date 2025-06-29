
import React from 'react';
import { User } from '../../types';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { 
  MoreVertical, 
  UserMinus,
  Mail,
  Eye,
  UserCheck,
  Shield,
  ShieldCheck,
  ShieldX,
  BadgePercent,
} from 'lucide-react';
import { useTranslatedContent } from '@/hooks/useTranslatedContent';

interface UserActionMenuProps {
  user: User;
  onViewDetails: (user: User) => void;
  onToggleAdmin: (user: User) => void;
  onToggleUserActive: (userId: string, isActive: boolean) => void;
  onDeleteUser: (userId: string) => void;
  onSendEmail?: (user: User) => void;
  onUpdateSubscription?: (user: User) => void;
}

const UserActionMenu: React.FC<UserActionMenuProps> = ({
  user,
  onViewDetails,
  onToggleAdmin,
  onToggleUserActive,
  onDeleteUser,
  onSendEmail,
  onUpdateSubscription
}) => {
  const { translate } = useTranslatedContent();

  // Check if user is the original admin that cannot be removed
  const isProtectedAdmin = user.email === 'speechhelpmaster@example.com' || user.username === 'speechhelpmaster';
  const isCurrentlyAdmin = user.is_admin === true;

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

  // Handler for admin toggle
  const handleToggleAdmin = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isProtectedAdmin && isCurrentlyAdmin) {
      console.log('Cannot remove admin privileges from protected admin user');
      return;
    }
    
    console.log(`Toggle admin triggered for user ${user.id}, current admin state: ${isCurrentlyAdmin}`);
    onToggleAdmin(user);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
        <Button variant="ghost" size="icon" className="h-8 w-8 p-0" aria-label={translate('admin.actions.openMenu')}>
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">{translate('admin.actions.openMenu')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]" sideOffset={5} collisionPadding={10}>
        <DropdownMenuItem 
          onClick={(e) => handleAction(e, onViewDetails, user)} 
          id={`view-details-${user.id}`}
        >
          <Eye className="mr-2 h-4 w-4" />
          <span>{translate('admin.actions.viewDetails')}</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={handleToggleAdmin}
          disabled={isProtectedAdmin && isCurrentlyAdmin}
          id={`toggle-admin-${user.id}`}
        >
          {isCurrentlyAdmin ? (
            <>
              <ShieldX className="mr-2 h-4 w-4" />
              <span>{isProtectedAdmin ? translate('admin.role.protectedAdmin') : translate('admin.role.removeFromAdmin')}</span>
            </>
          ) : (
            <>
              <ShieldCheck className="mr-2 h-4 w-4" />
              <span>{translate('admin.role.makeAdmin')}</span>
            </>
          )}
        </DropdownMenuItem>
        
        {onSendEmail && (
          <DropdownMenuItem 
            onClick={(e) => handleAction(e, onSendEmail, user)} 
            id={`send-email-${user.id}`}
          >
            <Mail className="mr-2 h-4 w-4" />
            <span>{translate('admin.actions.sendEmail')}</span>
          </DropdownMenuItem>
        )}

        {onUpdateSubscription && (
          <DropdownMenuItem 
            onClick={(e) => handleAction(e, onUpdateSubscription, user)} 
            id={`update-subscription-${user.id}`}
          >
            <BadgePercent className="mr-2 h-4 w-4" />
            <span>{translate('admin.actions.updateSubscription')}</span>
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
              <span>{translate('admin.actions.deactivateUser')}</span>
            </>
          ) : (
            <>
              <UserCheck className="mr-2 h-4 w-4" />
              <span>{translate('admin.actions.activateUser')}</span>
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
          <span>{translate('admin.actions.deleteUser')}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserActionMenu;
