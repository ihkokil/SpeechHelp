
import { useCallback } from 'react';
import { User } from '../../types';
import { useToast } from '@/hooks/use-toast';

export const usePermissionsHandlers = (
  setSelectedUser: (user: User | null) => void,
  setIsPermissionsDialogOpen: (isOpen: boolean) => void,
  setUsers: (users: User[] | ((prevUsers: User[]) => User[])) => void
) => {
  const { toast } = useToast();
  
  // Handle managing permissions
  const handleManagePermissions = useCallback((user: User) => {
    console.log("usePermissionsHandlers: Manage permissions called for user:", user.id);
    setSelectedUser(user);
    setIsPermissionsDialogOpen(true);
  }, [setSelectedUser, setIsPermissionsDialogOpen]);
  
  // Handle updated permissions
  const handlePermissionsUpdated = useCallback((updatedUser: User) => {
    console.log("usePermissionsHandlers: Permissions updated for user:", updatedUser.id);
    setUsers(prevUsers => 
      prevUsers.map(user => user.id === updatedUser.id ? updatedUser : user)
    );
    setIsPermissionsDialogOpen(false);
  }, [setUsers, setIsPermissionsDialogOpen]);
  
  return {
    handleManagePermissions,
    handlePermissionsUpdated
  };
};
