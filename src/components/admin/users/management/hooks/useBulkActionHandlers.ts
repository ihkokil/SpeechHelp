
import { useCallback } from 'react';
import { User } from '../../types';

export const useBulkActionHandlers = (
  baseHandleBulkDelete: (selectedUsers: User[], users: User[], setUsers: (users: User[]) => void) => void,
  baseHandleBulkActivate: (selectedUsers: User[], users: User[], setUsers: (users: User[]) => void) => void,
  baseHandleBulkDeactivate: (selectedUsers: User[], users: User[], setUsers: (users: User[]) => void) => void,
  selectedUsers: User[],
  users: User[],
  setUsers: (users: User[]) => void
) => {
  
  // Handle bulk delete
  const handleBulkDelete = useCallback(() => {
    baseHandleBulkDelete(selectedUsers, users, setUsers);
  }, [baseHandleBulkDelete, selectedUsers, users, setUsers]);
  
  // Handle bulk activate
  const handleBulkActivate = useCallback(() => {
    baseHandleBulkActivate(selectedUsers, users, setUsers);
  }, [baseHandleBulkActivate, selectedUsers, users, setUsers]);
  
  // Handle bulk deactivate
  const handleBulkDeactivate = useCallback(() => {
    baseHandleBulkDeactivate(selectedUsers, users, setUsers);
  }, [baseHandleBulkDeactivate, selectedUsers, users, setUsers]);
  
  return {
    handleBulkDelete,
    handleBulkActivate,
    handleBulkDeactivate
  };
};
