import { useState, useCallback } from 'react';
import { User } from '../../types';

export const useUserSelection = () => {
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  const toggleUserSelection = useCallback((user: User) => {
    console.log('Toggling user selection:', user.id);
    setSelectedUsers(prev => 
      prev.some(selectedUser => selectedUser.id === user.id) 
        ? prev.filter(selectedUser => selectedUser.id !== user.id) 
        : [...prev, user]
    );
  }, []);

  // Modified to not require parameters - will use a closure to access the filtered users
  const toggleAllUsers = useCallback(() => {
    console.log('Toggling all users selection');
    setSelectedUsers(prev => {
      // If there are any selected users, deselect all
      if (prev.length > 0) {
        return [];
      } else {
        // Otherwise, select all users that are currently shown
        // This will be handled in UserManagement.tsx where we have access to filteredUsers
        return [];
      }
    });
  }, []);

  const selectMultipleUsers = useCallback((users: User[]) => {
    setSelectedUsers(users);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedUsers([]);
  }, []);

  const isUserSelected = useCallback((userId: string) => {
    return selectedUsers.some(user => user.id === userId);
  }, [selectedUsers]);

  const isAllSelected = useCallback((filteredUsers: User[]) => {
    return filteredUsers.length > 0 && 
      selectedUsers.length === filteredUsers.length && 
      filteredUsers.every(user => selectedUsers.some(selectedUser => selectedUser.id === user.id));
  }, [selectedUsers]);

  return {
    selectedUsers,
    setSelectedUsers,
    toggleUserSelection,
    toggleAllUsers,
    selectMultipleUsers,
    clearSelection,
    isUserSelected,
    isAllSelected
  };
};
