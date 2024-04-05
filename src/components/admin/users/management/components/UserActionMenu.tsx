
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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useState } from 'react';

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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

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
  
  const handleDeleteUserClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteUser = () => {
    onDeleteUser(user.id);
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
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
          <DropdownMenuItem onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Edit User clicked');
            // Will be implemented in a future iteration
          }}>
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
          <DropdownMenuItem onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Send Email clicked');
            // Will be implemented in a future iteration
          }}>
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
            onClick={handleDeleteUserClick}
          >
            <UserMinus className="mr-2 h-4 w-4" />
            <span>Delete User</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently delete the user &quot;{user.email}&quot;. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteUser}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default UserActionMenu;
