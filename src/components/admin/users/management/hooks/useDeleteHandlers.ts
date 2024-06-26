
import { useCallback } from 'react';
import { User } from '../../types';

export const useDeleteHandlers = (
  baseHandleDeleteUsers: (selectedUsers: User[], users: User[], setUsers: (users: User[]) => void) => void,
  users: User[],
  setUsers: (users: User[]) => void,
  setIsDeleteDialogOpen: (isOpen: boolean) => void,
  setSelectedUsers: (users: User[]) => void,
  selectedUsers: User[]
) => {
  
  // Handle deleting users
  const handleDeleteUsers = useCallback(() => {
    baseHandleDeleteUsers(selectedUsers, users, setUsers);
    setIsDeleteDialogOpen(false);
  }, [baseHandleDeleteUsers, selectedUsers, users, setUsers, setIsDeleteDialogOpen]);
  
  // Handle deleting a single user
  const handleDeleteUser = useCallback((userId: string) => {
    const userToDelete = users.find(user => user.id === userId);
    if (userToDelete) {
      setSelectedUsers([userToDelete]);
      setIsDeleteDialogOpen(true);
    }
  }, [users, setSelectedUsers, setIsDeleteDialogOpen]);
  
  return {
    handleDeleteUsers,
    handleDeleteUser
  };
};
