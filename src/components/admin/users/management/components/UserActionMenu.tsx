
import React, { useState } from 'react';
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
  Trash2,
} from 'lucide-react';
import { useTranslatedContent } from '@/hooks/useTranslatedContent';
import { useDeleteUser } from '../hooks/user-actions/useDeleteUser';
import { useToggleUserStatus } from '../hooks/user-actions/useToggleUserStatus';
import { DeleteUserConfirmDialog } from './DeleteUserConfirmDialog';

interface UserActionMenuProps {
  user: User;
  onViewDetails: (user: User) => void;
  onToggleAdmin: (user: User) => void;
  onRequestAdminPassword?: (user: User) => void;
  onDeleteUser: (userId: string) => void;
  onSendEmail?: (user: User) => void;
  onUpdateSubscription?: (user: User) => void;
  onUserDeleted?: () => void;
}

const UserActionMenu: React.FC<UserActionMenuProps> = ({
  user,
  onViewDetails,
  onToggleAdmin,
  onRequestAdminPassword,
  onDeleteUser,
  onSendEmail,
  onUpdateSubscription,
  onUserDeleted
}) => {
  const { translate } = useTranslatedContent();
  const { deleteUser, isDeleting } = useDeleteUser();
  const { toggleUserStatus, isToggling } = useToggleUserStatus();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Check if user is the original admin that cannot be removed
  const isProtectedAdmin = user.email === 'speechhelpmaster@example.com' || user.username === 'speechhelpmaster';
  const isCurrentlyAdmin = user.is_admin === true;
  const isCurrentlyActive = user.is_active !== false; // Default to true if undefined

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

  // NEW: Handler for toggle active status using the new hook
  const handleToggleActive = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log(`Toggle active triggered for user ${user.id}, current state: ${isCurrentlyActive}`);
    
    const success = await toggleUserStatus(user.id, isCurrentlyActive, () => {
      // On successful toggle, refresh the user list if callback provided
      if (onUserDeleted) {
        onUserDeleted();
      }
    });
    
    if (success) {
      console.log('User status toggled successfully');
    } else {
      console.log('User status toggle failed');
    }
  };

  // Handler for admin toggle - ALWAYS use password dialog for any admin changes
  const handleToggleAdmin = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isProtectedAdmin && isCurrentlyAdmin) {
      console.log('Cannot remove admin privileges from protected admin user');
      return;
    }
    
    console.log(`Admin toggle requested for user ${user.id}, current admin state: ${isCurrentlyAdmin}`);
    
    // ALWAYS show password dialog for any admin role changes
    if (onRequestAdminPassword) {
      onRequestAdminPassword(user);
    } else {
      console.error('onRequestAdminPassword handler not provided');
    }
  };

  // FIXED: Clean delete handler with proper event handling
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log(`Delete user requested for: ${user.id} (${user.email})`);
    setIsDeleteDialogOpen(true);
  };

  // FIXED: Confirm delete handler
  const handleConfirmDelete = async () => {
    console.log(`Confirming delete for user: ${user.id} (${user.email})`);
    
    const success = await deleteUser(user.id, () => {
      // On successful deletion
      console.log('User deletion completed, closing dialog and refreshing');
      setIsDeleteDialogOpen(false);
      
      // Notify parent components
      if (onUserDeleted) {
        onUserDeleted();
      }
      
      // Also call the original handler for compatibility
      onDeleteUser(user.id);
    });
    
    if (success) {
      console.log('User deletion completed successfully');
    } else {
      console.log('User deletion failed');
      // Dialog stays open on failure so user can retry
    }
  };

  // FIXED: Handle dropdown trigger click to prevent event propagation
  const handleDropdownTrigger = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(`Opening action menu for user: ${user.email}`);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 p-0" 
            aria-label={translate('admin.actions.openMenu')}
            onClick={handleDropdownTrigger}
          >
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
            id={`${isCurrentlyActive ? 'deactivate' : 'activate'}-user-${user.id}`}
            disabled={isToggling}
          >
            {isCurrentlyActive ? (
              <>
                <UserMinus className="mr-2 h-4 w-4" />
                <span>{isToggling ? 'Deactivating...' : translate('admin.actions.deactivateUser')}</span>
              </>
            ) : (
              <>
                <UserCheck className="mr-2 h-4 w-4" />
                <span>{isToggling ? 'Activating...' : translate('admin.actions.activateUser')}</span>
              </>
            )}
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            className="text-red-600 focus:text-red-700 focus:bg-red-50"
            onClick={handleDeleteClick}
            id={`delete-user-${user.id}`}
            disabled={isDeleting}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            <span>{isDeleting ? 'Deleting...' : translate('admin.actions.deleteUser')}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteUserConfirmDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        user={user}
        isDeleting={isDeleting}
      />
    </>
  );
};

export default UserActionMenu;
